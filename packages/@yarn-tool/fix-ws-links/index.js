"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixYarnWorkspaceLinks = void 0;
const listable_1 = require("ws-pkg-list/lib/listable");
const ws_find_paths_1 = require("@yarn-tool/node-modules/lib/ws-find-paths");
const core_1 = __importDefault(require("yarn-list-link/core"));
const fs_extra_1 = require("fs-extra");
const cross_spawn_extra_1 = __importDefault(require("cross-spawn-extra"));
const fs_1 = require("fs");
const util_1 = require("./lib/util");
function fixYarnWorkspaceLinks(cwd, options) {
    let listable = listable_1.wsPkgListable(cwd);
    let links = core_1.default(cwd) || [];
    let pkgs = listable
        .reduce((a, b) => {
        a[b.name] = b;
        return a;
    }, {});
    let sublist = ws_find_paths_1.wsFindPackageHasModulesCore(listable, options === null || options === void 0 ? void 0 : options.dir);
    let verbose = options === null || options === void 0 ? void 0 : options.verbose;
    if (sublist.length) {
        sublist
            .forEach(data => {
            let _error;
            verbose && console.debug(`check`, data.name, `=>`, data.location);
            let add_links = [];
            data.modules.forEach(row => {
                var _a;
                let name = row.name;
                let location = (_a = pkgs[name]) === null || _a === void 0 ? void 0 : _a.location;
                let is_same = util_1.sameRealpath(location, row.location);
                if (location && is_same === false && !util_1.isSymbolicLink(row.location)) {
                    console.log(`create link`, row.name, `=>`, location);
                    try {
                        fs_1.unlinkSync(row.location);
                        fs_extra_1.linkSync(location, row.location);
                    }
                    catch (e) {
                        verbose && console.error(e.toString());
                        _error = true;
                        if (links.includes(name)) {
                            add_links.push(name);
                        }
                    }
                }
                else if (links.includes(name)) {
                    add_links.push(name);
                }
                else if (typeof is_same === 'undefined') {
                    _error = true;
                }
            });
            if (add_links.length) {
                cross_spawn_extra_1.default.sync('yarn', [
                    `link`,
                    ...add_links,
                ], {
                    cwd: data.location,
                    stdio: 'inherit',
                });
            }
            if (_error) {
                verbose && console.debug(`try use fallback`);
                cross_spawn_extra_1.default.sync('yarn', [], {
                    cwd: data.location,
                    stdio: 'inherit',
                });
            }
        });
    }
    else {
        verbose && console.debug(`no exists sub package has modules with sub install`);
    }
}
exports.fixYarnWorkspaceLinks = fixYarnWorkspaceLinks;
exports.default = fixYarnWorkspaceLinks;
//# sourceMappingURL=index.js.map