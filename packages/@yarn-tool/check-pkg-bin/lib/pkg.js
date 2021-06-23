"use strict";
/**
 * Created by user on 2020/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPkgDir = void 0;
const package_dts_1 = require("@ts-type/package-dts");
const upath2_1 = require("upath2");
const core_1 = require("./core");
function checkPkgDir(pkgDir = process.cwd()) {
    const pkg = (0, package_dts_1.readPackageJson)((0, upath2_1.join)(pkgDir, 'package.json'));
    const result = (0, core_1.checkPkgJson)(pkg, pkgDir);
    return {
        name: pkg.name,
        pkg,
        pkgDir,
        result,
        valid: result.every(r => r.hasShebang),
    };
}
exports.checkPkgDir = checkPkgDir;
//# sourceMappingURL=pkg.js.map