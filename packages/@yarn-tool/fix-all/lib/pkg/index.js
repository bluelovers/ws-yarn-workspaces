"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handler = _handler;
exports._runEachPackagesAsync = _runEachPackagesAsync;
exports._initPkgListableByRootData = _initPkgListableByRootData;
const tslib_1 = require("tslib");
const ws_pkg_list_1 = require("ws-pkg-list");
const find_root_1 = require("@yarn-tool/find-root");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const pkg_entry_util_1 = require("@yarn-tool/pkg-entry-util");
const lazy_aggregate_error_1 = require("lazy-aggregate-error");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const cli_progress_1 = require("../util/cli-progress");
const logger_1 = require("debug-color2/logger");
const debug_color2_1 = require("debug-color2");
const pkg_hosted_info_1 = require("@yarn-tool/pkg-hosted-info");
const sort_package_json3_1 = require("sort-package-json3");
const fix_ws_versions_1 = require("@yarn-tool/fix-ws-versions");
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
const normalize_deps_value_1 = require("@yarn-tool/normalize-deps-value");
const getRootCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/root/getRootCopyStaticFiles");
const static_file_1 = require("@yarn-tool/static-file");
const pkg_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/util/scripts/dummy");
const is_tsdx_1 = require("@yarn-tool/setup-module-env/lib/preset/tsdx/is-tsdx");
const fix_1 = require("@yarn-tool/setup-module-env/lib/preset/tsdx/fix");
const reset_1 = require("../file/reset");
function _handler(cwd, ...argv) {
    return {
        ...(0, ws_pkg_list_1.normalizeListableRowExtra)(argv[0], cwd),
        pkg: argv[1],
    };
}
function _runEachPackagesAsync(list, options) {
    const { rootData, overwriteHostedGitInfo, hostedGitInfo, branch, resetStaticFiles, } = options;
    let logger;
    let cache = {};
    return bluebird_1.default.resolve(list)
        .tap((listable) => {
        logger = (0, cli_progress_1.createProgressEstimator)(rootData.root);
        logger_1.consoleLogger.info(`auto check/fix packages`);
        cache.listable = listable;
    })
        .mapSeries(async (row) => {
        //console.dir(row);
        const err = new lazy_aggregate_error_1.AggregateErrorExtra();
        const promiseLogger = logger((async () => {
            var _a, _b;
            const _rootDataFake = (0, find_root_1.newFakeRootData)(rootData, {
                pkg: row.location,
            });
            const { isRoot, isWorkspace } = _rootDataFake;
            const pkg = new npm_package_json_loader_1.PackageJsonLoader(row.manifestLocation);
            if (resetStaticFiles) {
                (0, reset_1._resetStaticFiles)(_rootDataFake.pkg, {
                    rootData: _rootDataFake,
                });
            }
            const file_map = (0, getRootCopyStaticFiles_1.getRootCopyStaticFilesAuto)(_rootDataFake);
            (0, static_file_1.copyStaticFiles)({
                cwd: row.location,
                file_map,
            });
            try {
                (0, pkg_entry_util_1.pkgExportsVerify)(pkg.data, {
                    cwd: row.location,
                });
            }
            catch (e) {
                err.push(e);
            }
            (0, pkg_hosted_info_1.fillPkgHostedInfo)(pkg.data, {
                targetDir: row.location,
                overwriteHostedGitInfo,
                hostedGitInfo,
                branch,
            });
            if ((0, is_tsdx_1.isTsdxPackage)(pkg.data)) {
                (0, fix_1.fixTsdxPackage)(pkg.data, {
                    rootData: _rootDataFake,
                });
            }
            (0, fix_ws_versions_1.fixPkgDepsVersionsCore)(pkg.data, cache);
            types_1.packageJsonDependenciesFields
                .forEach(field => {
                var _a;
                Object.keys((_a = pkg.data[field]) !== null && _a !== void 0 ? _a : {})
                    .forEach(name => {
                    const _value = (0, normalize_deps_value_1.normalizeDepsValue)(pkg.data[field][name]);
                    pkg.data[field][name] = _value;
                });
            });
            pkg.data.scripts = {
                ...(0, pkg_scripts_1.defaultPkgScripts)(),
                ...((_a = pkg.data.scripts) !== null && _a !== void 0 ? _a : {}),
            };
            if (isRoot) {
                if (isWorkspace) {
                }
                else {
                }
            }
            else {
                if (!((_b = pkg.data.scripts['_preversion']) === null || _b === void 0 ? void 0 : _b.length) && (0, dummy_1.isDummyEchoMaybeOrEmpty)(pkg.data.scripts.preversion)) {
                    pkg.data.scripts.preversion = "yarn run test" /* EnumScriptsEntry.preversion */;
                }
            }
            pkg.data = (0, sort_package_json3_1.sortPackageJson)(pkg.data);
            pkg.autofix();
            pkg.write();
        })().catch(e => {
            e.row = row;
            err.push(e);
        }), row.name);
        return promiseLogger
            .catch(e => {
            e.row = row;
            err.push(e);
        })
            .then(() => {
            if (err.length) {
                debug_color2_1.console.error(err);
            }
        });
    });
}
function _initPkgListableByRootData(rootData) {
    let cwd = rootData.root;
    if (rootData.hasWorkspace) {
        return (0, ws_pkg_list_1.wsPkgListable)(cwd, {
            handler(...argv) {
                return _handler(cwd, ...argv);
            },
        });
    }
    return (0, ws_pkg_list_1.wsPkgListableFromPaths)([
        cwd,
    ], cwd, {
        handler(...argv) {
            return _handler(cwd, ...argv);
        },
    });
}
//# sourceMappingURL=index.js.map