"use strict";
/**
 * Created by user on 2020/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPkgJson = exports.checkFile = exports.hasShebang = void 0;
const fs_extra_1 = require("fs-extra");
const shebang_1 = require("@yarn-tool/shebang");
const get_pkg_bin_1 = require("@yarn-tool/get-pkg-bin");
const upath2_1 = require("upath2");
function hasShebang(buf) {
    var _a, _b;
    return ((_b = (_a = shebang_1.matchShebang(buf.toString())) === null || _a === void 0 ? void 0 : _a.script) === null || _b === void 0 ? void 0 : _b.length) > 0;
}
exports.hasShebang = hasShebang;
function checkFile(file) {
    if (fs_extra_1.existsSync(file)) {
        return hasShebang(fs_extra_1.readFileSync(file));
    }
}
exports.checkFile = checkFile;
function checkPkgJson(pkg, cwd) {
    var _a;
    return Object.entries((_a = get_pkg_bin_1.getPackageBins(pkg)) !== null && _a !== void 0 ? _a : [])
        .reduce((a, row) => {
        let filename = row[1];
        let file = upath2_1.join(cwd, filename);
        let bool = checkFile(file);
        a.push({
            file,
            filename,
            hasShebang: bool,
        });
        return a;
    }, []);
}
exports.checkPkgJson = checkPkgJson;
//# sourceMappingURL=core.js.map