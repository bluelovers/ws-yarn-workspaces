"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependenciesIfNotExists = exports._add_to_deps_field = exports.addDependencies = void 0;
function addDependencies(pkg, name, semver, options = {}, override) {
    let bool = null;
    if (options.dev) {
        bool = _add_to_deps_field(pkg, 'devDependencies', name, semver, override, bool);
    }
    if (options.peer) {
        bool = _add_to_deps_field(pkg, 'peerDependencies', name, semver, override, bool);
    }
    if (options.optional) {
        bool = _add_to_deps_field(pkg, 'optionalDependencies', name, semver, override, bool);
    }
    if (bool === null) {
        bool = _add_to_deps_field(pkg, 'dependencies', name, semver, override, bool);
    }
    return {
        pkg,
        bool,
    };
}
exports.addDependencies = addDependencies;
function _add_to_deps_field(pkg, field, name, semver, override, bool) {
    var _a, _b, _c;
    const record = (_a = pkg[field]) !== null && _a !== void 0 ? _a : {};
    if (record[name] !== semver) {
        if (!((_b = record[name]) === null || _b === void 0 ? void 0 : _b.length) || override === true) {
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
function addDependenciesIfNotExists(pkg, name, semver, options = {}) {
    return addDependencies(pkg, name, semver, options);
}
exports.addDependenciesIfNotExists = addDependenciesIfNotExists;
//# sourceMappingURL=addDependenciesIfNotExists.js.map