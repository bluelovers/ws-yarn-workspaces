/**
 * @yarn-tool/fix-ws-links/lib/rebuildYarnWorkspaceLinks
 *
 * workspace 連結批次重建模組
 * Batch rebuild module for workspace links
 *
 * 與 index.ts 的 link 檢查流程不同：此模組直接把所有 workspace 套件
 * 連結到根目錄 node_modules，適合在連結整批失效時快速復原
 * Unlike the link-check flow in index.ts, this module links every workspace
 * package into the root node_modules directly; useful for quick recovery
 * when links break in bulk
 */
import { IListableRow } from 'ws-pkg-list/lib/types';
import { IOptions } from '@yarn-tool/node-modules-link';
/**
 * 驗證並補齊連結選項
 * Validate and fill in link options
 *
 * 以斷言函式 (assertion function) 的形式收窄 options 型別至 IOptions，
 * 讓呼叫端後續無需再逐一檢查必要欄位
 * Narrows the options type to IOptions via an assertion function so callers
 * do not need to re-check the required fields afterwards
 *
 * 強制要求目標為有效 workspace 根目錄：連結若允許在非 workspace 目錄執行，
 * 會把套件連到錯誤的 node_modules，故以 throwError 立即中斷
 * Requires a valid workspace root: allowing linking outside a workspace
 * would point packages at the wrong node_modules, so throwError stops early
 *
 * @param options - 要驗證的選項（就地補齊欄位）/ Options to validate (filled in-place)
 * @param {boolean} [auto] - 為 true 時以解析出的 workspace 根目錄覆寫 cwd / When true, overwrite cwd with the resolved workspace root
 * @throws {Error} cwd 不是 workspace 根目錄時拋出 / Throws when cwd is not the workspace root
 */
export declare function _checkOptions(options: Partial<IOptions>, auto?: boolean): asserts options is IOptions;
/**
 * 以已載入的套件列表重建連結
 * Rebuild links from a pre-loaded package list
 *
 * 逐一套件連結到根目錄的 node_modules（overwrite: true 蓋過舊連結），
 * 適合呼叫端已持有 wsPkgListable() 結果、需重複執行的情境
 * Links each package into the root node_modules (overwrite: true replaces
 * stale links); convenient when the caller already holds a wsPkgListable()
 * result and needs to run repeatedly
 *
 * @param listable - workspace 套件列表 / Workspace package list
 * @param options - 連結選項，cwd 必須為 workspace 根目錄 / Link options; cwd must be the workspace root
 * @throws {Error} cwd 不是 workspace 根目錄時拋出 / Throws when cwd is not the workspace root
 */
export declare function rebuildYarnWorkspaceLinksFromPkgListable(listable: IListableRow[], options: Partial<IOptions>): void;
/**
 * 重建 workspace 全部套件的連結
 * Rebuild links for all workspace packages
 *
 * 為主要入口：補齊 cwd 預設值 → 以 auto 模式解析 workspace 根目錄 →
 * 掃描套件列表 → 交由 rebuildYarnWorkspaceLinksFromPkgListable 重建
 * Main entry: fill default cwd → resolve the workspace root in auto mode →
 * scan the package list → rebuild via rebuildYarnWorkspaceLinksFromPkgListable
 *
 * @param options - 連結選項，cwd 預設 process.cwd() / Link options; cwd defaults to process.cwd()
 * @returns rebuildYarnWorkspaceLinksFromPkgListable 的回傳值 / Return value of rebuildYarnWorkspaceLinksFromPkgListable
 * @throws {Error} 無法解析為 workspace 根目錄時拋出 / Throws when it cannot resolve to a workspace root
 */
export declare function rebuildYarnWorkspaceLinks(options?: Partial<IOptions>): void;
