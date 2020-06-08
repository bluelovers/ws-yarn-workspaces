"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lernaChanged = void 0;
const cross_spawn_extra_1 = __importDefault(require("cross-spawn-extra"));
const find_root_1 = require("@yarn-tool/find-root");
const util_1 = require("ws-pkg-list/lib/util");
function lernaChanged(cwd, options) {
    var _a;
    cwd = find_root_1.findRoot({
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
    let list = JSON.parse(cp.stdout.toString());
    list = util_1.normalizeListableExtra(list, cwd);
    return {
        cwd,
        list,
    };
}
exports.lernaChanged = lernaChanged;
exports.default = lernaChanged;
//# sourceMappingURL=lerna-changed.js.map