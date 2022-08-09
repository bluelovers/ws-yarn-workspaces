"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleNcuResolutions = void 0;
const ncu_1 = require("@yarn-tool/ncu");
const yargs_util_1 = require("@yarn-tool/yargs-util");
const debug_color2_1 = require("debug-color2");
const upath2_1 = require("upath2");
const table_1 = require("@yarn-tool/table");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const yarnlock_stringify_1 = require("@yarn-tool/yarnlock-stringify");
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
const yarnlock_diff_1 = require("@yarn-tool/yarnlock-diff");
const writeYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/writeYarnLockFile");
async function _handleNcuResolutions(argv, runtime) {
    const { consoleDebug, console, cwd, rootData, pkg_file, pkg_data, resolutions, pkg_file_ws, pkg_data_ws, doWorkspace, } = runtime;
    if (!resolutions || !Object.keys(resolutions).length) {
        return (0, yargs_util_1.yargsProcessExit)(`resolutions aren't exists in package.json`);
    }
    const yl = (0, read_1.fsYarnLockSafe)(rootData.root);
    if (!yl.yarnlock_old) {
        // 防止 yarn.lock 不存在
        return;
    }
    const ret = await (0, ncu_1.checkResolutionsUpdate)(resolutions, yl.yarnlock_old, argv);
    //console.log(ret);
    if (ret.yarnlock_changed) {
        (0, writeYarnLockFile_1.writeYarnLockFile)(yl.yarnlock_file, ret.yarnlock_new_obj);
        (0, debug_color2_1.chalkByConsole)((chalk, console) => {
            const p = chalk.cyan((0, upath2_1.relative)(argv.cwd, yl.yarnlock_file));
            console.log(`${p} is updated!`);
        }, console);
        const msg = (0, yarnlock_diff_1.yarnLockDiff)((0, yarnlock_stringify_1.yarnLockStringify)(ret.yarnlock_old_obj), (0, yarnlock_stringify_1.yarnLockStringify)(ret.yarnlock_new_obj));
        if (msg) {
            console.log(`\n${msg}\n`);
        }
    }
    const ls2 = Object.values(ret.deps)
        .filter(data => {
        const { name, version_old, version_new } = data;
        return (0, ncu_1.isUpgradeable)(version_old, version_new);
    });
    const ncuOptions = (0, ncu_1.npmCheckUpdatesOptions)(argv);
    const fromto = ls2
        .reduce((a, data) => {
        const { name, version_old, version_new } = data;
        const new_semver = (0, ncu_1.updateSemver)(version_old, version_new, ncuOptions);
        a.from[name] = version_old;
        a.to[name] = new_semver;
        resolutions[name] = new_semver;
        return a;
    }, {
        from: {},
        to: {},
    });
    const msg = (0, table_1.toDependencyTable)(fromto);
    console.log(`\n${msg}\n`);
    if (argv.upgrade) {
        if (doWorkspace) {
            pkg_data_ws.resolutions = resolutions;
            (0, write_package_json_1.writePackageJSONSync)(pkg_file_ws, pkg_data_ws);
            (0, debug_color2_1.chalkByConsole)((chalk, console) => {
                const p = chalk.cyan((0, upath2_1.relative)(argv.cwd, pkg_file_ws));
                console.log(`${p} is updated!`);
            }, console);
        }
        else {
            pkg_data.resolutions = resolutions;
            (0, write_package_json_1.writePackageJSONSync)(pkg_file, pkg_data);
            (0, debug_color2_1.chalkByConsole)((chalk, console) => {
                const p = chalk.cyan((0, upath2_1.relative)(rootData.ws || rootData.pkg, pkg_file));
                console.log(`${p} is updated!`);
            }, console);
        }
    }
}
exports._handleNcuResolutions = _handleNcuResolutions;
//# sourceMappingURL=ncu-resolutions.js.map