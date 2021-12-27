import { findRootLazy, IFindRootReturnType } from '@yarn-tool/find-root';
import { basename, resolve } from 'upath2';
import { ScopeJson } from './format/json';
import { ScopeYaml } from './format/yaml';
import { array_unique_overwrite } from 'array-hyper-unique';
import { assertScopePath } from './util/check-scope';
import { sortLernaJson } from '@yarn-tool/sort-lerna-json';

export class WorkspacesScope
{
	rootData: IFindRootReturnType;

	_root_package_json: ScopeJson<'workspaces'>;
	_root_lerna_json: ScopeJson<'packages'>;
	_root_pnpm_workspace_yaml: ScopeJson<'packages'>;

	constructor(cwd?: string)
	{
		this.rootData = findRootLazy({
			cwd,
			throwError: true,
			shouldHasWorkspaces: true,
		});

		this._root_package_json = new ScopeJson(this.resolvePath('package.json'), {
			field: 'workspaces',
		});
		this._root_lerna_json = new ScopeJson(this.resolvePath('lerna.json'), {
			field: 'packages',
		});
		this._root_pnpm_workspace_yaml = new ScopeYaml(this.resolvePath('pnpm-workspace.yaml'), {
			field: 'packages',
		});

		this._root_package_json.loadFileLazy();
		this._root_lerna_json.loadFileLazy();
		this._root_pnpm_workspace_yaml.loadFileLazy();
	}

	get changed()
	{
		return this._root_package_json.changed || this._root_lerna_json.changed || this._root_pnpm_workspace_yaml.changed;
	}

	resolvePath(...paths: [string, ...string[]])
	{
		if (!paths.length)
		{
			throw new SyntaxError(`Invalid arguments: ${paths}`)
		}

		return resolve(this.rootData.ws, ...paths);
	}

	add(scope: string)
	{
		if (scope === basename(scope))
		{
			scope = `packages/${scope}/*`
		}

		assertScopePath(scope, this.rootData.ws);

		this._root_package_json.addLazy(scope);
		this._root_lerna_json.addLazy(scope);
		this._root_pnpm_workspace_yaml.addLazy(scope);

		return scope
	}

	remove(scope: string)
	{
		if (scope === basename(scope))
		{
			scope = `packages/${scope}/*`
		}

		assertScopePath(scope, this.rootData.ws);

		this._root_package_json.removeLazy(scope);
		this._root_lerna_json.removeLazy(scope);
		this._root_pnpm_workspace_yaml.removeLazy(scope);

		return scope
	}

	save()
	{
		if (this._root_lerna_json.opened)
		{
			sortLernaJson(this._root_lerna_json.json);
		}

		this._root_package_json.saveFile();
		this._root_lerna_json.saveFile();
		this._root_pnpm_workspace_yaml.saveFile();
	}

	get value()
	{
		const value = [
			this._root_package_json.value,
			this._root_lerna_json.value,
			this._root_pnpm_workspace_yaml.value,
		].flat().filter(v => v?.length)

		return array_unique_overwrite(value)
	}

	syncValue()
	{
		const value = this.value
			.filter(v => v?.length && !v.startsWith('!'))
		;

		array_unique_overwrite(value);

		value.forEach(scope => this.add(scope));

		return value
	}

}

export default WorkspacesScope
