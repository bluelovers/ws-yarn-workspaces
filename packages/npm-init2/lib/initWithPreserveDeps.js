"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWithPreserveDeps = void 0;
const cross_spawn_extra_1 = require("cross-spawn-extra");
const npm_package_json_loader_1 = require("npm-package-json-loader");
function initWithPreserveDeps({ npmClient, cwd, args, old_pkg, pkg_file_path }) {
    const cp = (0, cross_spawn_extra_1.sync)(npmClient, args, {
        stdio: 'inherit',
        cwd,
        env: {
            FORCE_COLOR: "0",
            NO_COLOR: "1",
        }
    });
    if (!cp.error && old_pkg) {
        let pkg = new npm_package_json_loader_1.PackageJsonLoader(pkg_file_path);
        if (pkg.exists()) {
            pkg.data.dependencies = old_pkg.dependencies;
            pkg.data.devDependencies = old_pkg.devDependencies;
            pkg.writeOnlyWhenLoaded();
        }
    }
    return { cp };
}
exports.initWithPreserveDeps = initWithPreserveDeps;
exports.default = initWithPreserveDeps;
//# sourceMappingURL=initWithPreserveDeps.js.map