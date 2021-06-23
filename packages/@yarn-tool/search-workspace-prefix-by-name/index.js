"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWorkspacePrefixByName = void 0;
const tslib_1 = require("tslib");
const micromatch_1 = (0, tslib_1.__importDefault)(require("micromatch"));
function searchWorkspacePrefixByName({ inputName, workspacesConfig, }) {
    let workspacePrefix;
    if (workspacesConfig.prefix.includes("packages/*")) {
        workspacePrefix = "packages/*";
    }
    else {
        workspacePrefix = workspacesConfig.prefix[0];
    }
    if (workspacesConfig.prefix.length > 1) {
        for (let i = 0; i < workspacesConfig.prefixSub.length; i++) {
            const prefix = workspacesConfig.prefixSub[i];
            if (prefix.length && micromatch_1.default.isMatch(inputName, prefix + '/*')) {
                workspacePrefix = workspacesConfig.prefix[i];
                break;
            }
            if (prefix === '') {
                workspacePrefix = workspacesConfig.prefix[i];
            }
        }
    }
    return workspacePrefix;
}
exports.searchWorkspacePrefixByName = searchWorkspacePrefixByName;
exports.default = searchWorkspacePrefixByName;
//# sourceMappingURL=index.js.map