import { Project as LernaProject } from '@lerna/project';
import { resolve, normalize } from 'upath2';
import { IWorkspacesProjectInternal, EnumWorkspacesProject, IPackedManifest } from './lib/types';
import { findWorkspaceRoot } from 'find-yarn-workspace-root2/core';
import { checkPaths, EnumCheckPaths } from './lib/util';
import type { ILernaJson, IReleaseType } from '@ts-type/package-dts/lerna-json';
import type { IChangelogPreset } from '@yarn-tool/changelog';
import { merge } from 'lodash';
import { sortObjectKeys } from 'sort-object-keys2';
import { pathExistsSync } from 'fs-extra';

export class WorkspacesProject
{

	/**
	 * @see https://github.com/lerna/lerna/tree/master/core/project
	 */
	protected _project: LernaProject & {
		config: ILernaJson,
	};

	#internal: IWorkspacesProjectInternal = {} as any;

	constructor(cwd?: string, options?: {
		skipStrictCheck?: boolean
	})
	{
		cwd = resolve(cwd || process.cwd());

		let root = findWorkspaceRoot(cwd);

		this._project = new LernaProject(cwd)
		let rootPath: string = this._project.rootPath;

		switch (checkPaths({
			root,
			rootPath,
		}, options))
		{
			case EnumCheckPaths.root:
				this._project = new LernaProject(root);
				break;
			case EnumCheckPaths.failed:
				throw new Error(`lerna root is not match yarn workspaces root.\ncwd: ${cwd}\nyarn: ${root}\nlerna: ${rootPath}`);
				break;
		}

		if (root?.length)
		{
			if (typeof this.config.npmClient === 'undefined' && this.config.useWorkspaces !== false)
			{
				this.npmClient = 'yarn';
				this.config.useWorkspaces = true;
			}
		}

		this._project.rootPath = normalize(this._project.rootPath);

		this._project.rootConfigLocation = normalize(this._project.rootConfigLocation);
	}

	protected _hasInternal<K extends keyof IWorkspacesProjectInternal>(field: K)
	{
		return field in this.#internal
	}

	protected _getInternal<K extends keyof IWorkspacesProjectInternal>(field: K)
	{
		return this.#internal[field]
	}

	protected _setInternal<K extends keyof IWorkspacesProjectInternal>(field: K, value: IWorkspacesProjectInternal[K])
	{
		return this.#internal[field] = value
	}

	get rootPath(): string
	{
		return this._project.rootPath
	}

	get lernaConfigLocation(): string
	{
		return this._project.rootConfigLocation
	}

	get npmClient(): string
	{
		return this._project.config.npmClient
	}

	set npmClient(value: string)
	{
		this._project.config.npmClient = value
	}

	get workspaces(): string[]
	{
		let ws: string[];

		if (this._hasInternal('workspaces'))
		{
			ws = this._getInternal('workspaces')
		}
		else
		{
			try
			{
				ws = this._project.packageConfigs;
			}
			catch (e)
			{

			}

			if (!ws?.length)
			{
				ws = [EnumWorkspacesProject.workspace]
			}

			this._setInternal('workspaces', ws)
		}

		return ws;
	}

	get defaultWorkspace(): string
	{
		if (this._hasInternal('defaultWorkspace'))
		{
			return this._getInternal('defaultWorkspace')
		}

		if (this.workspaces.includes(EnumWorkspacesProject.workspace))
		{
			return EnumWorkspacesProject.workspace
		}

		return this.workspaces[0]
	}

	set defaultWorkspace(value: string)
	{
		if (!this.workspaces.includes(value))
		{
			throw new RangeError(`${value} not exists in ${this.workspaces}`)
		}

		this.#internal.defaultWorkspace = value;
	}

	isIndependent()
	{
		return this.version === EnumWorkspacesProject.independent;
	}

	get version(): string | EnumWorkspacesProject.independent
	{
		return this._project.config.version ?? EnumWorkspacesProject.independent;
	}

	set version(val: string | EnumWorkspacesProject.independent)
	{
		this._project.config.version = val;
	}

	/**
	 * @see https://github.com/lerna/lerna/tree/master/core/package
	 */
	get manifest(): IPackedManifest
	{
		return this._project.manifest
	}

	get config(): ILernaJson
	{
		let ws = this.workspaces;

		if ('workspaces' in this._project.config)
		{
			this._project.config.workspaces = ws
		}
		else if ('packages' in this._project.config || 1)
		{
			this._project.config.packages = ws
		}

		this._project.config.version = this.version;

		let w = this.defaultWorkspace;

		if (ws[0] !== w)
		{
			let i = ws.indexOf(w)

			if (i !== -1)
			{
				ws.splice(i, 1);
				ws.unshift(w)
			}

		}

		return this._project.config
	}

	get bump(): IReleaseType
	{
		const command = this._project.config.command

		return command?.publish?.bump ?? command?.version?.bump
	}

	get changelogPreset(): IChangelogPreset
	{
		const command = this._project.config.command

		return command?.version?.changelogPreset ?? command?.publish?.changelogPreset
	}

	get releaseConfig()
	{
		const command = this._project.config.command

		this.#internal.releaseConfig = merge(this.#internal.releaseConfig, command?.version, command?.publish, {
			changelogPreset: this.changelogPreset,
			bump: this.bump,
			conventionalGraduate: command?.publish?.conventionalGraduate ?? command?.version?.conventionalGraduate,
		});

		this.#internal.releaseConfig = sortObjectKeys(this.#internal.releaseConfig) as any

		return this.#internal.releaseConfig
	}

	existsLernaConfigFile()
	{
		return pathExistsSync(this.lernaConfigLocation)
	}

}

export default WorkspacesProject

