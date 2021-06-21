"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWrapDedupeOptions = void 0;
const upath2_1 = require("upath2");
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
function handleWrapDedupeOptions(yarg, argv, options) {
    let cache = options.cache || {};
    // @ts-ignore
    cache.cwd = cache.cwd || argv.cwd;
    if (!cache.cwd) {
        throw new TypeError(`cache.cwd is '${cache.cwd}'`);
    }
    // @ts-ignore
    cache.cwd = upath2_1.resolve(cache.cwd);
    // @ts-ignore
    cache.ret = {};
    cache.yarnlock_msg = undefined;
    // @ts-ignore
    cache.console = cache.console || console;
    // @ts-ignore
    cache.consoleDebug = cache.consoleDebug || options.consoleDebug;
    // @ts-ignore
    cache.rootData = cache.rootData || find_root_1.default({
        ...argv,
        cwd: cache.cwd,
    }, true);
    // @ts-ignore
    cache.yarnlock_cache = cache.yarnlock_cache || read_1.fsYarnLockSafe(cache.rootData.root);
    // @ts-ignore
    cache.yarnlock_old = cache.yarnlock_cache.yarnlock_old;
    cache.yarnlock_old2 = cache.yarnlock_old;
    // @ts-ignore
    cache.yarnlock_old_exists = cache.yarnlock_cache.yarnlock_exists;
    return {
        options,
        cache,
    };
}
exports.handleWrapDedupeOptions = handleWrapDedupeOptions;
//# sourceMappingURL=handleWrapDedupeOptions.js.map