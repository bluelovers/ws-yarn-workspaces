"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkgNameToTypes = exports.extractName = exports.escapePackageName = exports.isNamespacedName = exports.parseArgvPkgName = exports.reNamespacedNameWithVersion = exports.reNamespacedName = exports.sep = void 0;
const parseArgvPkgName_1 = require("@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName");
Object.defineProperty(exports, "parseArgvPkgName", { enumerable: true, get: function () { return parseArgvPkgName_1.parseArgvPkgName; } });
const sep = '__';
exports.sep = sep;
const reNamespacedName = /^(?:(@[^\/]+)\/)?([^@]+)$/;
exports.reNamespacedName = reNamespacedName;
const reNamespacedNameWithVersion = /^(?:(@[^\/]+)\/)?([^@]+)(?:@(.+))?$/;
exports.reNamespacedNameWithVersion = reNamespacedNameWithVersion;
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
function extractName(packageName) {
    return (0, parseArgvPkgName_1.parseArgvPkgName)(packageName).name;
}
exports.extractName = extractName;
function pkgNameToTypes(packageName, includeVersion) {
    var _a;
    let m = (0, parseArgvPkgName_1.parseArgvPkgName)(packageName);
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