"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
exports.pathParentsWorkspaces = pathParentsWorkspaces;
exports.findUpPathsWorkspaces = findUpPathsWorkspaces;
exports.findUpPathsWorkspacesAsync = findUpPathsWorkspacesAsync;
const find_up_paths_1 = require("find-up-paths");
const find_root_1 = require("@yarn-tool/find-root");
const path_parents_1 = require("path-parents");
function handleOptions(cwd, opts) {
    const runtime = (0, find_up_paths_1.handleOptions)(cwd, opts);
    runtime.rootData = (0, find_root_1.findRoot)({
        cwd: runtime.cwd,
        throwError: true,
    });
    runtime.stopPath.push(runtime.rootData.root);
    if (runtime.opts.ignoreCurrentPackage && !runtime.rootData.isWorkspace) {
        runtime.cwd = runtime.rootData.pkg;
        runtime.opts.includeCurrentDirectory = false;
    }
    else if (runtime.opts.startFromCurrentPackage) {
        runtime.cwd = runtime.rootData.pkg;
    }
    return runtime;
}
function pathParentsWorkspaces(cwd, opts) {
    const runtime = handleOptions(cwd, opts);
    return [...(0, path_parents_1.pathParentsGeneratorRuntime)(runtime)];
}
function findUpPathsWorkspaces(pattern, opts) {
    const runtime = handleOptions(opts);
    return (0, find_up_paths_1.findUpPathsRuntime)(pattern, runtime);
}
function findUpPathsWorkspacesAsync(pattern, opts) {
    const runtime = handleOptions(opts);
    return (0, find_up_paths_1.findUpPathsRuntimeAsync)(pattern, runtime);
}
exports.default = findUpPathsWorkspaces;
//# sourceMappingURL=index.js.map