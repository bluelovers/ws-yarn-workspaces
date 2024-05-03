"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePackageBins = normalizePackageBins;
exports.defaultPackageBin = defaultPackageBin;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const util_1 = require("./util");
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./util"), exports);
function normalizePackageBins(options) {
    let { pkgRoot, pkg, name } = (0, util_1.getPackageInfo)(options);
    let bins = (0, util_1.getPackageBins)(pkg) || {};
    if (pkgRoot != null) {
        const resolveFn = (options.usePathResolve) ? ((bin) => (0, upath2_1.resolve)(pkgRoot, bin)) : ((bin) => require.resolve(bin, {
            paths: [
                pkgRoot,
            ],
        }));
        return (0, util_1.handlePackageBins)(bins, resolveFn);
    }
    return (0, util_1.handlePackageBins)(bins);
}
function defaultPackageBin(options, defaultKey) {
    let { pkgRoot, pkg, name } = (0, util_1.getPackageInfo)(options);
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
    return (0, util_1.firstPackageBin)(bins);
}
exports.default = normalizePackageBins;
//# sourceMappingURL=index.js.map