/**
 * 對套件目錄建立 git tag
 * Create a git tag for a package directory
 *
 * 此檔負責「找到正確的套件目錄並避免誤標」，標籤名稱則交給 core.ts。
 * This file finds the correct package directory and guards against wrong
 * tagging; the tag name itself comes from core.ts.
 */
import { IOptionsPackageTag } from './types';
import { ISpawnGitAsyncOptions } from '@git-lazy/spawn';
/**
 * 建立 git tag（非同步）
 * Create a git tag (async)
 *
 * @param options - 標籤選項 / Tag options
 * @param spawnOptions - git 子行程選項 / git subprocess options
 * @returns gitTag 的執行結果，含 exitCode / gitTag result including exitCode
 * @throws Error 於 workspace 根目錄或 cwd 與套件目錄不符時 / When at the workspace root or when cwd differs from the package dir
 */
export declare function gitPackageTag(options: IOptionsPackageTag, spawnOptions?: ISpawnGitAsyncOptions): Promise<import("@git-lazy/spawn").SpawnASyncReturns<string | Buffer<ArrayBufferLike>>>;
export default gitPackageTag;
