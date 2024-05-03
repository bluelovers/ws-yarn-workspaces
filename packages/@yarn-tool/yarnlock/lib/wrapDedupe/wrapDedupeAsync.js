"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapDedupeAsync = wrapDedupeAsync;
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
const object_1 = require("@yarn-tool/yarnlock-dedupe/object");
const fs_extra_1 = require("fs-extra");
const yarnlock_diff_1 = require("@yarn-tool/yarnlock-diff");
const handleWrapDedupeOptions_1 = require("./handleWrapDedupeOptions");
async function wrapDedupeAsync(yarg, argv, options) {
    let cache;
    ({
        options,
        cache,
    } = (0, handleWrapDedupeOptions_1.handleWrapDedupeOptions)(yarg, argv, options));
    const { consoleDebug } = options;
    let { init, before, main, after, end } = options;
    LABEL1: {
        cache.ret.init = init ? !!await init(yarg, argv, cache) : null;
        if (cache.ret.init) {
            break LABEL1;
        }
        cache.ret.before = before ? !!await before(yarg, argv, cache) : null;
        if (cache.ret.before) {
            break LABEL1;
        }
        cache.yarnlock_cache = (0, read_1.fsYarnLockSafe)(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            let ret1 = await (0, object_1.yarnDedupe)(cache.yarnlock_cache.yarnlock_old);
            if (ret1.yarnlock_changed) {
                (0, fs_extra_1.writeFileSync)(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);
                let msg = (0, yarnlock_diff_1.yarnLockDiff)(ret1.yarnlock_old, ret1.yarnlock_new);
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
                cache.yarnlock_changed = true;
                cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.info(`Deduplication yarn.lock`);
                consoleDebug === null || consoleDebug === void 0 ? void 0 : consoleDebug.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
            }
        }
        cache.ret.main = !!await main(yarg, argv, cache);
        if (cache.ret.main) {
            break LABEL1;
        }
        cache.yarnlock_cache = (0, read_1.fsYarnLockSafe)(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            let ret1 = (0, object_1.yarnDedupe)(cache.yarnlock_cache.yarnlock_old);
            if (ret1.yarnlock_changed) {
                if (cache.yarnlock_old2 == null) {
                    cache.yarnlock_old2 = ret1.yarnlock_old;
                }
                (0, fs_extra_1.writeFileSync)(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);
                let msg = (0, yarnlock_diff_1.yarnLockDiff)(ret1.yarnlock_old, ret1.yarnlock_new);
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
        cache.ret.after = after ? !!await after(yarg, argv, cache) : null;
        if (cache.ret.after) {
            break LABEL1;
        }
        cache.yarnlock_cache = (0, read_1.fsYarnLockSafe)(cache.rootData.root);
        if (cache.yarnlock_cache.yarnlock_exists) {
            if (cache.yarnlock_changed) {
                let msg = (0, yarnlock_diff_1.yarnLockDiff)(cache.yarnlock_old || cache.yarnlock_old2, cache.yarnlock_cache.yarnlock_old);
                if (msg) {
                    cache.yarnlock_msg = msg;
                }
            }
            else {
                let yarnlock_now = (0, fs_extra_1.readFileSync)(cache.yarnlock_cache.yarnlock_file).toString();
                let yarnlock_old2 = cache.yarnlock_old || cache.yarnlock_old2;
                if (yarnlock_old2) {
                    let msg = (0, yarnlock_diff_1.yarnLockDiff)(yarnlock_old2, yarnlock_now);
                    if (msg) {
                        cache.yarnlock_msg = msg;
                        cache.yarnlock_changed = true;
                    }
                }
            }
        }
    }
    // @ts-ignore
    cache.ret.end = end ? !!await end(yarg, argv, cache) : null;
    return {
        cwd: cache.cwd,
        rootData: cache.rootData,
        yarg,
        argv,
        // @ts-ignore
        cache,
    };
}
//# sourceMappingURL=wrapDedupeAsync.js.map