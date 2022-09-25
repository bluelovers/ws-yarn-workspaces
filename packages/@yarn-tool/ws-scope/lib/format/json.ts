import { pathExistsSync } from 'fs-extra';
import { ScopeJsonObject } from './json-object';
import { readJSONSync } from '@bluelovers/fs-json';
import { writePackageJSONSync } from '@yarn-tool/write-package-json';

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
		return this.opened && writePackageJSONSync(this.file, this.json)
	}

	loadFileLazy(reload?: boolean)
	{
		return this.existsFile() && this.loadFile(reload)
	}

}
