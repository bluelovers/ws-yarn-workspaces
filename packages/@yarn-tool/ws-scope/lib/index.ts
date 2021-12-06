import { findRootLazy, IFindRootReturnType } from '@yarn-tool/find-root';
import { resolve } from 'upath2';
import { ScopeJson } from './format/json';
import { ScopeYaml } from './format/yaml';
import { array_unique_overwrite } from 'array-hyper-unique';

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

		this._root_package_json.existsFile() && this._root_package_json.loadFile();
		this._root_lerna_json.existsFile() && this._root_lerna_json.loadFile();
		this._root_pnpm_workspace_yaml.existsFile() && this._root_pnpm_workspace_yaml.loadFile();
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
		this._root_package_json.add(scope);
		this._root_lerna_json.add(scope);
		this._root_pnpm_workspace_yaml.add(scope);
	}

	remove(scope: string)
	{
		this._root_package_json.remove(scope);
		this._root_lerna_json.remove(scope);
		this._root_pnpm_workspace_yaml.remove(scope);
	}

	save()
	{
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
