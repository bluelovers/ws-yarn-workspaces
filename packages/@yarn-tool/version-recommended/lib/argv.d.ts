import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
/**
 * 註冊與 `yarn version` 相容的命令列選項
 * Register CLI options compatible with `yarn version`
 *
 * 選項命名刻意沿用 yarn classic，讓既有腳本不需修改即可改用本套件。
 * Option names deliberately follow yarn classic so existing scripts can
 * switch to this package without changes.
 *
 * @see https://classic.yarnpkg.com/lang/en/docs/cli/version/
 * @param yargs - yargs 實例 / yargs instance
 * @returns 註冊選項後的 yargs / yargs with options registered
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
}>>;
