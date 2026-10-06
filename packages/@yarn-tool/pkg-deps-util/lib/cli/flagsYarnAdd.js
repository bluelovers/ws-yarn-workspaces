"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagsYarnAdd = flagsYarnAdd;
/**
 * 產生 `yarn add` 的 CLI flag (Build CLI flags for `yarn add`)
 *
 * 與 `setupYarnAddToYargs` 註冊的選項保持同一組名稱，
 * 讓 CLI 解析後的 argv 能直接轉回指令列參數。
 *
 * Shares its option names with `setupYarnAddToYargs` so an argv parsed by the
 * CLI can be turned straight back into command-line arguments.
 */
const lazyFlags_1 = require("../util/lazyFlags");
/**
 * 產生 `yarn add` 可用的 flag 陣列 (Produce flags usable by `yarn add`)
 *
 * Produce the flags accepted by `yarn add`.
 *
 * @param argv 已解析的布林選項 (Parsed boolean options)
 *
 * @returns 僅包含已啟用選項的 `--flag` 陣列，順序固定，便於除錯與快照測試
 *
 * An array of `--flag` containing only enabled options, in a fixed order so
 * output stays debuggable and snapshot-friendly.
 */
function flagsYarnAdd(argv) {
    return (0, lazyFlags_1.lazyFlags)([
        'dev',
        'peer',
        'optional',
        'exact',
        'tilde',
        'ignore-workspace-root-check',
        'audit',
    ], argv);
}
//# sourceMappingURL=flagsYarnAdd.js.map