"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPackageBin = exports.normalizePackageBins = void 0;
const upath2_1 = require("upath2");
const util_1 = require("./util");
function normalizePackageBins(options) {
    let { pkgRoot, pkg, name } = util_1.getPackageInfo(options);
    let bins = util_1.getPackageBins(pkg) || {};
    if (pkgRoot != null) {
        const resolveFn = (options.usePathResolve) ? ((bin) => upath2_1.resolve(pkgRoot, bin)) : ((bin) => require.resolve(bin, {
            paths: [
                pkgRoot,
            ],
        }));
        return util_1.handlePackageBins(bins, resolveFn);
    }
    return util_1.handlePackageBins(bins);
}
exports.normalizePackageBins = normalizePackageBins;
function defaultPackageBin(options, defaultKey) {
    let { pkgRoot, pkg, name } = util_1.getPackageInfo(options);
    let bins = normalizePackageBins({
        ...options,
        pkgRoot,
        pkg,
        name,
    });
    if (defaultKey == null && typeof name === 'string') {
        defaultKey = name.split('/').pop();
    }
    if (typeof defaultKey === 'string' && defaultKey in bins) {
        return bins[defaultKey];
    }
    return util_1.firstPackageBin(bins);
}
exports.defaultPackageBin = defaultPackageBin;
exports.default = normalizePackageBins;
//# sourceMappingURL=index.js.map