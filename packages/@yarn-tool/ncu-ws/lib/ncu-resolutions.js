"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleNcuResolutions = _handleNcuResolutions;
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
/**
 * 檢查並更新 resolutions (Check and update resolutions)
 *
 * 順序刻意安排為「先寫 yarn.lock、再寫 package.json」：
 * 若沒有 resolutions 或 yarn.lock，會直接結束並提示，避免留下半完成的狀態。
 * yarn.lock is written before package.json on purpose; when resolutions or the
 * yarn.lock are missing the process exits early with a message, so no half-applied
 * state can be left behind.
 *
 * @param argv - 命令列參數（含 `upgrade`、`cwd`） / CLI arguments (including `upgrade`, `cwd`)
 * @param runtime - 由 `_handleRuntime` 建立的執行時期環境 / Runtime environment built by `_handleRuntime`
 */
async function _handleNcuResolutions(argv, runtime) {
    const { consoleDebug, console, cwd, rootData, pkg_file, pkg_data, resolutions, pkg_file_ws, pkg_data_ws, doWorkspace, } = runtime;
    /**
     * 沒有任何 resolutions 就沒有可檢查的對象，直接以錯誤碼結束
     * Without resolutions there is nothing to check, so exit with an error
     */
    if (!resolutions || !Object.keys(resolutions).length) {
        return (0, yargs_util_1.yargsProcessExit)(`resolutions aren't exists in package.json`);
    }
    const yl = (0, read_1.fsYarnLockSafe)(rootData.root);
    /**
     * yarn.lock 缺少時沒有可比對的基準，直接返回不做事
     * Without a yarn.lock there is no baseline to diff against, so do nothing
     */
    if (!yl.yarnlock_old) {
        // 防止 yarn.lock 不存在
        return;
    }
    const ret = await (0, ncu_1.checkResolutionsUpdate)(resolutions, yl.yarnlock_old, argv);
    //console.log(ret);
    /**
     * lock 有變動時先寫入並印出差異，讓使用者在處理 package.json 之前
     * 就能看到 resolutions 的實際變化
     * When the lock changed, write it and print the diff first so the user sees the
     * actual resolution changes before package.json is touched
     */
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
    /**
     * 只保留「真的可以升級」的項目（過濾掉版本關鍵字與無效組合），
     * 避免表格出現無法套用的更新
     * Keep only genuinely upgradeable entries (strategy keywords and invalid
     * combinations are filtered out) so the table never shows unusable updates
     */
    const ls2 = Object.values(ret.deps)
        .filter(data => {
        const { name, version_old, version_new } = data;
        return (0, ncu_1.isUpgradeable)(version_old, version_new);
    });
    const ncuOptions = (0, ncu_1.npmCheckUpdatesOptions)(argv);
    /**
     * 依 semver 規則產生新的版本宣告，同時更新表格資料與 `resolutions` 本身；
     * 這裡直接改動 `resolutions`，因此後續寫檔會帶上最新值。
     * Produce new version declarations per semver rules, updating both the table
     * data and `resolutions` itself; the in-place change is what the later write
     * picks up.
     */
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
    /**
     * 沒有 --upgrade 就只輸出報告，不寫入任何檔案
     * Without --upgrade only the report is printed; nothing is written
     */
    if (argv.upgrade) {
        /**
         * workspace 根模式下，resolutions 屬於根套件，必須寫回根套件的 package.json
         * In workspace-root mode resolutions belong to the root, so write the root's
         * package.json
         */
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
//# sourceMappingURL=ncu-resolutions.js.map