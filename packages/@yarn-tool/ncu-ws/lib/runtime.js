"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleRuntime = _handleRuntime;
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const package_dts_1 = require("@ts-type/package-dts");
function _handleRuntime(argv, runtimeInput) {
    const { cwd } = argv;
    const rootData = (0, find_root_1.findRoot)({
        ...argv,
        cwd,
    }, true);
    let pkg_file = (0, upath2_1.join)(rootData.pkg, 'package.json');
    let pkg_data = (0, package_dts_1.readPackageJson)(pkg_file);
    let resolutions = pkg_data.resolutions;
    let pkg_file_ws;
    let pkg_data_ws;
    let doWorkspace = !rootData.isWorkspace && rootData.hasWorkspace;
    if (doWorkspace) {
        pkg_file_ws = (0, upath2_1.join)(rootData.ws, 'package.json');
        pkg_data_ws = (0, package_dts_1.readPackageJson)(pkg_file_ws);
        resolutions = pkg_data_ws.resolutions;
    }
    return {
        ...runtimeInput,
        cwd,
        rootData,
        pkg_file,
        pkg_data,
        resolutions,
        pkg_file_ws,
        pkg_data_ws,
        doWorkspace,
    };
}
//# sourceMappingURL=runtime.js.map