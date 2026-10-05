/**
 * 對套件目錄建立 git tag
 * Create a git tag for a package directory
 *
 * 此檔負責「找到正確的套件目錄並避免誤標」，標籤名稱則交給 core.ts。
 * This file finds the correct package directory and guards against wrong
 * tagging; the tag name itself comes from core.ts.
 */
import { IOptionsPackageTagInput, IOptionsPackageTag } from './types';
import { formatPackageTag, handleOptions } from './core';
import { gitTag, gitTagSync, IOptions } from '@git-lazy/tag';
import { crossSpawnGitSync, crossSpawnGitAsync, ISpawnGitAsyncOptions, ISpawnGitSyncOptions } from '@git-lazy/spawn';
import pkgDir from 'pkg-dir';
import { pathIsSame } from 'path-is-same';
import { findRoot } from '@yarn-tool/find-root';
import { join } from 'path';

/**
 * 建立 git tag（非同步）
 * Create a git tag (async)
 *
 * @param options - 標籤選項 / Tag options
 * @param spawnOptions - git 子行程選項 / git subprocess options
 * @returns gitTag 的執行結果，含 exitCode / gitTag result including exitCode
 * @throws Error 於 workspace 根目錄或 cwd 與套件目錄不符時 / When at the workspace root or when cwd differs from the package dir
 */
export async function gitPackageTag(options: IOptionsPackageTag, spawnOptions?: ISpawnGitAsyncOptions)
{
	let cwd = options?.cwd ?? process.cwd();

	let rootData = findRoot({
		cwd,
	})

	/**
	 * 兩道防護：workspaces 根目錄本身不是可發布套件，
	 * 對它打標籤會讓所有成員共用同一個誤標；
	 * cwd 與套件目錄不同則代表呼叫端可能指錯資料夾。
	 *
	 * Two guards: the workspaces root is not a publishable package and
	 * tagging it would give every member one wrong tag, while a cwd that
	 * differs from the package dir suggests the caller pointed at the
	 * wrong folder.
	 */
	if (rootData.hasWorkspace && rootData.isWorkspace)
	{
		throw new Error(`disallow create git tag for workspace root`)
	}
	else if (!pathIsSame(rootData.pkg, cwd))
	{
		throw new Error(`cwd must be same as package dir\n${rootData.pkg}\n${cwd}`)
	}

	/**
	 * 未提供 pkg 時自動載入，
	 * 使用 import() 可同時相容 CJS 與 ESM 的 package.json 讀取
	 *
	 * Load pkg automatically when absent; import() works with both CJS and
	 * ESM package.json shapes
	 */
	if (!options.pkg)
	{
		options.pkg = await import(join(rootData.pkg, 'package.json'))
			.then(m => m.default || m)
		;
	}

	/** 後續解析一律以套件目錄為基準，避免 cwd 參數被外部改動影響 / Anchor everything to the package dir so external cwd changes cannot affect it */
	cwd = options.cwd = rootData.pkg;

	options = handleOptions(options as any)

	const tag = formatPackageTag(options as any);

	/** 未指定訊息時以標籤名稱作為 commit/tag 訊息，保持可追溯 / Default the message to the tag name so it stays traceable */
	options.message = options.message ?? tag;

	spawnOptions = {
		...spawnOptions,
		cwd,
	}

	return gitTag(tag, options, spawnOptions)
}

export default gitPackageTag
