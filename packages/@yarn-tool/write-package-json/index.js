"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleOptions = _handleOptions;
exports.writePackageJSONSync = writePackageJSONSync;
exports.outputPackageJSONSync = outputPackageJSONSync;
exports.writePackageJSON = writePackageJSON;
exports.outputPackageJSON = outputPackageJSON;
const fs_json_1 = require("@bluelovers/fs-json");
/**
 * 補上寫入選項的預設值（2 空白縮排、檔尾換行）。
 * 以「展開原 options 再覆寫預設」的順序，讓呼叫者顯式傳入的
 * spaces / finalEOL 仍可覆蓋預設（Why：預設值不應搶先於使用者選項）。
 *
 * Fill in write-option defaults (2-space indent, final EOL). The spread comes
 * first so explicitly passed spaces / finalEOL still win over the defaults
 * (Why: caller-supplied options must take precedence over defaults).
 */
function _handleOptions(options) {
    // @ts-ignore
    let { spaces = 2, finalEOL = true } = options;
    return {
        // @ts-ignore
        ...options,
        spaces,
        finalEOL,
    };
}
/**
 * 同步寫入 package.json（檔案所在目錄需已存在）。
 * 每次寫入都重新套用預設選項，避免呼叫者共用同一 options 物件時
 * 漏帶格式設定（Why：讓四個寫入函式的輸出格式永遠一致）。
 *
 * Synchronously write a package.json (its directory must already exist).
 * Defaults are re-applied on every call so a shared options object cannot
 * silently lose the formatting settings (Why: keeps the output format of all
 * four writers consistent).
 *
 * @param file 目標檔案路徑 / target file path
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項，預設 spaces=2、finalEOL=true / write options, defaults to spaces=2, finalEOL=true
 */
function writePackageJSONSync(file, data, options = {}) {
    return (0, fs_json_1.writeJSONSync)(file, data, _handleOptions(options));
}
/**
 * 同步寫入並在需要時自動建立上層目錄（mkdir -p 語意）。
 * 適用於目標路徑可能尚未存在的情境，如產生 monorepo 子套件。
 *
 * Synchronously write while creating missing parent directories (mkdir -p
 * semantics). Useful when the target path may not exist yet, e.g. generating
 * monorepo sub-packages.
 *
 * @param file 目標檔案路徑（可含未建立的目錄）/ target path (missing dirs are created)
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項 / write options
 */
function outputPackageJSONSync(file, data, options = {}) {
    return (0, fs_json_1.outputJSONSync)(file, data, _handleOptions(options));
}
/**
 * 非同步寫入 package.json（檔案所在目錄需已存在）。
 * 選項處理與同步版本一致，僅差在回傳 Promise。
 *
 * Asynchronously write a package.json (directory must exist). Option handling
 * matches the sync version; only the Promise return differs.
 *
 * @param file 目標檔案路徑 / target file path
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項 / write options
 */
function writePackageJSON(file, data, options = {}) {
    return (0, fs_json_1.writeJSON)(file, data, _handleOptions(options));
}
/**
 * 非同步寫入並在需要時自動建立上層目錄。
 * 與 outputPackageJSONSync 語意相同，僅差在回傳 Promise。
 *
 * Asynchronously write while creating missing parent directories. Same
 * semantics as outputPackageJSONSync, but returns a Promise.
 *
 * @param file 目標檔案路徑（可含未建立的目錄）/ target path (missing dirs are created)
 * @param data 要序列化的資料 / data to serialize
 * @param options 寫入選項 / write options
 */
function outputPackageJSON(file, data, options = {}) {
    return (0, fs_json_1.outputJSON)(file, data, _handleOptions(options));
}
/**
 * 預設匯出同步寫入函式——最常用的基本入口
 * （Why：一般用途即「立即寫回 package.json」）。
 *
 * Default-exports the sync writer, the most common entry point
 * (Why: the typical use case is "write the package.json back now").
 */
exports.default = writePackageJSONSync;
//# sourceMappingURL=index.js.map