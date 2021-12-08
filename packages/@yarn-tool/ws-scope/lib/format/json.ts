import { pathExistsSync, readJSONSync, writeJSONSync } from 'fs-extra';
import { ScopeJsonObject } from './json-object';

export class ScopeJson<K extends string = 'workspaces'> extends ScopeJsonObject<K>
{

	existsFile()
	{
		return pathExistsSync(this.file)
	}

	loadFile(reload?: boolean)
	{
		if (reload || !this.opened)
		{
			this.json = readJSONSync(this.file);
		}

		return this.json
	}

	saveFile()
	{
		return this.opened && writeJSONSync(this.file, this.json, {
			spaces: 2,
		})
	}

	loadFileLazy(reload?: boolean)
	{
		return this.existsFile() && this.loadFile(reload)
	}

}
