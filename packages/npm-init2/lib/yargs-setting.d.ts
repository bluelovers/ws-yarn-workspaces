/**
 * Created by user on 2019/5/16.
 */
/**
 * @fileoverview CLI option definitions for npm-init2
 * @description npm-init2 的命令列選項定義
 *
 * 選項集中在這裡註冊，主流程（index.ts）只讀取解析後的 argv，
 * 如此可單獨替換選項定義而不影響初始化邏輯。
 * Options are registered here while the main flow (index.ts) only reads the parsed argv, so the
 * option definitions can change without touching the initialization logic.
 *
 * @module npm-init2/lib/yargs-setting
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
/**
 * 預設匯出 setupToYargs，讓 `import setupToYargs from '...'` 可直接使用
 * Default-export setupToYargs so `import setupToYargs from '...'` works directly
 */
export default setupToYargs;
