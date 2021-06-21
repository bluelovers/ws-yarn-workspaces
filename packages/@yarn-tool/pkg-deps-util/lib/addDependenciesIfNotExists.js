"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependenciesIfNotExists = void 0;
function addDependenciesIfNotExists(pkg, name, semver, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    let bool = null;
    if (options.dev) {
        if (!((_b = (_a = pkg.devDependencies) === null || _a === void 0 ? void 0 : _a[name]) === null || _b === void 0 ? void 0 : _b.length)) {
            (_c = pkg.devDependencies) !== null && _c !== void 0 ? _c : (pkg.devDependencies = {});
            pkg.devDependencies[name] = semver;
            bool = false;
        }
        else if (pkg.devDependencies[name] !== semver) {
            bool !== null && bool !== void 0 ? bool : (bool = true);
        }
    }
    if (options.peer) {
        if (!((_e = (_d = pkg.peerDependencies) === null || _d === void 0 ? void 0 : _d[name]) === null || _e === void 0 ? void 0 : _e.length)) {
            (_f = pkg.peerDependencies) !== null && _f !== void 0 ? _f : (pkg.peerDependencies = {});
            pkg.peerDependencies[name] = semver;
            bool = false;
        }
        else if (pkg.peerDependencies[name] !== semver) {
            bool !== null && bool !== void 0 ? bool : (bool = true);
        }
    }
    if (options.optional) {
        if (!((_h = (_g = pkg.optionalDependencies) === null || _g === void 0 ? void 0 : _g[name]) === null || _h === void 0 ? void 0 : _h.length)) {
            (_j = pkg.optionalDependencies) !== null && _j !== void 0 ? _j : (pkg.optionalDependencies = {});
            pkg.optionalDependencies[name] = semver;
            bool = false;
        }
        else if (pkg.optionalDependencies[name] !== semver) {
            bool !== null && bool !== void 0 ? bool : (bool = true);
        }
    }
    if (bool === null) {
        if (!((_l = (_k = pkg.dependencies) === null || _k === void 0 ? void 0 : _k[name]) === null || _l === void 0 ? void 0 : _l.length)) {
            (_m = pkg.dependencies) !== null && _m !== void 0 ? _m : (pkg.dependencies = {});
            pkg.dependencies[name] = semver;
            bool = false;
        }
        else if (pkg.dependencies[name] !== semver) {
            bool !== null && bool !== void 0 ? bool : (bool = true);
        }
    }
    return {
        pkg,
        bool,
    };
}
exports.addDependenciesIfNotExists = addDependenciesIfNotExists;
//# sourceMappingURL=addDependenciesIfNotExists.js.map