"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnWsRootRun = spawnWsRootRun;
exports.spawnWsRootExec = spawnWsRootExec;
exports.spawnWsRootRunSync = spawnWsRootRunSync;
exports.spawnWsRootExecSync = spawnWsRootExecSync;
const tslib_1 = require("tslib");
const core_1 = tslib_1.__importDefault(require("find-yarn-workspace-root2/core"));
const cross_spawn_extra_1 = tslib_1.__importDefault(require("cross-spawn-extra"));
function spawnWsRootRun(argv, opts) {
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.async((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'run',
        ...argv,
    ], {
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
function spawnWsRootExec(argv, opts) {
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.async((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'exec',
        ...argv,
    ], {
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
function spawnWsRootRunSync(argv, opts) {
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.sync((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'run',
        ...argv,
    ], {
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
function spawnWsRootExecSync(argv, opts) {
    let cwd = (0, core_1.default)(opts === null || opts === void 0 ? void 0 : opts.cwd);
    return cross_spawn_extra_1.default.sync((opts === null || opts === void 0 ? void 0 : opts.npmClient) || 'yarn', [
        'exec',
        ...argv,
    ], {
        stdio: 'inherit',
        ...opts === null || opts === void 0 ? void 0 : opts.spawnOptions,
        cwd,
    });
}
exports.default = spawnWsRootRun;
//# sourceMappingURL=index.js.map