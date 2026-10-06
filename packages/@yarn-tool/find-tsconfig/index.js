"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTsconfig = findTsconfig;
const tsconfig_1 = require("tsconfig");
const find_root_1 = require("@yarn-tool/find-root");
const fs_1 = require("fs");
const path_1 = require("path");
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
function findTsconfig(cwd) {
    // 取得目前目錄所屬的套件 / workspace 根目錄資訊，作為後續範圍判斷的依據
    // Obtain package / workspace root info for the current directory, used as the basis for the scope check below
    const rooData = (0, find_root_1.findRoot)({
        cwd,
    });
    let file = (0, tsconfig_1.findSync)(cwd);
    // 第一次找不到時，改用真實路徑重試；cwd 可能是符號連結，直接搜尋會找不到設定檔
    // Retry with the real path when the first attempt fails; cwd may be a symlink, causing the config lookup to miss
    if (!file) {
        file = (0, tsconfig_1.findSync)((0, fs_1.realpathSync)(cwd));
    }
    if (file) {
        file = (0, path_1.normalize)(file);
        // 只接受位於套件根目錄內的結果；
        // 若目前不在 workspace 根目錄本身，也允許落在 workspace 根目錄下的結果（monorepo 中共用設定的情況）
        // Only accept results inside the package root;
        // when not at the workspace root itself, also allow results under the workspace root (shared config in a monorepo)
        if (file.includes((0, path_1.normalize)(rooData.pkg)) || rooData.hasWorkspace && !rooData.isWorkspace && file.includes((0, path_1.normalize)(rooData.ws))) {
            return file;
        }
    }
}
/**
 * 預設匯出 findTsconfig，方便只需單一尋找函數的呼叫端直接引入
 * Default-exports findTsconfig so callers that only need the single lookup function can import it directly
 */
exports.default = findTsconfig;
//# sourceMappingURL=index.js.map