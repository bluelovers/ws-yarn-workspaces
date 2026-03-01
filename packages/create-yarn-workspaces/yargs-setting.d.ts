/**
 * Yargs 命令列參數設定模組
 * Yargs Command Line Arguments Configuration Module
 *
 * 提供 Workspaces 初始化相關的命令列參數設定與驗證
 * Provides command line argument configuration and validation for
 * workspace initialization
 *
 * @author user
 * @since 2019/5/16
 */
import yargs from 'yargs';
import { Argv } from 'yargs';
/**
 * 設定 Workspaces 初始化相關的 Yargs 選項
 * Setup Yargs options for workspaces initialization
 *
 * 配置命令列參數，包含：
 * - name: Package 名稱
 * - ignoreExistsPackage: 忽略已存在的 Package
 * - ignoreParentWorkspaces: 忽略父層 Workspaces
 * - debug: 啟用除錯模式
 *
 * Configures command line arguments including:
 * - name: Package name
 * - ignoreExistsPackage: Ignore existing package
 * - ignoreParentWorkspaces: Ignore parent workspaces
 * - debug: Enable debug mode
 *
 * @template T - Yargs 參數類型 / Yargs argument type
 * @param yargs - Yargs 實例 / Yargs instance
 * @returns 配置後的 Yargs 實例 / Configured Yargs instance
 */
export declare function setupWorkspacesInitToYargs<T extends any>(yargs: Argv<T>): yargs.Argv<yargs.Omit<T, never> & {
    name: string;
} & {
    ignoreExistsPackage: boolean;
} & {
    ignoreParentWorkspaces: boolean;
} & {
    debug: boolean;
}>;
/**
 * 預設導出設定函式
 * Default export of setup function
 */
export default setupWorkspacesInitToYargs;
