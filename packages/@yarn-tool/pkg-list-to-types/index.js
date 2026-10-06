"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listToTypes = listToTypes;
const array_hyper_unique_1 = require("array-hyper-unique");
const packageNameToTypes_1 = require("@yarn-tool/npm-package-arg-util/lib/packageNameToTypes");
const generatePackageArg_1 = require("@yarn-tool/npm-package-arg-util/lib/generatePackageArg");
/**
 * 將一組套件名稱轉為去重後的 `@types` 名稱列表
 * Convert a list of package names into a deduplicated list of `@types` names
 *
 * @param input - 待轉換的套件名稱（可含 scope 與版本規格）
 *                the package names to convert (may include scope and version specs)
 * @param includeVersion - 是否交由 `generatePackageArg` 處理版本資訊
 *                         whether to let `generatePackageArg` handle version info
 * @returns 轉換並去重後的 `@types` 名稱陣列 / a converted and deduplicated array of `@types` names
 *
 * @note 使用 `array_unique_overwrite` 而非 `array_unique`：轉換結果是全新字串，
 *       不需保留原始陣列的參照，原地去重可省下額外的複製開銷
 *       Uses `array_unique_overwrite` instead of `array_unique`: the results are
 *       brand-new strings and the input references need not be kept, so
 *       in-place dedupe avoids an extra copy
 */
function listToTypes(input, includeVersion) {
    /**
     * 以 reduce 累積轉換結果：每一項都需先轉為 `@types` 名稱、
     * 再經 `generatePackageArg` 依 includeVersion 產出最終字串
     * Accumulate the results with reduce: each item is first converted into an
     * `@types` name, then passed through `generatePackageArg` to produce the
     * final string according to includeVersion
     */
    return (0, array_hyper_unique_1.array_unique_overwrite)(input.reduce(function (a, b) {
        let result = (0, packageNameToTypes_1.packageNameToTypes)(b);
        a.push((0, generatePackageArg_1.generatePackageArg)(result, includeVersion));
        return a;
    }, []));
}
/**
 * 預設匯出 (Default Export) 指向 `listToTypes`，
 * 讓批次轉換這唯一的主要操作只需預設匯入即可取得
 * The default export points to `listToTypes` so the single primary operation,
 * batch conversion, is available via a plain default import
 */
exports.default = listToTypes;
//# sourceMappingURL=index.js.map