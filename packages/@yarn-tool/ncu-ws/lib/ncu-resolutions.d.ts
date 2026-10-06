/**
 * resolutions 專用處理流程 (resolutions-only flow)
 * 說明：當 `--resolutions`（`-R`）被指定時，本模組取代一般的依賴更新流程：
 * 讀取 yarn.lock → 檢查 resolutions 的可更新版本 → 顯示差異表 →
 * 僅在 `--upgrade` 時寫回 package.json 與 yarn.lock。
 * Why: with `--resolutions` (`-R`) this module replaces the regular dependency
 * update flow: read yarn.lock → check updatable versions for resolutions → print
 * the diff table → write package.json and yarn.lock only under `--upgrade`.
 *
 * @module ncu-resolutions
 */
import { IArgvRuntime, IRuntime } from './types';
/**
 * 檢查並更新 resolutions (Check and update resolutions)
 *
 * 順序刻意安排為「先寫 yarn.lock、再寫 package.json」：
 * 若沒有 resolutions 或 yarn.lock，會直接結束並提示，避免留下半完成的狀態。
 * yarn.lock is written before package.json on purpose; when resolutions or the
 * yarn.lock are missing the process exits early with a message, so no half-applied
 * state can be left behind.
 *
 * @param argv - 命令列參數（含 `upgrade`、`cwd`） / CLI arguments (including `upgrade`, `cwd`)
 * @param runtime - 由 `_handleRuntime` 建立的執行時期環境 / Runtime environment built by `_handleRuntime`
 */
export declare function _handleNcuResolutions(argv: IArgvRuntime, runtime: IRuntime): Promise<void>;
