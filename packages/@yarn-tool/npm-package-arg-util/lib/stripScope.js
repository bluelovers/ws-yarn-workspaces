"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripScope = void 0;
function stripScope(packageName) {
    let index = packageName.indexOf('/') + 1;
    return packageName.slice(index);
}
exports.stripScope = stripScope;
//# sourceMappingURL=stripScope.js.map