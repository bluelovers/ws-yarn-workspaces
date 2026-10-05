/**
 * 由 package.json 取得版本號並推薦下一個版本
 * Recommend the next version from a package.json
 */
import { nextVersionRecommendedByWorkspacesProject, nextVersionRecommendedByWorkspacesFindUp } from './ws';
import { findRoot } from '@yarn-tool/find-root';
import { readPackageJson } from '@ts-type/package-dts';
import { join } from 'path';
import { INextVersionRecommendedOptions } from './types';
import { IPackageJson } from '@ts-type/package-dts/package-json';

/**
 * 由傳入的 package 物件計算推薦版本
 * Recommend a version from an explicit package object
 *
 * @param pkg - 含 version 欄位的 package 物件 / Package object with a version field
 * @param options - 推薦選項 / Recommendation options
 * @returns 推薦結果，額外帶有原始 pkg / Recommendation result, plus the original pkg
 * @throws TypeError 當 pkg.version 缺失時 / When pkg.version is missing
 */
export function nextVersionRecommendedByPackage<T extends {
	name?: string
	version?: string
}>(pkg: T, options?: INextVersionRecommendedOptions)
{
	/**
	 * 提前失敗而非讓 semver 解析出錯：
	 * 缺少版本號代表呼叫端傳錯資料，錯誤訊息需指出 pkg.version
	 *
	 * Fail early instead of letting semver throw: a missing version means the
	 * caller passed wrong data, so the message must name pkg.version
	 */
	if (typeof pkg.version !== 'string' || !pkg.version.length)
	{
		throw  new TypeError(`pkg.version is require`)
	}

	return {
		...nextVersionRecommendedByWorkspacesFindUp(pkg.version, options),
		pkg,
	}
}

/**
 * 自 cwd 向上尋找專案根目錄並讀取 package.json 後計算推薦版本
 * Find the project root from cwd upward, read package.json, then recommend
 *
 * 為套件預設匯出：多數 CLI 使用情境只需給 cwd。
 *
 * This is the default export: most CLI usage only needs to supply cwd.
 *
 * @param options - 推薦選項，cwd 預設為 process.cwd() / Recommendation options; cwd defaults to process.cwd()
 * @returns 推薦結果，額外帶有讀取到的 pkg / Recommendation result, plus the loaded pkg
 */
export function nextVersionRecommendedByPackageFindUp<T extends {
	name?: string
	version?: string
	// @ts-ignore
} = IPackageJson>(options?: INextVersionRecommendedOptions)
{
	options ??= {};
	/** 明確指定預設 cwd，避免 findRoot 依賴呼叫端的隱含狀態 / Set the cwd explicitly so findRoot does not depend on implicit caller state */
	options.cwd ??= process.cwd();

	let rootData = findRoot(options as any)

	let pkg = readPackageJson(join(rootData.pkg, 'package.json'))

	/**
	 * 讀取 package.json 後改以 workspaces 根目錄作為 cwd，
	 * 讓後續 WorkspacesProject 從真正的專案根目錄開始解析
	 *
	 * After reading package.json, switch cwd to the workspaces root so the
	 * WorkspacesProject resolves from the real project root
	 */
	options.cwd = rootData.root;

	// @ts-ignore
	return nextVersionRecommendedByPackage<T>(pkg as T, options)
}
