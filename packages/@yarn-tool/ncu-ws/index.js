"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleNcuArgvAuto = _handleNcuArgvAuto;
const tslib_1 = require("tslib");
const find_root_1 = require("@yarn-tool/find-root");
const ws_pkg_list_1 = require("ws-pkg-list");
const ncu_main_1 = require("./lib/ncu-main");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const debug_color2_1 = require("debug-color2");
const upath2_1 = require("upath2");
const ncu_yarnlock_1 = require("./lib/ncu-yarnlock");
function _handleNcuArgvAuto(argv, runtimeInput, isWorkspace, includeRoot) {
    const startTime = Date.now();
    return bluebird_1.default.resolve()
        .then(() => (0, find_root_1.findRoot)(argv, true))
        // @ts-ignore
        .then(async (rootData) => {
        var _a, _b, _c;
        (_a = runtimeInput.console) !== null && _a !== void 0 ? _a : (runtimeInput.console = debug_color2_1.console);
        (_b = runtimeInput.consoleDebug) !== null && _b !== void 0 ? _b : (runtimeInput.consoleDebug = debug_color2_1.console);
        if (argv.AA) {
            isWorkspace !== null && isWorkspace !== void 0 ? isWorkspace : (isWorkspace = true);
            includeRoot !== null && includeRoot !== void 0 ? includeRoot : (includeRoot = true);
        }
        if (isWorkspace && rootData.hasWorkspace) {
            if (includeRoot) {
                await (0, ncu_main_1._handleNcuArgv)({
                    ...argv,
                    cwd: rootData.root,
                }, {
                    ...runtimeInput,
                    printRootData() {
                        (0, debug_color2_1.chalkByConsole)((chalk, console) => {
                            console.info([
                                chalk.white(`Workspace:`),
                                chalk.red(rootData.root),
                            ].join(' '));
                        }, runtimeInput.consoleDebug);
                    },
                }, isWorkspace);
            }
            return bluebird_1.default.mapSeries((0, ws_pkg_list_1.wsPkgListable)(rootData.root), (row) => {
                const runtime = {
                    ...runtimeInput,
                    printRootData() {
                        (0, debug_color2_1.chalkByConsole)((chalk, console) => {
                            console.info([
                                chalk.white(`Package:`),
                                `${row.name}@${row.version}`,
                                chalk.red((0, upath2_1.relative)(rootData.root, row.location)),
                            ].join(' '));
                        }, runtimeInput.consoleDebug);
                    },
                };
                return (0, ncu_main_1._handleNcuArgv)({
                    ...argv,
                    cwd: row.location,
                }, runtime, isWorkspace);
            })
                .then(() => {
                return (0, ncu_yarnlock_1._handleNcuYarnLock)(argv, {
                    ...runtimeInput,
                    rootData,
                });
            });
        }
        (_c = runtimeInput.printRootData) !== null && _c !== void 0 ? _c : (runtimeInput.printRootData = (rootData) => {
            runtimeInput.consoleDebug.info(rootData.pkg);
        });
        return (0, ncu_main_1._handleNcuArgv)(argv, runtimeInput);
    })
        .tap(() => {
        const totalTime = Date.now() - startTime;
        const totalTimeHuman = (totalTime / 1000).toFixed(2);
        const msg = `Done in ${totalTimeHuman}s.`;
        runtimeInput.consoleDebug.gray.info(msg);
    });
}
exports.default = _handleNcuArgvAuto;
//# sourceMappingURL=index.js.map