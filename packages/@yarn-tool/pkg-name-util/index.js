"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPackageName = formatPackageName;
exports.stripScope = stripScope;
exports.assertScope = assertScope;
exports.validScope = validScope;
function formatPackageName(data) {
    var _a, _b;
    if (!((_a = data.name) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new TypeError(`Invalid package name`);
    }
    if (((_b = data.scope) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        assertScope(data.scope);
        const prefix = data.scope[0] === '@' ? '' : '@';
        return `${prefix}${data.scope}/${data.name}`;
    }
    return data.name;
}
function stripScope(packageName) {
    const index = packageName.indexOf('/') + 1;
    return packageName.slice(index);
}
function assertScope(scope, includeAtSign) {
    if (typeof includeAtSign === 'boolean' && includeAtSign !== (scope[0] === '@')) {
        throw new TypeError(`Invalid scope '${scope}' when includeAtSign is ${includeAtSign}`);
    }
    let _scope = scope.replace(/^@/, '');
    if (!_scope.length || _scope.split(/[^\w\-_]/, 2).length !== 1) {
        throw new TypeError(`Invalid scope '${scope}'`);
    }
}
function validScope(scope, includeAtSign) {
    try {
        assertScope(scope, includeAtSign);
        return true;
    }
    catch (e) {
    }
    return false;
}
exports.default = formatPackageName;
//# sourceMappingURL=index.js.map