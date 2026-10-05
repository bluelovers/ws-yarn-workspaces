/**
 * @yarn-tool/fix-all/lib/file/reset
 *
 * 重置靜態檔案模組
 * Static file reset module
 *
 * 在 resetStaticFiles 啟用時，先刪除既有的靜態檔案（含 .tpl 樣板），
 * 讓後續流程能重新複製最新版本
 * When resetStaticFiles is enabled, deletes existing static files (including
 * .tpl templates) so the following step can copy fresh copies
 */
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { resolve } from 'upath2';
import { fsRemoveFileSync } from 'fs-remove-extra';

/**
 * 刪除指定目錄下可被重新複製的靜態檔案
 * Delete static files under the given directory that can be re-copied
 *
 * 清單中刻意包含 .tpl 檔與重複的 .nowignore：
 * - .tpl 樣板若不刪除，複製流程可能因檔案已存在而略過更新
 * - 重複項目在 fsRemoveFileSync 內為冪等操作，無副作用
 * The list intentionally includes .tpl templates and a duplicate .nowignore:
 * - Without removing .tpl templates, the copy step may skip updating them
 *   because the files already exist
 * - Duplicate entries are idempotent inside fsRemoveFileSync and harmless
 *
 * @param cwd - 要清理的目錄路徑 / Directory to clean up
 * @param options.rootData - 根目錄資料（預留供未來判斷專案型別使用）/ Root data (reserved for future project-type checks)
 */
export function _resetStaticFiles(cwd: string, options: {
	rootData: IFindRootReturnType
})
{
	for (const file of [
		'.gitignore',
		'.npmignore',
		'jest.config.js',
		'jest-preset.js',
		'.nowignore',
		'.editorconfig.tpl',
		'jest.config.js.tpl',
		'.yarnrc.yml.tpl',
		'tsc-multi.json.tpl',
		'tsconfig.esm.json.tpl',
		'tsconfig.json.tpl',
		'tsconfig.tsdx.json.tpl',
		'tsdx.config.js.tpl',
		'.nycrc.tpl',
		'.npmrc.tpl',
		'.mocharc.yml.tpl',
		'.nowignore',
		'.browserslistrc',
		'.browserslistrc.tpl',
	] as const)
	{
		/**
		 * 檔案不存在時也不會拋錯，可安全重複執行
		 * Safe to re-run; missing files do not throw
		 */
		fsRemoveFileSync(resolve(cwd, file))
	}
}
