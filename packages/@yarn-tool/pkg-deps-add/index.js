"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependenciesOverwrite = exports.addDependenciesIfNotExists = exports.addDependencies = exports._add_to_deps_field = void 0;
function _add_to_deps_field(pkg, field, name, semver, override, bool, existsOnly) {
    var _a, _b, _c;
    const record = (_a = pkg[field]) !== null && _a !== void 0 ? _a : {};
    if (record[name] !== semver && existsOnly !== true) {
        if (!((_b = record[name]) === null || _b === void 0 ? void 0 : _b.length) && (existsOnly) || override === true) {
            (_c = pkg[field]) !== null && _c !== void 0 ? _c : (pkg[field] = {});
            pkg[field][name] = semver;
            bool = false;
        }
        else {
            bool !== null && bool !== void 0 ? bool : (bool = true);
        }
    }
    return bool;
}
exports._add_to_deps_field = _add_to_deps_field;
function addDependencies(pkg, name, semver, options = {}, override, existsOnly) {
    let bool = null;
    if (options.dev) {
        bool = _add_to_deps_field(pkg, 'devDependencies', name, semver, override, bool, existsOnly);
    }
    if (options.peer) {
        bool = _add_to_deps_field(pkg, 'peerDependencies', name, semver, override, bool, existsOnly);
    }
    if (options.optional) {
        bool = _add_to_deps_field(pkg, 'optionalDependencies', name, semver, override, bool, existsOnly);
    }
    if (bool === null) {
        bool = _add_to_deps_field(pkg, 'dependencies', name, semver, override, bool, existsOnly);
    }
    return {
        pkg,
        bool,
    };
}
exports.addDependencies = addDependencies;
function addDependenciesIfNotExists(pkg, name, semver, options = {}) {
    return addDependencies(pkg, name, semver, options, false);
}
exports.addDependenciesIfNotExists = addDependenciesIfNotExists;
function addDependenciesOverwrite(pkg, name, semver, options = {}) {
    return addDependencies(pkg, name, semver, options, true);
}
exports.addDependenciesOverwrite = addDependenciesOverwrite;
exports.default = addDependencies;
//# sourceMappingURL=index.js.map