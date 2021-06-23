"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePackage = void 0;
const upath2_1 = require("upath2");
function resolvePackage(name, options) {
    let pkgRoot = (0, upath2_1.dirname)(require.resolve(`${name}/package.json`, options));
    return {
        name,
        pkgRoot,
        pkg: require(`${pkgRoot}/package.json`),
    };
}
exports.resolvePackage = resolvePackage;
exports.default = resolvePackage;
//# sourceMappingURL=index.js.map