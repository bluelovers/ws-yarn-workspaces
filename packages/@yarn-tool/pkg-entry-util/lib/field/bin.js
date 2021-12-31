"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixPkgBinField = exports.fixBinPath = void 0;
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
function fixBinPath(bin, root) {
    if (!(0, fs_extra_1.existsSync)((0, upath2_1.join)(root, bin))
        && (0, fs_extra_1.existsSync)((0, upath2_1.join)(root, 'bin', bin))) {
        return (0, upath2_1.join)('.', 'bin', bin);
    }
    return null;
}
exports.fixBinPath = fixBinPath;
function fixPkgBinField(pkg, root) {
    if (pkg.bin) {
        if (typeof pkg.bin === 'string') {
            let bin_new = fixBinPath(pkg.bin, root);
            if (bin_new) {
                // @ts-ignore
                pkg.bin = bin_new;
            }
        }
        else if (typeof pkg.bin === 'object' && !Array.isArray(pkg.bin)) {
            Object.keys(pkg.bin)
                .forEach(function (key) {
                if (typeof pkg.bin[key] === 'string') {
                    let bin_new = fixBinPath(pkg.bin[key], root);
                    if (bin_new) {
                        pkg.bin[key] = bin_new;
                    }
                }
            });
        }
    }
    return pkg;
}
exports.fixPkgBinField = fixPkgBinField;
//# sourceMappingURL=bin.js.map