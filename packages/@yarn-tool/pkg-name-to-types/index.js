"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkgNameToTypes = exports.extractName = exports.listToTypes = exports.escapePackageName = exports.isNamespacedName = exports.parseArgvPkgName = exports.reNamespacedNameWithVersion = exports.reNamespacedName = exports.sep = void 0;
const core_1 = require("array-hyper-unique/core");
const sep = '__';
exports.sep = sep;
const reNamespacedName = /^(?:(@[^\/]+)\/)?([^@]+)$/;
exports.reNamespacedName = reNamespacedName;
const reNamespacedNameWithVersion = /^(?:(@[^\/]+)\/)?([^@]+)(?:@(.+))?$/;
exports.reNamespacedNameWithVersion = reNamespacedNameWithVersion;
function parseArgvPkgName(input) {
    let m = input.match(reNamespacedNameWithVersion);
    if (m) {
        return {
            input,
            namespace: m[1],
            name: m[2],
            version: m[3],
        };
    }
}
exports.parseArgvPkgName = parseArgvPkgName;
function isNamespacedName(packageName) {
    return reNamespacedName.test(packageName);
}
exports.isNamespacedName = isNamespacedName;
function escapePackageName(packageName) {
    return packageName
        .replace(/^@/, '')
        .replace(/[/\\]/, '__');
}
exports.escapePackageName = escapePackageName;
function listToTypes(input, includeVersion) {
    return core_1.array_unique_overwrite(input.reduce(function (a, b) {
        a.push(pkgNameToTypes(b, includeVersion));
        return a;
    }, []));
}
exports.listToTypes = listToTypes;
function extractName(packageName) {
    return parseArgvPkgName(packageName).name;
}
exports.extractName = extractName;
function pkgNameToTypes(packageName, includeVersion) {
    var _a;
    let m = parseArgvPkgName(packageName);
    let { version, name, namespace } = m;
    if (namespace) {
        name = escapePackageName(namespace) + '__' + name;
    }
    let typeName = `@types/${name}`;
    if (includeVersion && ((_a = m.version) === null || _a === void 0 ? void 0 : _a.length)) {
        typeName += `${version}`;
    }
    return typeName;
}
exports.pkgNameToTypes = pkgNameToTypes;
exports.default = pkgNameToTypes;
//# sourceMappingURL=index.js.map