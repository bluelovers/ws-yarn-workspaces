"use strict";
/**
 * Created by user on 2020/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPkgDir = checkPkgDir;
const package_dts_1 = require("@ts-type/package-dts");
const upath2_1 = require("upath2");
const core_1 = require("./core");
/**
 * 讀取指定目錄的 package.json，並檢查其所有 bin 檔案是否含 shebang。
 * 預設使用 process.cwd()，讓 CLI 與 API 在未指定路徑時行為一致。
 *
 * Read the package.json of a directory and check whether all of its bin files
 * contain a shebang. Defaults to process.cwd() so CLI and API behave the same
 * when no path is given.
 *
 * @param pkgDir 套件根目錄 / package root directory
 */
function checkPkgDir(pkgDir = process.cwd()) {
    const pkg = (0, package_dts_1.readPackageJson)((0, upath2_1.join)(pkgDir, 'package.json'));
    const result = (0, core_1.checkPkgJson)(pkg, pkgDir);
    return {
        name: pkg.name,
        pkg,
        pkgDir,
        result,
        // valid 只描述「已存在的 bin 是否皆通過」；
        // 沒有任何 bin 時 result 為空、every 回傳 true，
        // 由呼叫方以 result.length 決定是否顯示為 none。
        // valid only describes whether existing bins all pass; with no bins the
        // result is empty and every() is true, so callers show "none" based on
        // result.length instead.
        valid: result.every(r => r.hasShebang),
    };
}
//# sourceMappingURL=pkg.js.map