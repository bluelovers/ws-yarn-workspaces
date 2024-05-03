"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleNcuArgv = _handleNcuArgv;
const ncu_1 = require("@yarn-tool/ncu");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const ncu_yarnlock_1 = require("./ncu-yarnlock");
const runtime_1 = require("./runtime");
const ncu_resolutions_1 = require("./ncu-resolutions");
const ncu_dedupe_1 = require("./ncu-dedupe");
async function _handleNcuArgv(argv, runtimeInput, isWorkspace) {
    const runtime = (0, runtime_1._handleRuntime)(argv, runtimeInput);
    const { console, consoleDebug, printRootData, cwd, rootData, pkg_file, pkg_data, resolutions, pkg_file_ws, pkg_data_ws, doWorkspace, } = runtime;
    if (argv.resolutions) {
        return (0, ncu_resolutions_1._handleNcuResolutions)(argv, runtime);
    }
    printRootData(rootData, argv);
    const pkgNcu = await (0, ncu_1.npmCheckUpdates)({
        cwd,
        rootData,
        // @ts-ignore
    }, {
        ...argv,
        json_old: pkg_data,
    });
    if (pkgNcu.json_changed && argv.upgrade) {
        (0, write_package_json_1.writePackageJSONSync)(pkg_file, pkgNcu.json_new);
        consoleDebug.info(`package.json updated`);
    }
    if (argv.dedupe && resolutions && Object.keys(resolutions).length) {
        if (await (0, ncu_dedupe_1._handleDedupe)(argv, runtime, pkgNcu)) {
            return;
        }
    }
    !isWorkspace && await (0, ncu_yarnlock_1._handleNcuYarnLock)(argv, runtime);
}
//# sourceMappingURL=ncu-main.js.map