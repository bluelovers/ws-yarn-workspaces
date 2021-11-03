"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePackage = void 0;
const upath2_1 = require("upath2");
const pkg_dir_1 = require("pkg-dir");
function resolvePackage(name, options) {
    const entryPointLocation = require.resolve(name, options);
    const pkgRoot = (0, pkg_dir_1.sync)(entryPointLocation);
    const pkgConfigLocation = (0, upath2_1.resolve)(pkgRoot, 'package.json');
    return {
        name,
        pkgRoot,
        pkg: require(pkgConfigLocation),
        pkgConfigLocation,
        entryPointLocation,
        resolveLocation(path, ...paths) {
            return (0, upath2_1.resolve)(pkgRoot, path, ...paths);
        },
    };
}
exports.resolvePackage = resolvePackage;
exports.default = resolvePackage;
//# sourceMappingURL=index.js.map