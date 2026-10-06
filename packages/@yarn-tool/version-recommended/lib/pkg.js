"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByPackage = nextVersionRecommendedByPackage;
exports.nextVersionRecommendedByPackageFindUp = nextVersionRecommendedByPackageFindUp;
/**
 * 由 package.json 取得版本號並推薦下一個版本
 * Recommend the next version from a package.json
 */
const ws_1 = require("./ws");
const find_root_1 = require("@yarn-tool/find-root");
const package_dts_1 = require("@ts-type/package-dts");
const path_1 = require("path");
/**
 * 由傳入的 package 物件計算推薦版本
 * Recommend a version from an explicit package object
 *
 * @param pkg - 含 version 欄位的 package 物件 / Package object with a version field
 * @param options - 推薦選項 / Recommendation options
 * @returns 推薦結果，額外帶有原始 pkg / Recommendation result, plus the original pkg
 * @throws TypeError 當 pkg.version 缺失時 / When pkg.version is missing
 */
function nextVersionRecommendedByPackage(pkg, options) {
    /**
     * 提前失敗而非讓 semver 解析出錯：
     * 缺少版本號代表呼叫端傳錯資料，錯誤訊息需指出 pkg.version
     *
     * Fail early instead of letting semver throw: a missing version means the
     * caller passed wrong data, so the message must name pkg.version
     */
    if (typeof pkg.version !== 'string' || !pkg.version.length) {
        throw new TypeError(`pkg.version is require`);
    }
    return {
        ...(0, ws_1.nextVersionRecommendedByWorkspacesFindUp)(pkg.version, options),
        pkg,
    };
}
/**
 * 自 cwd 向上尋找專案根目錄並讀取 package.json 後計算推薦版本
 * Find the project root from cwd upward, read package.json, then recommend
 *
 * 為套件預設匯出：多數 CLI 使用情境只需給 cwd。
 *
 * This is the default export: most CLI usage only needs to supply cwd.
 *
 * @param options - 推薦選項，cwd 預設為 process.cwd() / Recommendation options; cwd defaults to process.cwd()
 * @returns 推薦結果，額外帶有讀取到的 pkg / Recommendation result, plus the loaded pkg
 */
function nextVersionRecommendedByPackageFindUp(options) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    /** 明確指定預設 cwd，避免 findRoot 依賴呼叫端的隱含狀態 / Set the cwd explicitly so findRoot does not depend on implicit caller state */
    (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    let rootData = (0, find_root_1.findRoot)(options);
    let pkg = (0, package_dts_1.readPackageJson)((0, path_1.join)(rootData.pkg, 'package.json'));
    /**
     * 讀取 package.json 後改以 workspaces 根目錄作為 cwd，
     * 讓後續 WorkspacesProject 從真正的專案根目錄開始解析
     *
     * After reading package.json, switch cwd to the workspaces root so the
     * WorkspacesProject resolves from the real project root
     */
    options.cwd = rootData.root;
    // @ts-ignore
    return nextVersionRecommendedByPackage(pkg, options);
}
//# sourceMappingURL=pkg.js.map