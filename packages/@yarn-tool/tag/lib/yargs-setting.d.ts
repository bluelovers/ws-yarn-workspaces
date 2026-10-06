/**
 * yt-tag 的 yargs 選項設定
 * yargs option settings for yt-tag
 */
import yargs, { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
/**
 * 註冊 CLI 選項
 * Register CLI options
 *
 * 選項名稱採 kebab-case 以符合 git 慣例，內部再由 bin 轉為 camelCase 欄位。
 * Option names use kebab-case to match git conventions; bin converts them to
 * camelCase fields.
 *
 * @param yargs - yargs 實例 / yargs instance
 * @returns 註冊選項後的 yargs / yargs with options registered
 */
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<yargs.Argv<T & {
    cwd: string;
} & {
    "tag-prefix": string;
} & {
    "exclude-name": boolean;
} & {
    message: string;
} & {
    "force-git-tag": boolean;
} & {
    "sign-git-tag": boolean;
}>>;
export default setupToYargs;
