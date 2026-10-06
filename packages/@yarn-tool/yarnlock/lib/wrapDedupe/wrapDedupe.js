"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapDedupe = wrapDedupe;
const object_1 = require("@yarn-tool/yarnlock-dedupe/object");
const yarnlock_diff_1 = require("@yarn-tool/yarnlock-diff");
const fs_extra_1 = require("fs-extra");
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
const handleWrapDedupeOptions_1 = require("./handleWrapDedupeOptions");
/**
 * 以步驟 (Step) 管線包裝 yarn.lock 去重流程：
 * 依序執行 `init → before → 第一次 dedupe → main → 第二次 dedupe → after → 最終 diff → end`，
 * 任一步驟回傳 truthy 即中斷後續步驟。
 * 使用 labelled block（`LABEL1`）而非多個提早 return，
 * 是為了讓中斷時仍會執行結尾的 `end` 步驟並保持統一的回傳形狀。
 *
 * Wraps yarn.lock dedupe in a step pipeline running
 * `init → before → first dedupe → main → second dedupe → after → final diff → end`;
 * any truthy step aborts the remaining ones.
 * A labelled block (`LABEL1`) is used instead of early returns so the trailing `end`
 * step still runs on abort and the return shape stays uniform.
 *
 * @deprecated 建議改由各步驟自行組合 / prefer composing the steps yourself
 */
