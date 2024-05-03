"use strict";
/**
 * Created by user on 2020/2/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageBins = getPackageBins;
exports.handlePackageBins = handlePackageBins;
exports.firstPackageBin = firstPackageBin;
exports.getPackageInfo = getPackageInfo;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const resolve_package_1 = require("@yarn-tool/resolve-package");
tslib_1.__exportStar(require("./lib/types"), exports);
function getPackageBins(pkg) {
    if (pkg.bin != null) {
        if (typeof pkg.bin === 'string') {
            return {
                [pkg.name]: pkg.bin,
            };
        }
        else {
            return {
                ...pkg.bin,
            };
        }
    }
}
function handlePackageBins(bins, resolveFn) {
    const _cwd = '.' + upath2_1.sep;
    return Object.entries(bins)
        // FIXME: https://github.com/microsoft/TypeScript/issues/45064
        .reduce((a, [k, bin]) => {
        if (resolveFn) {
            bin = resolveFn(_cwd + bin);
        }
        if (!(0, upath2_1.isAbsolute)((0, upath2_1.normalize)(bin))) {
            bin = _cwd + (0, upath2_1.normalize)(bin);
        }
        else {
            bin = (0, upath2_1.normalize)(bin);
        }
        a[k] = bin;
        return a;
    }, {});
}
function firstPackageBin(bins) {
    bins = bins || {};
    let keys = Object.keys(bins);
    if (keys.length) {
        return bins[keys[0]];
    }
}
function getPackageInfo(options) {
    let { pkgRoot, pkg, name } = options;
    if (pkg) {
        name = name || options.pkg.name;
    }
    else if (name) {
        let data = (0, resolve_package_1.resolvePackage)(options.name, {
            paths: options.paths,
        });
        pkg = data.pkg;
        pkgRoot = pkgRoot || data.pkgRoot;
    }
    else {
        throw new TypeError(`name or pkg is not valid`);
    }
    return {
        name,
        pkgRoot,
        pkg: pkg,
    };
}
//# sourceMappingURL=util.js.map