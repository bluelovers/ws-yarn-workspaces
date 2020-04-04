"use strict";
/**
 * Created by user on 2020/2/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageInfo = exports.firstPackageBin = exports.handlePackageBins = exports.getPackageBins = void 0;
const upath2_1 = require("upath2");
const resolve_package_1 = require("@yarn-tool/resolve-package");
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
exports.getPackageBins = getPackageBins;
function handlePackageBins(bins, resolveFn) {
    const _cwd = '.' + upath2_1.sep;
    return Object.entries(bins)
        .reduce((a, [k, bin]) => {
        if (resolveFn) {
            bin = resolveFn(_cwd + bin);
        }
        if (!upath2_1.isAbsolute(upath2_1.normalize(bin))) {
            bin = _cwd + upath2_1.normalize(bin);
        }
        else {
            bin = upath2_1.normalize(bin);
        }
        a[k] = bin;
        return a;
    }, {});
}
exports.handlePackageBins = handlePackageBins;
function firstPackageBin(bins) {
    bins = bins || {};
    let keys = Object.keys(bins);
    if (keys.length) {
        return bins[keys[0]];
    }
}
exports.firstPackageBin = firstPackageBin;
function getPackageInfo(options) {
    let { pkgRoot, pkg, name } = options;
    if (pkg) {
        name = name || options.pkg.name;
    }
    else if (name) {
        let data = resolve_package_1.resolvePackage(options.name, {
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
exports.getPackageInfo = getPackageInfo;
//# sourceMappingURL=util.js.map