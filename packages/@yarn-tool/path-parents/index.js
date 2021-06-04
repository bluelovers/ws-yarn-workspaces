"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathUpToWorkspaces = exports.pathUpToWorkspacesGenerator = void 0;
const path_parents_1 = require("path-parents");
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const path_is_same_1 = __importDefault(require("path-is-same"));
function* pathUpToWorkspacesGenerator(cwd, options) {
    cwd = upath2_1.resolve(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
    if (!(options === null || options === void 0 ? void 0 : options.ignoreCurrentDirectory)) {
        yield cwd;
    }
    let { root, isWorkspace, hasWorkspace, } = find_root_1.findRoot({
        cwd,
    });
    if (hasWorkspace && !isWorkspace) {
        for (let current of path_parents_1.pathParentsGenerator(cwd)) {
            if (current === null || current === void 0 ? void 0 : current.length) {
                yield current;
                if (path_is_same_1.default(current, root)) {
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