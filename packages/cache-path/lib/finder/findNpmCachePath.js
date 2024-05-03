"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNpmCachePath = findNpmCachePath;
const cross_spawn_extra_1 = require("cross-spawn-extra");
/**
 * try get npm global cache path
 */
function findNpmCachePath(cwd, processEnv = process.env) {
    var _a, _b, _c;
    let cache = (_c = (_b = (_a = (0, cross_spawn_extra_1.sync)('npm', [
        'config', 'get', 'cache',
    ], {
        stripAnsi: true,
        env: processEnv,
        cwd,
    })) === null || _a === void 0 ? void 0 : _a.stdout) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b);
    return cache;
}
//# sourceMappingURL=findNpmCachePath.js.map