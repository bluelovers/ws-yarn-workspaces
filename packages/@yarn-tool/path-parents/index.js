"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathUpToWorkspaces = exports.pathUpToWorkspacesGenerator = void 0;
const tslib_1 = require("tslib");
const path_parents_1 = require("path-parents");
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const path_is_same_1 = (0, tslib_1.__importDefault)(require("path-is-same"));
function* pathUpToWorkspacesGenerator(cwd, options) {
    cwd = (0, upath2_1.resolve)(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
    if (!(options === null || options === void 0 ? void 0 : options.ignoreCurrentDirectory)) {
        yield cwd;
    }
    let { root, isWorkspace, hasWorkspace, } = (0, find_root_1.findRoot)({
        cwd,
    });
    if (hasWorkspace && !isWorkspace) {
        for (let current of (0, path_parents_1.pathParentsGenerator)(cwd)) {
            if (current === null || current === void 0 ? void 0 : current.length) {
                yield current;
                if ((0, path_is_same_1.default)(current, root)) {
                    break;
                }
            }
        }
    }
}
exports.pathUpToWorkspacesGenerator = pathUpToWorkspacesGenerator;
function pathUpToWorkspaces(cwd) {
    return [...pathUpToWorkspacesGenerator(cwd)];
}
exports.pathUpToWorkspaces = pathUpToWorkspaces;
exports.default = pathUpToWorkspaces;
//# sourceMappingURL=index.js.map