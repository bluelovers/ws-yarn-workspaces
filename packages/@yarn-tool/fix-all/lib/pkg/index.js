"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._initPkgListableByRootData = exports._runEachPackagesAsync = exports._handler = void 0;
const tslib_1 = require("tslib");
const ws_pkg_list_1 = require("ws-pkg-list");
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
function _handler(cwd, ...argv) {
    return {
        ...(0, ws_pkg_list_1.normalizeListableRowExtra)(argv[0], cwd),
        pkg: argv[1],
    };
}
exports._handler = _handler;
function _runEachPackagesAsync(list, options) {
    const { rootData, overwriteHostedGitInfo, hostedGitInfo, branch, } = options;
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
            const pkg = new npm_package_json_loader_1.PackageJsonLoader(row.manifestLocation);
            try {
                (0, pkg_entry_util_1.pkgExportsVerify)(pkg.data);
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
            pkg.data = (0, sort_package_json3_1.sortPackageJson)(pkg.data);
            pkg.autofix();
            pkg.write();
        })().catch(e => err.push(e)), row.name);
        return promiseLogger
            .catch(e => err.push(e))
            .then(() => {
            if (err.length) {
                debug_color2_1.console.error(err.toString());
            }
        });
    });
}
exports._runEachPackagesAsync = _runEachPackagesAsync;
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
exports._initPkgListableByRootData = _initPkgListableByRootData;
//# sourceMappingURL=index.js.map