"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixYarnWorkspaceLinks = void 0;
const tslib_1 = require("tslib");
const listable_1 = require("ws-pkg-list/lib/listable");
const ws_find_paths_1 = require("@yarn-tool/node-modules/lib/ws-find-paths");
const core_1 = require("yarn-list-link/core");
const fs_extra_1 = require("fs-extra");
const cross_spawn_extra_1 = (0, tslib_1.__importDefault)(require("cross-spawn-extra"));
const util_1 = require("./lib/util");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const fs_symlink_extra_1 = require("fs-symlink-extra");
function fixYarnWorkspaceLinks(cwd, options) {
    let listable = (0, listable_1.wsPkgListable)(cwd);
    let links = (0, core_1.yarnListLink)(cwd) || [];
    let pkgs = listable
        .reduce((a, b) => {
        a[b.name] = b;
        return a;
    }, {});
    options = options || {};
    let sublist = (0, ws_find_paths_1.wsFindPackageHasModulesCore)(listable, options.dir);
    let verbose = options.verbose;
    verbose && logger_1.default.debug('[linkedModules]', links);
    if (sublist.length) {
        sublist
            .forEach(data => {
            let _error;
            verbose && logger_1.default.debug(`check`, data.name, `=>`, data.location);
            let add_links = [];
            data.modules.forEach(row => {
                var _a;
                let name = row.name;
                let location = (_a = pkgs[name]) === null || _a === void 0 ? void 0 : _a.location;
                let is_same = (0, util_1.sameRealpath)(location, row.location);
                if (!(0, fs_extra_1.pathExistsSync)(row.location)) {
                    return;
                }
                let is_symlink = (0, util_1.isSymbolicLink)(row.location);
                if (location && is_same === false && !is_symlink) {
                    if (links.includes(name)) {
                        add_links.push(name);
                    }
                    else {
                        try {
                            (0, fs_symlink_extra_1.fsSymlinkSync)(location, row.location, {
                                overwrite: true,
                            });
                            logger_1.default.success(`create link`, row.name, `=>`, location);
                        }
                        catch (e) {
                            verbose && logger_1.default.error(e.toString());
                            _error = true;
                            if (links.includes(name)) {
                                add_links.push(name);
                            }
                        }
                    }
                }
                else if (!is_symlink && links.includes(name)) {
                    add_links.push(name);
                }
                else if (typeof is_same === 'undefined') {
                    _error = true;
                }
            });
            if (add_links.length) {
                verbose && logger_1.default.debug('link', [
                    ...add_links,
                ]);
                cross_spawn_extra_1.default.sync('yarn', [
                    `link`,
                    ...add_links,
                ], {
                    cwd: data.location,
                    stdio: 'inherit',
                });
            }
            if (_error || options.runYarnAfter) {
                verbose && logger_1.default.debug(`try use yarn install for fallback`);
                cross_spawn_extra_1.default.sync('yarn', [], {
                    cwd: data.location,
                    stdio: 'inherit',
                });
            }
        });
    }
    else {
        verbose && logger_1.default.debug(`no exists sub package has modules with sub install`);
    }
}
exports.fixYarnWorkspaceLinks = fixYarnWorkspaceLinks;
exports.default = fixYarnWorkspaceLinks;
//# sourceMappingURL=index.js.map