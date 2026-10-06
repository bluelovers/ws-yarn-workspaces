/**
 * resolutions 去重流程 (Resolutions dedupe flow)
 * 說明：當 `--dedupe` 啟用且套件有 resolutions 時，本模組會檢查依賴版本與
 * resolutions 是否已經不一致，並在 `--upgrade` 下把 yarn.lock 整併成單一版本。
 * Why: when `--dedupe` is on and the package has resolutions, this module checks
 * whether dependency versions have drifted from the resolutions, and under
 * `--upgrade` collapses yarn.lock into a single version.
 *
 * @module ncu-dedupe
 */
import { IArgvRuntime, IRuntime } from './types';
import { npmCheckUpdates } from '@yarn-tool/ncu';
/**
 * 檢查依賴與 resolutions 的落差並去重 yarn.lock (Diff dependencies against resolutions and dedupe yarn.lock)
 *
 * 回傳值含意：回傳 `true` 表示「已處理完成、呼叫端不必再更新 yarn.lock」
 * （目前僅在 yarn.lock 不存在時如此）；其餘情況回傳 undefined，
 * 由呼叫端 `_handleNcuArgv` 接手一般的 yarn.lock 更新。
 * Return semantics: `true` means "handled, the caller must not touch yarn.lock
 * again" (currently only when the lock file is missing); otherwise it returns
 * undefined and `_handleNcuArgv` proceeds with the regular yarn.lock update.
 *
 * 邊界情況：開頭的 `reduce` 會算出「依賴版本 → resolutions」的對照，但其結果
 * 未被指派使用；這段既有的程式碼只保留行為（`latest` 會先轉成 `*`），
 * 此處僅記錄現況，不做改動。
 * Edge case: the leading `reduce` builds a dependency→resolution mapping whose
 * result is never assigned; this existing code only preserves the behaviour
 * (`latest` is first turned into `*`) and is documented, not changed.
 *
 * @param argv - 命令列參數（含 `upgrade`） / CLI arguments (including `upgrade`)
 * @param runtime - 由 `_handleRuntime` 建立的執行時期環境 / Runtime environment built by `_handleRuntime`
 * @param pkgNcu - `npmCheckUpdates` 的檢查結果 / The result of `npmCheckUpdates`
 */
export declare function _handleDedupe(argv: IArgvRuntime, runtime: IRuntime, pkgNcu: Awaited<ReturnType<typeof npmCheckUpdates>>): Promise<boolean>;
