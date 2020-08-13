"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoFromDedupeCache = exports.wrapDedupe = void 0;
/**
 * Created by user on 2020/6/12.
 */
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
const upath2_1 = require("upath2");
const dedupe_1 = require("./dedupe");
const diff_1 = require("./diff");
const fs_extra_1 = require("fs-extra");
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
function wrapDedupe(yarg, argv, options) {
    const { consoleDebug } = options;
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
    cache.consoleDebug = cache.consoleDebug || consoleDebug;
    let { init, before, main, after, end } = options;
    // @ts-ignore
    cache.rootData = cache.rootData || find_root_1.default({
        ...argv,
        cwd: cache.cwd,
    }, true);
    // @ts-ignore
    cache.yarnlock_cache = cache.yarnlock_cache || read_1.fsYarnLock(cache.rootData.root);
    // @ts-ignore
    cache.yarnlock_old = cache.yarnlock_cache.yarnlock_old;
    cache.yarnlock_old2 = cache.yarnlock_old;
    // @ts-ignore
    cache.yarnlock_old_exists = cache.yarnlock_cache.yarnlock_exists;
    LABEL1: {
        // @ts-ignore
        cache.ret.init = init ? !!init(yarg, argv, cache) : null;
        if (cache.ret.init) {
            break LABEL1;
        }
        // @ts-ignore
        cache.ret.before = before ? !!before(yarg, argv, cache) : null;
        if (cache.ret.before) {
            break LABEL1;
        }
        cache.yarnlock_cache = read_1.fsYarnLock(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            let ret1 = dedupe_1.yarnDedupe(cache.yarnlock_cache.yarnlock_old);
            if (ret1.yarnlock_changed) {
                fs_extra_1.writeFileSync(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);
                let msg = diff_1.yarnLockDiff(ret1.yarnlock_old, ret1.yarnlock_new);
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
                cache.yarnlock_changed = true;
                cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.info(`Deduplication yarn.lock`);
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
            }
        }
        // @ts-ignore
        cache.ret.main = !!main(yarg, argv, cache);
        if (cache.ret.main) {
            break LABEL1;
        }
        cache.yarnlock_cache = read_1.fsYarnLock(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            let ret1 = dedupe_1.yarnDedupe(cache.yarnlock_cache.yarnlock_old);
            if (ret1.yarnlock_changed) {
                if (cache.yarnlock_old2 == null) {
                    cache.yarnlock_old2 = ret1.yarnlock_old;
                }
                fs_extra_1.writeFileSync(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);
                let msg = diff_1.yarnLockDiff(ret1.yarnlock_old, ret1.yarnlock_new);
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
                cache.yarnlock_changed = true;
                cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.info(`Deduplication yarn.lock`);
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
            }
            else if (cache.yarnlock_changed == null) {
                cache.yarnlock_changed = ret1.yarnlock_changed;
            }
        }
        if (cache.yarnlock_changed) {
            if (!cache.yarnlock_cache.yarnlock_exists || !cache.yarnlock_old || cache.yarnlock_old == cache.yarnlock_cache.yarnlock_old) {
                cache.yarnlock_changed = false;
            }
        }
        // @ts-ignore
        cache.ret.after = after ? !!after(yarg, argv, cache) : null;
        if (cache.ret.after) {
            break LABEL1;
        }
        cache.yarnlock_cache = read_1.fsYarnLock(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            if (cache.yarnlock_changed) {
                let msg = diff_1.yarnLockDiff(cache.yarnlock_old || cache.yarnlock_old2, cache.yarnlock_cache.yarnlock_old);
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
            }
            else {
                let yarnlock_now = fs_extra_1.readFileSync(cache.yarnlock_cache.yarnlock_file).toString();
                let yarnlock_old2 = cache.yarnlock_old || cache.yarnlock_old2;
                if (yarnlock_old2) {
                    let msg = diff_1.yarnLockDiff(yarnlock_old2, yarnlock_now);
                    if (msg) {
                        cache.yarnlock_msg = msg;
                        cache.yarnlock_changed = true;
                    }
                }
            }
        }
    }
    // @ts-ignore
    cache.ret.end = end ? !!end(yarg, argv, cache) : null;
    return {
        cwd: cache.cwd,
        rootData: cache.rootData,
        yarg,
        argv,
        // @ts-ignore
        cache,
    };
}
exports.wrapDedupe = wrapDedupe;
function infoFromDedupeCache(cache) {
    let { yarnlock_changed, yarnlock_old_exists } = cache;
    let { yarnlock_file, yarnlock_exists } = cache.yarnlock_cache;
    return {
        ...cache.rootData,
        yarnlock_file,
        yarnlock_old_exists,
        yarnlock_exists,
        yarnlock_changed,
    };
}
exports.infoFromDedupeCache = infoFromDedupeCache;
//# sourceMappingURL=wrap.js.map