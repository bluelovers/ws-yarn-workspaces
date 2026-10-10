/**
 * 常見 ignore 檔案名稱的單一事實來源
 * Single source of truth for common ignore file names
 *
 * 搜尋 ignore 檔案時的所有名稱皆由此定義，避免各處重複宣告。
 * All names used when searching for ignore files are defined here,
 * avoiding duplicated declarations across the codebase.
 */
export declare const DEFAULT_IGNORE_FILE_NAMES: readonly [".gitignore", ".npmignore", ".eslintignore", ".prettierignore", ".stylelintignore", ".dockerignore"];
