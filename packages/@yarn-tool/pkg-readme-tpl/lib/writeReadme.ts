import { existsSync, readFileSync, writeFileSync } from "fs-extra";
import { join } from "path";
import lodashTemplate from 'lodash/template';

export interface IOptionsWriteReadme<T extends Record<any, any> = Record<any, any>>
{
	file: string,
	variable: T,
}

export function _readReadmeTplCore(md1: string | Buffer)
{
	let compiled = lodashTemplate(md1.toString(), {
		//escape: new RegExp('_'),
	})

	return compiled;
}

export function writeReadme<T extends Record<any, any> = Record<any, any>>(options: IOptionsWriteReadme<T>)
{
	if (existsSync(options.file))
	{
		let md1 = readFileSync(options.file).toString();

		let compiled = _readReadmeTplCore(md1);

		let md2 = compiled(options.variable)

		if (md1 !== md2)
		{
			writeFileSync(options.file, md2)
		}
	}
}
