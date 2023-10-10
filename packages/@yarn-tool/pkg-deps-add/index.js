"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependenciesOverwrite = exports.addDependenciesIfNotExists = exports.addDependencies = exports._add_to_deps_field = exports._add_to_deps_field_core = exports.checkDependenciesExistsAll = exports._checkDependenciesExistsAll = exports.checkDependenciesExists = exports._checkDependenciesExists = exports.EnumResultAddDependencies = void 0;
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
var EnumResultAddDependencies;
(function (EnumResultAddDependencies) {
    EnumResultAddDependencies[EnumResultAddDependencies["changed"] = 2] = "changed";
    EnumResultAddDependencies[EnumResultAddDependencies["exists"] = 1] = "exists";
})(EnumResultAddDependencies || (exports.EnumResultAddDependencies = EnumResultAddDependencies = {}));
function _checkDependenciesExists(record, name) {
    var _a;
    return ((_a = record === null || record === void 0 ? void 0 : record[name]) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
exports._checkDependenciesExists = _checkDependenciesExists;
function checkDependenciesExists(pkg, field, name) {
    return _checkDependenciesExists(pkg[field], name);
}
exports.checkDependenciesExists = checkDependenciesExists;
function _checkDependenciesExistsAll(pkg, fields, name) {
    return fields
        .reduce((map, field) => {
        map[field] = checkDependenciesExists(pkg, field, name);
        if (map[field]) {
            map._field.push(field);
            map._exists = map[field];
        }
        return map;
    }, {
        _exists: false,
        _field: [],
    });
}
exports._checkDependenciesExistsAll = _checkDependenciesExistsAll;
function checkDependenciesExistsAll(pkg, name) {
    return _checkDependenciesExistsAll(pkg, types_1.packageJsonDependenciesFields, name);
}
exports.checkDependenciesExistsAll = checkDependenciesExistsAll;
function _add_to_deps_field_core(pkg, field, name, semver) {
    var _a;
    (_a = pkg[field]) !== null && _a !== void 0 ? _a : (pkg[field] = {});
    pkg[field][name] = semver;
    return pkg;
}
exports._add_to_deps_field_core = _add_to_deps_field_core;
function _add_to_deps_field(pkg, field, name, semver, override, bool, existsOnly) {
    var _a;
    const record = (_a = pkg[field]) !== null && _a !== void 0 ? _a : {};
    const current = record[name];
    if (current !== semver) {
        const length = current === null || current === void 0 ? void 0 : current.length;
        if (existsOnly === true) {
            if (length) {
                _add_to_deps_field_core(pkg, field, name, semver);
                bool = 2 /* EnumResultAddDependencies.changed */;
            }
        }
        else if (existsOnly === false) {
            if (!length) {
                _add_to_deps_field_core(pkg, field, name, semver);
                bool = 2 /* EnumResultAddDependencies.changed */;
            }
        }
        else {
            if (!length || override === true) {
                _add_to_deps_field_core(pkg, field, name, semver);
                bool = 2 /* EnumResultAddDependencies.changed */;
            }
        }
        if (length) {
            bool !== null && bool !== void 0 ? bool : (bool = 1 /* EnumResultAddDependencies.exists */);
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