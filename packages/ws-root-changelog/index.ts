/**
 * 工作區根目錄 Changelog 模組
 * Workspace Root Changelog Module
 *
 * 為 Monorepo 工作區根目錄生成包含所有套件 Changelog 連結的總覽文件
 * Generates overview document with links to all package changelogs for Monorepo workspace root
 */

import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { normalizeListableRowExtra } from 'ws-pkg-list/lib/util';
import { findRootLazy } from '@yarn-tool/find-root';
import { writeFileSync, promises } from 'fs';
import { resolve } from 'upath2';

/**
 * 列出所有套件的 Changelog 連結
 * List changelog links for all packages
 *
 * @param {string} cwd - 工作區根目錄 / Workspace root directory
 * @returns {string[]} Markdown 格式的套件連結列表 / List of package links in Markdown format
 * @throws {RangeError} 當工作區中沒有找到任何套件時拋出錯誤
 *                     Throws error when no packages found in workspace
 */
export function listChangelog(cwd: string)
{
	/**
	 * 儲存 Markdown 行內容
	 * Store Markdown line contents
	 */
	const list: string[] = [];

	/**
	 * 遍歷工作區中的所有套件
	 * Iterate through all packages in workspace
	 */
	wsPkgListable(cwd, {
		handler(row)
		{
			return normalizeListableRowExtra(row, cwd)
		},
	})
		.forEach((row) =>
		{

			row = normalizeListableRowExtra(row, cwd);

			/**
			 * 根據套件是否為私有選擇圖示
			 * Select icon based on whether package is private
			 */
			const icon = row.private ? `🔒` : `🌏`;

			/**
			 * 產生 Markdown 連結行
			 * Generate Markdown link line
			 */
			list.push(`* ${icon} [\`${row.name}\`](./${row.prefix}/CHANGELOG.md "${row.prefix}") *${row.prefix}*`);

		})
	;

	/**
	 * 若沒有找到任何套件，拋出錯誤
	 * Throw error if no packages found
	 */
	if (!list.length)
	{
		throw new RangeError(`can't found any packages in current workspace: ${cwd}`);
	}

	return list
}

/**
 * 查找工作區根目錄路徑（內部函數）
 * Find workspace root path (internal function)
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @returns {string} 工作區根目錄路徑 / Workspace root path
 */
export function _findWorkspacesRootPath(cwd?: string)
{
	return findRootLazy({
		cwd: cwd ?? process.cwd(),
		throwError: true,
		shouldHasWorkspaces: true,
	}).ws
}

/**
 * 獲取工作區根目錄 Changelog 檔案路徑
 * Get workspace root changelog file path
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {string} [filename] - 檔案名稱，預設為 './CHANGELOG.md' / Filename, default is './CHANGELOG.md'
 * @returns {string} 完整的檔案路徑 / Full file path
 */
export function getWorkspacesRootChangelogPath(cwd?: string, filename?: string)
{
	cwd = _findWorkspacesRootPath(cwd);
	filename ??= `./CHANGELOG.md`;

	return resolve(cwd, filename)
}

/**
 * 輸出工作區根目錄 Changelog（同步）
 * Output workspace root changelog (sync)
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {string} [filename] - 檔案名稱 / Filename
 * @returns {Object} 包含檔案路徑和內容的物件 / Object containing file path and content
 */
export function outputWorkspacesRootChangelog(cwd?: string, filename?: string)
{
	cwd = _findWorkspacesRootPath(cwd);
	const md = createWorkspacesRootChangelog(cwd);

	const file = getWorkspacesRootChangelogPath(cwd, filename);

	writeFileSync(file, md);

	return {
		file,
		md,
	}
}

/**
 * 輸出工作區根目錄 Changelog（非同步）
 * Output workspace root changelog (async)
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {string} [filename] - 檔案名稱 / Filename
 * @returns {Promise<Object>} 包含檔案路徑和內容的物件 / Object containing file path and content
 */
export async function outputWorkspacesRootChangelogAsync(cwd?: string, filename?: string)
{
	cwd = _findWorkspacesRootPath(cwd);
	const md = createWorkspacesRootChangelog(cwd);

	const file = getWorkspacesRootChangelogPath(cwd, filename);

	await promises.writeFile(file, md);

	return {
		file,
		md,
	}
}

/**
 * 建立工作區根目錄 Changelog 內容
 * Create workspace root changelog content
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @returns {string} Markdown 格式的 Changelog 內容 / Changelog content in Markdown format
 */
export function createWorkspacesRootChangelog(cwd?: string)
{
	/**
	 * 儲存 Markdown 行內容
	 * Store Markdown line contents
	 */
	const list: string[] = [];

	/**
	 * 加入標題和說明
	 * Add title and description
	 */
	list.push('# Change Log');
	list.push('');
	list.push('Please see the individual package changelogs for what\'s new:');
	list.push('');

	/**
	 * 查找並設定工作區根目錄
	 * Find and set workspace root
	 */
	cwd = _findWorkspacesRootPath(cwd);

	/**
	 * 加入所有套件的 Changelog 連結
	 * Add changelog links for all packages
	 */
	list.push(...listChangelog(cwd));

	list.push('');
	list.push('');

	return list.join('\n')
}

/**
 * 預設匯出函數
 * Default export function
 */
export default createWorkspacesRootChangelog
