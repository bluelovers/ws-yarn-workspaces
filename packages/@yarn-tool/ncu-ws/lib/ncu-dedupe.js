"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleDedupe = void 0;
const ncu_1 = require("@yarn-tool/ncu");
const yarnlock_stringify_1 = require("@yarn-tool/yarnlock-stringify");
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
const yarnlock_diff_1 = require("@yarn-tool/yarnlock-diff");
const writeYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/writeYarnLockFile");
async function _handleDedupe(argv, runtime, pkgNcu) {
    const { consoleDebug, console, cwd, rootData, pkg_file, pkg_data, resolutions, pkg_file_ws, pkg_data_ws, doWorkspace, } = runtime;
    Object.entries(pkgNcu.json_new.dependencies || {})
        .concat(Object.entries(pkgNcu.json_new.devDependencies || {}), Object.entries(pkgNcu.json_new.optionalDependencies || {}))
        .reduce(function (a, [name, ver_new]) {
        const ver_old = resolutions[name];
        if (ver_old) {
            if (ver_new === 'latest') {
                ver_new = '*';
            }
            // @ts-ignore
            a[name] = ver_new;
        }
        return a;
    }, {});
    const yl = (0, read_1.fsYarnLockSafe)(rootData.root);
    if (!yl.yarnlock_old) {
        // 防止 yarn.lock 不存在
        return true;
    }
    const ret = await (0, ncu_1.checkResolutionsUpdate)(resolutions, yl.yarnlock_old, argv);
    if (ret.yarnlock_changed) {
        const msg = (0, yarnlock_diff_1.yarnLockDiff)((0, yarnlock_stringify_1.yarnLockStringify)(ret.yarnlock_old_obj), (0, yarnlock_stringify_1.yarnLockStringify)(ret.yarnlock_new_obj));
        if (msg) {
            console.log(`\n${msg}\n`);
        }
    }
    if (pkgNcu.json_changed && !argv.upgrade) {
        ret.yarnlock_changed && consoleDebug.magenta.info(`your dependencies version high than resolutions`);
        consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt ncu -u`), ` , for update package.json`);
    }
    if (ret.yarnlock_changed && argv.upgrade) {
        (0, writeYarnLockFile_1.writeYarnLockFile)(yl.yarnlock_file, ret.yarnlock_new_obj);
        consoleDebug.magenta.info(`Deduplication yarn.lock`);
        consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt install`), ` , for upgrade dependencies now`);
    }
}
exports._handleDedupe = _handleDedupe;
//# sourceMappingURL=ncu-dedupe.js.map