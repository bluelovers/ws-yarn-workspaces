"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkOptions = _checkOptions;
exports.rebuildYarnWorkspaceLinksFromPkgListable = rebuildYarnWorkspaceLinksFromPkgListable;
exports.rebuildYarnWorkspaceLinks = rebuildYarnWorkspaceLinks;
const node_modules_link_1 = require("@yarn-tool/node-modules-link");
const find_root_1 = require("@yarn-tool/find-root");
const path_is_same_1 = require("path-is-same");
const util_1 = require("@yarn-tool/node-modules/lib/util");
const listable_1 = require("ws-pkg-list/lib/listable");
function _checkOptions(options, auto) {
    options.shouldHasWorkspaces = true;
    options.skipCheckWorkspace = false;
    options.throwError = true;
    const rootData = (0, find_root_1.findRoot)(options);
    if (auto) {
        options.cwd = rootData.ws;
    }
    if (!(0, path_is_same_1.pathIsSame)(options.cwd, rootData.ws)) {
        throw new Error(`cwd not workspace root: ${options.cwd}`);
    }
}
function rebuildYarnWorkspaceLinksFromPkgListable(listable, options) {
    let { cwd } = options;
    _checkOptions(options);
    const targetNodeModulesPath = (0, util_1.getModulesDir)(cwd, options.targetNodeModulesName);
    listable.forEach(data => {
        (0, node_modules_link_1.linkToNodeModules)({
            cwd,
            name: data.name,
            sourcePackagePath: data.location,
            targetNodeModulesPath,
            overwrite: true,
        });
    });
}
function rebuildYarnWorkspaceLinks(options) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    _checkOptions(options, true);
    const listable = (0, listable_1.wsPkgListable)(options.cwd);
    return rebuildYarnWorkspaceLinksFromPkgListable(listable, options);
}
//# sourceMappingURL=rebuildYarnWorkspaceLinks.js.map