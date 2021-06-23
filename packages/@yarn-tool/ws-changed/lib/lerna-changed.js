"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lernaChanged = void 0;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = (0, tslib_1.__importDefault)(require("cross-spawn-extra"));
const find_root_1 = require("@yarn-tool/find-root");
const util_1 = require("ws-pkg-list/lib/util");
function lernaChanged(cwd, options) {
    var _a;
    cwd = (0, find_root_1.findRoot)({
        cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
        throwError: true,
    }).root;
    let cp = cross_spawn_extra_1.default.sync((_a = options === null || options === void 0 ? void 0 : options.lernaBin) !== null && _a !== void 0 ? _a : 'lerna', [
        'changed',
        '--loglevel=silent',
        '--json',
    ], {
        cwd,
        stripAnsi: true,
    });
    let out = cp.stdout.toString().trim();
    let list = (out.length ? JSON.parse(out) : []);
    list = (0, util_1.normalizeListableExtra)(list, cwd);
    return {
        cwd,
        list,
    };
}
exports.lernaChanged = lernaChanged;
exports.default = lernaChanged;
//# sourceMappingURL=lerna-changed.js.map