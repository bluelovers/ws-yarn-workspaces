/**
 * Created by user on 2020/4/8.
 */

import FastGlob from '@bluelovers/fast-glob'
import { join, parse } from 'path'
import { outputFile } from 'fs-extra';

FastGlob
	.async([
	"*.ts",
	"!*.d.ts"
], {
	cwd: join(__dirname, '../..', 'lib', 'lifecycle'),
})
	.then((result) => {

		let content = result
			.reduce((content, file) => {
				let fd = parse(file);

				content.import.push(`import ${fd.name} from './lifecycle/${fd.name}'`);

				content.body.push(`${fd.name}`);

				return content;
			}, {
				import: [] as string[],
				body: [] as string[],
			})
		;

		return outputFile(join(__dirname, '../..', 'lib', 'lifecycle.ts'), `
${content.import.join('\n')}

export const lifecycleMap = {
\t${content.body.join(',\n\t')}
}
export default lifecycleMap
`)
	})
;

