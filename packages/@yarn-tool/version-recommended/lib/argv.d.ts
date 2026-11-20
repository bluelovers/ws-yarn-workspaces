import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
import { INextVersionRecommendedOptions } from './types';
/**
 * 註冊與 `yarn version` 相容的命令列選項
 *
 * 選項命名刻意沿用 yarn classic，讓既有腳本不需修改即可改用本套件。
 *
 * @see https://classic.yarnpkg.com/lang/en/docs/cli/version/
 * @param yargs - yargs 實例
 * @returns 註冊選項後的 yargs
 */
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<Argv<T & {
    "no-git-tag-version": boolean;
} & {
    "no-commit-hooks": boolean;
} & {
    "new-version": string;
} & {
    major: boolean;
} & {
    minor: boolean;
} & {
    patch: boolean;
} & {
    premajor: boolean;
} & {
    preminor: boolean;
} & {
    prepatch: boolean;
} & {
    prerelease: boolean;
} & {
    "non-interactive": boolean;
} & {
    bump: string;
} & {
    preid: string;
} & {
    "default-preid": string;
} & {
    cwd: string;
} & {
    "version-style": string;
} & {
    "reset-daily-increment": boolean;
}>>;
/**
 * 從 yargs 解析結果取出版本推薦選項
 *
 * 與 setupToYargs 註冊的選項同處維護，
 * 新增選項時不會因為 bin 端逐一轉交而漏掉
 *
 * @param argv - yargs 解析結果
 * @returns 傳給 nextVersionRecommended 系列的選項
 */
export declare function toNextVersionRecommendedOptions(argv: Partial<ReturnType<typeof setupToYargs>['argv']>): INextVersionRecommendedOptions;