function wrapDedupe(yarg, argv, options) {
    let cache;
    /**
     * 以物件解構賦值把初始化結果寫回 `options` 與外層 `cache`：
     * `cache` 需先宣告才能在解構中被賦值，此處完成 cwd、根目錄與快取的起始狀態。
     *
     * Object destructuring assignment writes the initialised `options` and outer `cache`
     * back: `cache` must be declared beforehand to be assignable in the destructuring,
     * which establishes the starting state of cwd, root and the cache.
     */
    ({
        options,
        cache,
    } = (0, handleWrapDedupeOptions_1.handleWrapDedupeOptions)(yarg, argv, options));
    const { consoleDebug } = options;
    /**
     * 解構五個步驟：未提供的步驟維持 undefined，
     * 之後以 `null` 記錄於 `ret`（代表此步驟不存在）。
     *
     * Destructures the five steps; missing ones stay undefined and are later recorded
     * as `null` in `ret` (meaning the step does not exist).
     */
    let { init, before, main, after, end } = options;
    /**
     * LABEL1 是整個管線的中斷出口：任何步驟回傳 truthy 就 `break` 跳到區塊結尾，
     * 使後方的 `end` 步驟與回傳仍會執行，行為與函式提早 return 一致但不需重複收尾程式碼。
     *
     * LABEL1 is the pipeline-wide abort exit: any truthy step `break`s out of the block,
     * so the trailing `end` step and return still run — same effect as an early return
     * without duplicating the epilogue.
     */
    LABEL1: {
        // @ts-ignore
        cache.ret.init = init ? !!init(yarg, argv, cache) : null;
        /**
         * init 回傳 truthy 代表初始化階段已中斷管線，其餘步驟全部跳過。
         *
         * A truthy init aborts the pipeline during initialisation, skipping every
         * remaining step.
         */
        if (cache.ret.init) {
            break LABEL1;
        }
        /**
         * before：第一次 dedupe 之前的預備步驟；未提供時以 null 記錄（步驟不存在）。
         *
         * before: preparatory step ahead of the first dedupe; recorded as null when
         * absent (step does not exist).
         */
        // @ts-ignore
        cache.ret.before = before ? !!before(yarg, argv, cache) : null;
        /**
         * before 回傳 truthy 即中斷，避免在預備階段失敗後仍繼續動 yarn.lock。
         *
         * A truthy before aborts so yarn.lock is not touched after a failed preparation.
         */
        if (cache.ret.before) {
            break LABEL1;
        }
        /**
         * 第一次 dedupe：於 main 之前先移除既有重複項目，
         * 讓 main 步驟在乾淨的 lockfile 上操作；不存在 yarn.lock 時直接略過。
         *
         * First dedupe: removes pre-existing duplicates before main so it works on a
         * clean lockfile; skipped entirely when yarn.lock does not exist.
         */
        cache.yarnlock_cache = (0, read_1.fsYarnLockSafe)(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            let ret1 = (0, object_1.yarnDedupe)(cache.yarnlock_cache.yarnlock_old);
            /**
             * 只有真的有變動才回寫與記錄 diff，避免每次執行都重寫檔案造成無謂的 mtime 變更。
             *
             * The file is rewritten and the diff recorded only on real changes, avoiding
             * needless mtime churn from rewriting on every run.
             */
            if (ret1.yarnlock_changed) {
                (0, fs_extra_1.writeFileSync)(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);
                let msg = (0, yarnlock_diff_1.yarnLockDiff)(ret1.yarnlock_old, ret1.yarnlock_new);
                /**
                 * 無 diff 訊息時保留上一筆（若有），讓最終回報不至於失去較早的變更。
                 *
                 * With no diff message the previous one (if any) is kept so the final report
                 * does not lose earlier changes.
                 */
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
                cache.yarnlock_changed = true;
                /**
                 * 同步快取中的基準內容為去重後版本，
                 * 供下一階段以「本輪開始時的狀態」做為比對起點。
                 *
                 * The cached baseline is updated to the deduped content so the next stage
                 * compares from "state at the start of this round".
                 */
                cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.info(`Deduplication yarn.lock`);
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
            }
        }
        /**
         * main：必要的主要步驟（例如執行安裝指令），回傳 truthy 即中斷後續流程。
         *
         * main: the required primary step (e.g. running an install command); a truthy
         * return aborts the rest of the flow.
         */
        // @ts-ignore
        cache.ret.main = !!main(yarg, argv, cache);
        /**
         * main 回傳 truthy 即中斷，交由 end 步驟收尾。
         *
         * A truthy main aborts and hands over to the `end` step for cleanup.
         */
        if (cache.ret.main) {
            break LABEL1;
        }
        /**
         * 第二次 dedupe：main 可能又寫入了新依賴，重新讀取並去重一次，
         * 確保離開管線時磁碟上的 lockfile 是乾淨的。
         *
         * Second dedupe: main may have written new dependencies, so the lockfile is
         * re-read and deduped again to guarantee a clean file on exit.
         */
        cache.yarnlock_cache = (0, read_1.fsYarnLockSafe)(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            let ret1 = (0, object_1.yarnDedupe)(cache.yarnlock_cache.yarnlock_old);
            if (ret1.yarnlock_changed) {
                /**
                 * 備份「第一次 dedupe 之前的原始內容」作為最終 diff 的基準；
                 * 只在尚無備份時寫入，避免被本次結果覆蓋。
                 *
                 * Snapshots the "before first dedupe" content as the final diff baseline;
                 * written only when no backup exists so this round cannot overwrite it.
                 */
                if (cache.yarnlock_old2 == null) {
                    cache.yarnlock_old2 = ret1.yarnlock_old;
                }
                (0, fs_extra_1.writeFileSync)(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);
                let msg = (0, yarnlock_diff_1.yarnLockDiff)(ret1.yarnlock_old, ret1.yarnlock_new);
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
                cache.yarnlock_changed = true;
                cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.info(`Deduplication yarn.lock`);
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
            }
            /**
             * 本次沒有變動且旗標尚未被任何階段判定過時，才以本次結果初始化旗標，
             * 保留較早階段已判定的 `true` 不被覆寫。
             *
             * Only when nothing changed here and no earlier stage set the flag does this
             * result initialise it, preserving an earlier `true` verdict.
             */
            else if (cache.yarnlock_changed == null) {
                cache.yarnlock_changed = ret1.yarnlock_changed;
            }
        }
        /**
         * 變動旗標最終校正：lockfile 已不存在、沒有執行前基準、
         * 或執行前後內容相同，都代表實質上沒有變更，撤回旗標以免 CLI 誤報。
         *
         * Final reconciliation of the changed flag: a missing lockfile, a missing baseline,
         * or identical before/after content means no real change — the flag is revoked to
         * avoid a false CLI report.
         */
        if (cache.yarnlock_changed) {
            if (!cache.yarnlock_cache.yarnlock_exists || !cache.yarnlock_old || cache.yarnlock_old == cache.yarnlock_cache.yarnlock_old) {
                cache.yarnlock_changed = false;
            }
        }
        /**
         * after：第二次 dedupe 之後的後處理步驟；未提供時以 null 記錄。
         *
         * after: post-processing step after the second dedupe; recorded as null when absent.
         */
        // @ts-ignore
        cache.ret.after = after ? !!after(yarg, argv, cache) : null;
        /**
         * after 回傳 truthy 即中斷，跳過最終 diff 的產製。
         *
         * A truthy after aborts and skips producing the final diff.
         */
        if (cache.ret.after) {
            break LABEL1;
        }
        /**
         * 最終 diff：再次讀取磁碟狀態，捕捉 after 步驟可能造成的變更。
         *
         * Final diff: re-reads disk state to capture any change made by the after step.
         */
        cache.yarnlock_cache = (0, read_1.fsYarnLockSafe)(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            /**
             * 已判定有變動：直接以執行前基準對目前內容產出 diff。
             *
             * Already flagged as changed: diff the original baseline against current content.
             */
            if (cache.yarnlock_changed) {
                let msg = (0, yarnlock_diff_1.yarnLockDiff)(cache.yarnlock_old || cache.yarnlock_old2, cache.yarnlock_cache.yarnlock_old);
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
            }
            /**
             * 未判定變動：重新讀檔與基準比對，
             * 用來捕捉由 main 步驟直接寫檔、未經過本管線旗標的情況。
             *
             * Not yet flagged: re-reads the file and compares against the baseline to
             * catch direct writes made by main outside the pipeline's own bookkeeping.
             */
            else {
                let yarnlock_now = (0, fs_extra_1.readFileSync)(cache.yarnlock_cache.yarnlock_file).toString();
                let yarnlock_old2 = cache.yarnlock_old || cache.yarnlock_old2;
                /**
                 * 沒有基準就無從比較，直接略過以避免用空字串誤判出假 diff。
                 *
                 * Without a baseline there is nothing to compare; skipped to avoid a fake
                 * diff produced from an empty string.
                 */
                if (yarnlock_old2) {
                    let msg = (0, yarnlock_diff_1.yarnLockDiff)(yarnlock_old2, yarnlock_now);
                    if (msg) {
                        cache.yarnlock_msg = msg;
                        /**
                         * 比對出差異代表其實有變更，回填旗標讓回報保持一致。
                         *
                         * A non-empty diff means something did change; the flag is backfilled
                         * so the report stays consistent.
                         */
                        cache.yarnlock_changed = true;
                    }
                }
            }
        }
    }
    /**
     * end：不論前面是否中斷都會執行（收尾必經點），
     * 未提供時以 null 記錄，回傳 truthy 則僅作為狀態留存。
     *
     * end: runs whether or not earlier steps aborted (the mandatory cleanup point);
     * recorded as null when absent, and a truthy value is only kept as status.
     */
    // @ts-ignore
    cache.ret.end = end ? !!end(yarg, argv, cache) : null;
    return {
        cwd: cache.cwd,
        rootData: cache.rootData,
        yarg,
        argv,
        // @ts-ignore
        cache,
    };
}
//# sourceMappingURL=wrapDedupe.js.map