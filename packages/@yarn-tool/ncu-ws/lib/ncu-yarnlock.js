"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleNcuYarnLock = void 0;
const yarnlock_fs_1 = require("@yarn-tool/yarnlock-fs");
const yarnlock_ncu_1 = require("@yarn-tool/yarnlock-ncu");
const fs_extra_1 = require("fs-extra");
async function _handleNcuYarnLock(argv, runtime) {
    const { rootData, consoleDebug, console } = runtime;
    const yl = (0, yarnlock_fs_1.fsYarnLockSafe)(rootData.root);
    if (yl.yarnlock_exists) {
        const ret = await (0, yarnlock_ncu_1.updateYarnLockTag)(yl.yarnlock_old);
        if (ret.yarnlock_changed) {
            consoleDebug.magenta.info(`higher versions exists on registry`);
            const s = (0, yarnlock_ncu_1.printReport)(ret.report);
            (s === null || s === void 0 ? void 0 : s.length) > 0 && console.log(s);
            if (argv.upgrade) {
                (0, fs_extra_1.writeFileSync)(yl.yarnlock_file, ret.yarnlock_new);
                consoleDebug.magenta.info(`yarn.lock updated`);
                consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt install`), ` , for upgrade dependencies now`);
            }
            else {
                consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt ncu -u`), ` , for update yarn.lock`);
            }
        }
    }
}
exports._handleNcuYarnLock = _handleNcuYarnLock;
//# sourceMappingURL=ncu-yarnlock.js.map