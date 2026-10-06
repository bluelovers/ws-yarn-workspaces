"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRunPath = processRunPath;
exports.processRunPathEnv = processRunPathEnv;
const lib_1 = require("./lib");
/**
 * 計算合併後的 PATH 字串但不寫回環境變數，讓呼叫端自行決定套用時機
 * （例如先比對或記錄再寫入）。
 *
 * Computes the merged PATH string without writing it back to the environment,
 * letting callers decide when to apply it (e.g. compare or log first).
 *
 * @param options 合併策略選項 / merge strategy options
 * @returns 含 result（合併後字串）、processEnv、pathKey、delimiter 的物件 / object with result (merged string), processEnv, pathKey, delimiter
 */
function processRunPath(options = {}) {
    let { binPaths, execPath, envPath, pathKey, delimiter, processEnv } = (0, lib_1.processRunPathCore)(options);
    let result = [];
    /**
     * includeEnvPath 決定是否保留原本 PATH；置前時原 PATH 必須先放入，
     * 否則 unshift 會讓本機 bin 永遠排在原 PATH 之後而失去 prepend 語意
     *
     * includeEnvPath keeps the original PATH; when prepending it must be pushed first,
     * otherwise unshift would place local bins after the original PATH and break the prepend semantics
     */
    if (options.includeEnvPath) {
        result.push(envPath);
    }
    let binPathString = binPaths.join(delimiter);
    /**
     * prepend=true 時本機 bin 放最前以優先被解析到；預設置後避免覆蓋系統工具
     *
     * With prepend=true local bins go first so they resolve first; appended by default to avoid shadowing system tools
     */
    if (options.prepend) {
        result.unshift(binPathString);
    }
    else {
        result.push(binPathString);
    }
    /**
     * execPath 目錄通常最後加入，確保找不到其他 node 時仍可用目前的執行檔
     *
     * The execPath directory is normally appended last so the current binary remains a fallback
     */
    if (options.appendExecPath) {
        result.push(execPath);
    }
    return {
        result: result.join(delimiter),
        processEnv,
        pathKey,
        delimiter,
    };
}
/**
 * 計算合併後的 PATH 並寫入環境物件（強制 includeEnvPath 以保留原本 PATH）。
 * 預設先複製 processEnv 再寫入，避免副作用擴散到共用的 process.env 引用。
 *
 * Computes the merged PATH and writes it into the env object (force-enables includeEnvPath to keep the original PATH).
 * Copies processEnv before writing by default so side effects do not spread to the shared process.env reference.
 *
 * @param options 合併與覆寫選項 / merge and overwrite options
 * @returns 已寫入 PATH 的環境物件 / the env object with PATH written
 */
function processRunPathEnv(options = {}) {
    let { processEnv, pathKey, result } = processRunPath({
        ...options,
        includeEnvPath: true,
    });
    /**
     * 未要求 overwrite 時以淺複製隔離，確保不會動到呼叫端原本持有的物件
     *
     * Shallow-copy when overwrite is not requested, ensuring the caller's original object is untouched
     */
    if (!options.overwrite) {
        processEnv = {
            ...processEnv,
        };
    }
    processEnv[pathKey] = result;
    return processEnv;
}
/**
 * 預設匯出 (Default Export)：最常見的用法，直接取得已寫入 PATH 的環境物件。
 *
 * Default export: the most common usage, returning the env object with PATH already written.
 */
exports.default = processRunPathEnv;
//# sourceMappingURL=index.js.map