/**
 * Created by user on 2019/5/16.
 */
import yargs from 'yargs';
import { Argv } from 'yargs';
/**
 * 設定 Yargs CLI 選項
 * Setup Yargs CLI options
 *
 * 繼承 @yarn-tool/fix-all 的共用選項
 * （overwriteHostedGitInfo / branch / resetStaticFiles / addStaticFiles / noStaticFiles）
 * Inherits shared options from @yarn-tool/fix-all
 * (overwriteHostedGitInfo / branch / resetStaticFiles / addStaticFiles / noStaticFiles)
 *
 * @param yargs - Yargs 實例 / Yargs instance
 */
export declare function setupToYargs<T>(yargs: Argv<T>): import("@yarn-tool/types").IYargsSync<yargs.Argv<yargs.Omit<T, never> & {
    npmClient: string;
} & {
    yes: boolean;
} & {
    cwd: string;
} & {
    skipCheckWorkspace: boolean;
} & {
    force: boolean;
} & {
    sort: boolean;
} & {
    private: boolean;
} & {
    createModule: string;
} & {
    name: string;
} & {
    copyStatic: boolean;
} & {
    tsdx: boolean;
} & {
    overwriteHostedGitInfo: boolean;
} & {
    branch: string;
} & {
    resetStaticFiles: boolean;
} & {
    addStaticFiles: boolean;
} & {
    noStaticFiles: boolean;
}>>;
export default setupToYargs;
