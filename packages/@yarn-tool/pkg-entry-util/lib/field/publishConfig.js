"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixPublishConfig = fixPublishConfig;
/**
 * 修復 publishConfig 欄位
 * Fix publishConfig field
 *
 * 為 scoped package（如 @scope/package）自動添加 publishConfig.access = 'public'
 * Automatically add publishConfig.access = 'public' for scoped packages (e.g., @scope/package)
 *
 * 當套件名稱包含 '/' 且非私有套件時，確保 npm 發布時能正確設定存取權限
 * When package name contains '/' and is not private, ensure correct access settings for npm publish
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @returns {T & { publishConfig: IPackageJsonPublishConfig }} 修正後的 package.json 物件 / Corrected package.json object
 */
function fixPublishConfig(pkg) {
    // 檢查是否需要添加 publishConfig：
    // 1. 尚未有 publishConfig
    // 2. 非私有套件
    // 3. 有套件名稱
    // 4. 套件名稱包含 '/'（scoped package）
    // Check if publishConfig needs to be added:
    // 1. No existing publishConfig
    // 2. Not a private package
    // 3. Has package name
    // 4. Package name contains '/' (scoped package)
    if (!pkg.publishConfig
        && !pkg.private
        && pkg.name
        && /\//.test(pkg.name)) {
        pkg.publishConfig = {
            access: "public",
        };
    }
    return pkg;
}
//# sourceMappingURL=publishConfig.js.map