"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._pkgExportsAddPJsonEntryCore = _pkgExportsAddPJsonEntryCore;
exports.pkgExportsAddPJsonEntry = pkgExportsAddPJsonEntry;
exports._isPackageExportsEntry = _isPackageExportsEntry;
exports.pkgExportsVerify = pkgExportsVerify;
const fs_extra_1 = require("fs-extra");
const find_root_1 = require("@yarn-tool/find-root");
const resolve_package_1 = require("@yarn-tool/resolve-package");
/**
 * 在 exports 物件中添加 package.json entry 的核心函數
 * Core function to add package.json entry in exports object
 *
 * 確保 exports 包含 './package.json' 入口點，讓外部可以匯入 package.json
 * Ensure exports includes './package.json' entry point for external package.json import
 *
 * @template T - exports 欄位類型 / exports field type
 * @param {T} pkgExports - package.json 的 exports 物件 / exports object from package.json
 * @returns {T} 修正後的 exports 物件 / Corrected exports object
 */
function _pkgExportsAddPJsonEntryCore(pkgExports) {
    var _a;
    if (typeof pkgExports === 'object') {
        // 若 './package.json' entry 不存在則添加
        // Add './package.json' entry if not exists
        (_a = pkgExports['./package.json']) !== null && _a !== void 0 ? _a : (pkgExports['./package.json'] = './package.json');
    }
    return pkgExports;
}
/**
 * 在 package.json 的 exports 欄位中添加 package.json entry
 * Add package.json entry to exports field in package.json
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @returns {T} 修正後的 package.json 物件 / Corrected package.json object
 */
function pkgExportsAddPJsonEntry(pkg) {
    _pkgExportsAddPJsonEntryCore(pkg.exports);
    return pkg;
}
/**
 * 判斷是否為有效的 package exports entry
 * Determine if it's a valid package exports entry
 *
 * 檢查 entry 是否以 './' 開頭且值不為空
 * Check if entry starts with './' and value is not empty
 *
 * @param {string} entry - exports 的鍵名 / exports key name
 * @param {PackageExportsEntry | PackageExportsFallback} value - exports 的值 / exports value
 * @returns {boolean} 是否為有效的 PackageExportsEntry / Whether it's a valid PackageExportsEntry
 */
function _isPackageExportsEntry(entry, value) {
    return entry.startsWith('./') && !!(value !== null && value !== void 0 ? value : false);
}
/**
 * 驗證 package exports 路徑是否存在
 * Verify if package exports paths exist
 *
 * 檢查 exports 中定義的所有檔案路徑是否存在於檔案系統中
 * Check if all file paths defined in exports exist in the file system
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @param {object} options - 選項 / Options
 * @param {string} options.cwd - 當前工作目錄 / Current working directory
 * @returns {null} 無返回值 / No return value
 * @throws {Error} 當 exports 路徑不存在時拋出錯誤 / Throws error when exports paths don't exist
 */
function pkgExportsVerify(pkg, options) {
    if (typeof pkg.exports === 'object') {
        // 尋找套件根目錄
        // Find package root directory
        const rootData = (0, find_root_1.findRootLazy)({
            cwd: options === null || options === void 0 ? void 0 : options.cwd,
        });
        if (!rootData.isWorkspace && rootData.pkg) {
            const list = [];
            // 遍歷所有 exports entry 檢查路徑
            // Iterate all exports entries to check paths
            Object.entries(pkg.exports)
                .forEach(([entry, value]) => {
                if (_isPackageExportsEntry(entry, value)) {
                    const _ = (0, resolve_package_1.resolvePackage)(rootData.pkg);
                    // 將值轉換為陣列並檢查每個檔案路徑
                    // Convert value to array and check each file path
                    [typeof value === 'string' ? value : Object.values(value)]
                        .flat()
                        .forEach(file => {
                        var _a;
                        /**
                         * 跳過包含萬用字元 '*' 的路徑檢查
                         * Skip path check for wildcard '*' patterns
                         */
                        if ((_a = file.includes) === null || _a === void 0 ? void 0 : _a.call(file, '*')) {
                            return;
                        }
                        const bool = (0, fs_extra_1.pathExistsSync)(_.resolveLocation(file));
                        if (!bool) {
                            list.push(`path of '${entry}' does not exist: '${file}'`);
                        }
                    });
                }
            });
            // 若有錯誤則拋出包含詳細資訊的錯誤
            // Throw error with details if there are any issues
            if (list.length > 0) {
                let err = new Error(`Invalid package exports: ${rootData.pkg}\n${list.slice().map(v => ` - ${v}`).join('\n')}`);
                // @ts-ignore - 附加錯誤詳細資訊 / Attach error details
                err.list = list;
                // @ts-ignore - 附加根目錄資訊 / Attach root data
                err.rootData = rootData;
                // @ts-ignore - 附加 exports 資訊 / Attach exports info
                err.pkgExports = pkg.exports;
                throw err;
            }
        }
    }
    return null;
}
//# sourceMappingURL=exports.js.map