"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmAutoFixAll = void 0;
const tslib_1 = require("tslib");
const find_root_1 = require("@yarn-tool/find-root");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
const index_1 = require("./lib/root/index");
const index_2 = require("./lib/pkg/index");
const logger_1 = require("debug-color2/logger");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const static_file_1 = require("@yarn-tool/static-file");
const wsCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/ws/wsCopyStaticFiles");
const getRootCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/root/getRootCopyStaticFiles");
const lerna_1 = require("./lib/ws/lerna");
const reset_1 = require("./lib/file/reset");
function npmAutoFixAll(cwd, options) {
    return bluebird_1.default.resolve().then(async () => {
        cwd !== null && cwd !== void 0 ? cwd : (cwd = process.cwd());
        logger_1.consoleLogger.info(`cwd: ${cwd}`);
        let rootData = (0, find_root_1.findRootLazy)({
            cwd,
        });
        if (!(rootData === null || rootData === void 0 ? void 0 : rootData.root)) {
            throw new Error(`Invalid workspaces / package: ${cwd}`);
        }
        if (rootData.hasWorkspace && !rootData.isWorkspace) {
            rootData = (0, find_root_1.findRoot)({
                cwd: rootData.root,
            });
        }
        console.log(`root:`, rootData.root);
        console.log(`hasWorkspace:`, rootData.hasWorkspace);
        let { branch, overwriteHostedGitInfo, resetStaticFiles } = options !== null && options !== void 0 ? options : {};
        cwd = rootData.cwd;
        if (resetStaticFiles) {
            (0, reset_1._resetStaticFiles)(rootData.root, {
                rootData,
            });
        }
        if (rootData.hasWorkspace) {
            const file_map = (0, wsCopyStaticFiles_1.getWsCopyStaticFiles)();
            (0, static_file_1.copyStaticFiles)({
                cwd: rootData.ws,
                file_map,
            });
        }
        else if (rootData.root) {
            const file_map = (0, getRootCopyStaticFiles_1.getRootCopyStaticFilesAuto)({
                ...rootData,
                isRoot: true,
            });
            (0, static_file_1.copyStaticFiles)({
                cwd: rootData.root,
                file_map,
            });
        }
        logger_1.consoleLogger.info(`check git info`);
        const hostedGitInfo = (0, pkg_git_info_1.npmHostedGitInfoLazy)(cwd);
        console.log(`homepage:`, hostedGitInfo.homepage);
        console.log(`repository:`, hostedGitInfo.repository);
        logger_1.consoleLogger.info(`auto fix root of workspaces / package`);
        console.log(`root:`, rootData.root);
        if (rootData.hasWorkspace) {
            (0, index_1._fixWsRoot)({
                rootData,
                hostedGitInfo,
                branch,
                overwriteHostedGitInfo,
            });
        }
        else {
            (0, index_1._fixRoot)({
                rootData,
                hostedGitInfo,
                branch,
                overwriteHostedGitInfo,
                targetDir: rootData.root,
            });
        }
        (0, lerna_1._fixLernaJson)({
            rootData,
        });
        const list = (0, index_2._initPkgListableByRootData)(rootData);
        return (0, index_2._runEachPackagesAsync)(list, {
            rootData,
            overwriteHostedGitInfo,
            branch,
            hostedGitInfo,
            resetStaticFiles,
        });
    }).then(() => void 0);
}
exports.npmAutoFixAll = npmAutoFixAll;
exports.default = npmAutoFixAll;
//# sourceMappingURL=index.js.map