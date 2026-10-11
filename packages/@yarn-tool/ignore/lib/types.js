"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumLineType = exports.DEFAULT_IGNORE_FILE_NAMES = exports.EnumConst = void 0;
var EnumConst;
(function (EnumConst) {
    /**
     * 未指定 `startCount` 時的預設值：檔案頂端不補空行
     * Default used when `startCount` is not given: no blank lines at the top of the file
     */
    EnumConst[EnumConst["DEFAULT_START_COUNT"] = 0] = "DEFAULT_START_COUNT";
    /**
     * 連續空行的上限，超過此數量的空行會被縮減到此數量
     * Upper bound of consecutive blank lines; longer runs are shrunk to this size
     */
    EnumConst[EnumConst["MAX_BLANK_LINES"] = 3] = "MAX_BLANK_LINES";
    /**
     * 註解的前綴
     */
    EnumConst["COMMENT_PREFIX"] = "#";
    /**
     * 負規則的前綴
     * Prefix for negative rules
     */
    EnumConst["NEG_PREFIX"] = "!";
})(EnumConst || (exports.EnumConst = EnumConst = {}));
/**
 * 常見 ignore 檔案名稱的單一事實來源
 * Single source of truth for common ignore file names
 *
 * 搜尋 ignore 檔案時的所有名稱皆由此定義，避免各處重複宣告。
 * All names used when searching for ignore files are defined here,
 * avoiding duplicated declarations across the codebase.
 */
exports.DEFAULT_IGNORE_FILE_NAMES = [
    '.gitignore',
    '.npmignore',
    '.eslintignore',
    '.prettierignore',
    '.stylelintignore',
    '.dockerignore',
];
/** 單一行的類型 */
var EnumLineType;
(function (EnumLineType) {
    EnumLineType["Comment"] = "comment";
    EnumLineType["Blank"] = "blank";
    EnumLineType["Pattern"] = "pattern";
})(EnumLineType || (exports.EnumLineType = EnumLineType = {}));
//# sourceMappingURL=types.js.map