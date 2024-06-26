"use strict";
/**
 * Created by user on 2020/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasShebang = hasShebang;
exports.checkFile = checkFile;
exports.checkPkgJson = checkPkgJson;
const fs_extra_1 = require("fs-extra");
const shebang_1 = require("@yarn-tool/shebang");
const get_pkg_bin_1 = require("@yarn-tool/get-pkg-bin");
const upath2_1 = require("upath2");
function hasShebang(buf) {
    var _a, _b;
    return ((_b = (_a = (0, shebang_1.matchShebang)(buf.toString())) === null || _a === void 0 ? void 0 : _a.script) === null || _b === void 0 ? void 0 : _b.length) > 0;
}
function checkFile(file) {
    if ((0, fs_extra_1.existsSync)(file)) {
        return hasShebang((0, fs_extra_1.readFileSync)(file));
    }
}
function checkPkgJson(pkg, cwd) {
    var _a;
    return Object.entries((_a = (0, get_pkg_bin_1.getPackageBins)(pkg)) !== null && _a !== void 0 ? _a : [])
        .reduce((a, row) => {
        let filename = row[1];
        let file = (0, upath2_1.join)(cwd, filename);
        let bool = checkFile(file);
        a.push({
            file,
            filename,
            hasShebang: bool,
        });
        return a;
    }, []);
}
//# sourceMappingURL=core.js.map