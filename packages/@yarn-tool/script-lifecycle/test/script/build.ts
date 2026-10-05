/**
 * Created by user on 2020/4/8.
 */

import FastGlob from '@bluelovers/fast-glob'
import { join, parse } from 'path'
import { outputFile } from 'fs-extra';

/**
 * 掃描 lib/lifecycle/ 下所有手寫的生命週期定義檔，
 * 自動重新產生 lib/lifecycle.ts（lifecycleMap 的彙整檔），
 * 讓新增生命週期檔時不必手動維護 import 與欄位列表。
 *
 * Scans every handwritten lifecycle definition under lib/lifecycle/ and
 * regenerates lib/lifecycle.ts (the aggregated lifecycleMap), so adding a new
 * lifecycle file no longer requires maintaining the import/field lists by hand.
 */
FastGlob
	.async([
	"*.ts",
	"!*.d.ts"
], {
	cwd: join(__dirname, '../..', 'lib', 'lifecycle'),
})
	.then((result) => {

		/**
		 * 以單次 reduce 同時收集 import 陳述式與欄位名稱，
		 * 避免對同一份檔案清單遍歷兩次。
		 *
		 * A single reduce collects both the import statements and the field names,
		 * avoiding a second pass over the same file list.
		 */
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

		/**
		 * 覆寫 lib/lifecycle.ts；模板內容刻意保持與既有手寫版本一致的格式，
		 * 讓重新產生後的 diff 只會出現在新增/刪除的生命週期檔上。
		 *
		 * Overwrites lib/lifecycle.ts; the template intentionally mirrors the format of
		 * the existing handwritten version so regeneration only diffs on added/removed
		 * lifecycle files.
		 */
		return outputFile(join(__dirname, '../..', 'lib', 'lifecycle.ts'), `
${content.import.join('\n')}

export const lifecycleMap = {
\t${content.body.join(',\n\t')}
}
export default lifecycleMap
`)
	})
;

