/**
 * 將套件來源目錄以符號連結 (Symlink) 掛入 node_modules 的工具函式
 * Utility functions that link a package source directory into node_modules via symlink
 *
 * 路徑未完整指定時會自動向上推斷工作區根目錄 (Workspace Root) 與套件根目錄，
 * 並可透過內建 CLI 命令 `node-modules-link` 操作。
 * When paths are incomplete, the workspace root and package root are detected
 * automatically; the built-in `node-modules-link` CLI exposes the same behavior.
 */
import { IFindRootOptions } from '@yarn-tool/find-root';
/**
 * 連結選項 (Link Options)
 *
 * 繼承 Partial<IFindRootOptions>，因此可直接透傳 findRoot 的選項
 * （如 throwError、skipCheckWorkspace）控制根目錄推斷行為。
 * Extends Partial<IFindRootOptions>, so findRoot options (e.g. throwError,
 * skipCheckWorkspace) pass through to control root detection behavior.
 */
export interface IOptions extends Partial<IFindRootOptions> {
    name: string; /** 建立連結的名稱（含 scope，如 @scope/pkg） / Link name, including scope (e.g. @scope/pkg) */
    targetNodeModulesPath: string; /** 目標 node_modules 目錄路徑 / Target node_modules directory path */
    sourcePackagePath: string; /** 要被連結的來源套件目錄 / Source package directory to be linked */
    cwd?: string; /** 路徑推斷的起始目錄，預設 process.cwd() / Starting directory for path detection, defaults to process.cwd() */
    targetNodeModulesName?: string; /** 非標準命名的模組目錄名稱，預設 node_modules / Custom modules directory name, defaults to node_modules */
    overwrite?: boolean; /** 是否覆寫既存在的連結，預設 true / Whether to overwrite an existing link, defaults to true */
}
/**
 * 核心連結函式：不做任何路徑推斷，直接於目標目錄建立符號連結
 * Core linking function: creates the symlink directly in the target directory without path detection
 *
 * @param options - 已完整指定的連結選項 / Fully specified link options
 * @returns 傳入的選項再加上 resultPath / The input options plus resultPath
 *
 * 邊界情況：overwrite 預設為 true，因為工作區開發中重複連結很常見；
 * 若目標已存在而 overwrite 為 false，錯誤會由底層的 fsSymlinkSync 拋出。
 * Edge case: overwrite defaults to true because relinking is common during
 * workspace development; if the target exists while overwrite is false, the
 * underlying fsSymlinkSync throws the error.
 */
export declare function linkToNodeModulesCore<T extends IOptions>(options: T): T & {
    resultPath: string;
};
/**
 * 建立（或更新）套件到 node_modules 的符號連結
 * Create (or update) a symlink from a package into node_modules
 *
 * @param options - 連結選項；路徑可省略以自動推斷 / Link options; paths may be omitted for auto detection
 * @returns 傳入的選項再加上 resultPath / The input options plus resultPath
 *
 * 只有在來源或目標路徑缺失時才會呼叫 findRoot，兩者皆已指定時可省去一次
 * 檔案系統探測。
 * findRoot is only called when source or target path is missing, saving one
 * filesystem traversal when both are already provided.
 */
export declare function linkToNodeModules<T extends Partial<IOptions>>(options?: T): IOptions & {
    resultPath: string;
};
/**
 * 預設匯出主要入口函式，兼容 `import linkToNodeModules from ...` 的用法
 * Default-export the main entry for `import linkToNodeModules from ...` usage
 */
export default linkToNodeModules;
