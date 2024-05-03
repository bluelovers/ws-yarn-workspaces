"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumResultAddDependencies = void 0;
exports._checkDependenciesExists = _checkDependenciesExists;
exports.checkDependenciesExists = checkDependenciesExists;
exports._checkDependenciesExistsAll = _checkDependenciesExistsAll;
exports.checkDependenciesExistsAll = checkDependenciesExistsAll;
exports._add_to_deps_field_core = _add_to_deps_field_core;
exports._add_to_deps_field = _add_to_deps_field;
exports.addDependencies = addDependencies;
exports.addDependenciesIfNotExists = addDependenciesIfNotExists;
exports.addDependenciesOverwrite = addDependenciesOverwrite;
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
function checkDependenciesExists(pkg, field, name) {
    return _checkDependenciesExists(pkg[field], name);
}
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
function checkDependenciesExistsAll(pkg, name) {
    return _checkDependenciesExistsAll(pkg, types_1.packageJsonDependenciesFields, name);
}
function _add_to_deps_field_core(pkg, field, name, semver) {
    var _a;
    (_a = pkg[field]) !== null && _a !== void 0 ? _a : (pkg[field] = {});
    pkg[field][name] = semver;
    return pkg;
}
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
function addDependenciesIfNotExists(pkg, name, semver, options = {}) {
    return addDependencies(pkg, name, semver, options, false);
}
function addDependenciesOverwrite(pkg, name, semver, options = {}) {
    return addDependencies(pkg, name, semver, options, true);
}
exports.default = addDependencies;
//# sourceMappingURL=index.js.map