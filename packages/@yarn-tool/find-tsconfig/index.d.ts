/**
 * 尋找 tsconfig，且只允許位於目前套件 / workspace 路徑內的結果
 * Find tsconfig, but only allow results inside the current package / workspace path
 *
 * 先用 findSync 搜尋；若失敗則改以 realpathSync 解析符號連結後再搜尋一次，
 * 這是為了處理 cwd 為符號連結路徑時一般搜尋可能落空的邊界情況。
 * Search with findSync first; if that fails, resolve symlinks via realpathSync and search again,
 * which handles the edge case where a symlinked cwd may yield no direct match.
 *
 * 找到檔案後會檢查它是否落在套件根目錄或 workspace 根目錄之下，
 * 若超出專案範圍則不回傳，避免誤用上層目錄的 tsconfig。
 * After finding a file, it is checked against the package root or workspace root;
 * results outside the project scope are not returned to avoid using a parent directory's tsconfig.
 *
 * @param {string} cwd - 起始搜尋目錄 / Starting search directory
 * @returns {string} 已標準化的 tsconfig.json 路徑，若超出範圍或找不到則為 undefined /
 * Normalized path of tsconfig.json, or undefined when out of scope or not found
 */
export declare function findTsconfig(cwd: string): string;
/**
 * 預設匯出 findTsconfig，方便只需單一尋找函數的呼叫端直接引入
 * Default-exports findTsconfig so callers that only need the single lookup function can import it directly
 */
export default findTsconfig;
