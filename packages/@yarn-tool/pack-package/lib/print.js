"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.printPackedTarballInfo = printPackedTarballInfo;
const log_packed_1 = require("@lerna/log-packed");
/**
 * 以 @lerna/log-packed 印出格式化打包報表。
 * 僅轉印不自行計算（Why：報表格式與 lerna 保持一致，避免維護兩份邏輯）。
 *
 * Print a formatted packing report via @lerna/log-packed. Purely forwards the
 * data (Why: keeps the report format consistent with lerna instead of
 * maintaining a second implementation).
 *
 * @param tarball tarball 資訊 / tarball info
 */
function printPackedTarballInfo(tarball) {
    return (0, log_packed_1.logPacked)(tarball);
}
/**
 * 預設匯出報表列印函式。
 *
 * Default export of the report printer.
 */
exports.default = printPackedTarballInfo;
//# sourceMappingURL=print.js.map