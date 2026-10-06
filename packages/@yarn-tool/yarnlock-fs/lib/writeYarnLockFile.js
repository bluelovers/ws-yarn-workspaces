"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYarnLockFile = writeYarnLockFile;
const yarnlock_stringify_1 = require("@yarn-tool/yarnlock-stringify");
const fs_extra_1 = require("fs-extra");
/**
 * 將解析後的 yarn.lock 來源資料序列化 (Serialize) 並寫入指定檔案。
 * 交由 yarnLockStringify 處理格式還原，可同時相容 v1 與 berry（v2/v3）的輸出格式。
 *
 * Serializes parsed yarn.lock source data and writes it to the given file.
 * Format conversion is delegated to yarnLockStringify so the output works for both v1 and
 * berry (v2 / v3).
 *
 * @param file 目標檔案路徑 / target file path
 * @param data 解析後的來源資料 / parsed source data
 * @returns writeFileSync 的回傳值 / the writeFileSync return value
 */
function writeYarnLockFile(file, data) {
    return (0, fs_extra_1.writeFileSync)(file, (0, yarnlock_stringify_1.yarnLockStringify)(data));
}
//# sourceMappingURL=writeYarnLockFile.js.map