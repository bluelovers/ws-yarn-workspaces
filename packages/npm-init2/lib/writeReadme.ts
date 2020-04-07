import { existsSync, readFileSync } from "fs-extra";
import { join } from "path";
import lodashTemplate from 'lodash/template';
import { writeFileSync } from "fs";

export function writeReadme(options: {
	file: string,
	variable: Record<any, any>,
})
{
	if (existsSync(options.file))
	{
		let md1 = readFileSync(options.file).toString();
		let compiled = lodashTemplate(md1.toString(), {
			//escape: new RegExp('_'),
		})

		let md2 = compiled(options.variable)

		if (md1 !== md2)
		{
			writeFileSync(options.file, md2)
		}
	}
}
