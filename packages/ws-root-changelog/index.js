"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkspacesRootChangelog = exports.outputWorkspacesRootChangelogAsync = exports.outputWorkspacesRootChangelog = exports.getWorkspacesRootChangelogPath = exports._findWorkspacesRootPath = exports.listChangelog = void 0;
const listable_1 = require("ws-pkg-list/lib/listable");
const util_1 = require("ws-pkg-list/lib/util");
const find_root_1 = require("@yarn-tool/find-root");
const fs_1 = require("fs");
const upath2_1 = require("upath2");
function listChangelog(cwd) {
    const list = [];
    (0, listable_1.wsPkgListable)(cwd, {
        handler(row) {
            return (0, util_1.normalizeListableRowExtra)(row, cwd);
        },
    })
        .forEach((row) => {
        row = (0, util_1.normalizeListableRowExtra)(row, cwd);
        const icon = row.private ? `🔒` : `🌏`;
        list.push(`* ${icon} [\`${row.name}\`](./${row.prefix}/CHANGELOG.md "${row.prefix}") *${row.prefix}*`);
    });
    if (!list.length) {
        throw new RangeError(`can't found any packages in current workspace: ${cwd}`);
    }
    return list;
}
exports.listChangelog = listChangelog;
function _findWorkspacesRootPath(cwd) {
    return (0, find_root_1.findRootLazy)({
        cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
        throwError: true,
        shouldHasWorkspaces: true,
    }).ws;
}
exports._findWorkspacesRootPath = _findWorkspacesRootPath;
function getWorkspacesRootChangelogPath(cwd, filename) {
    cwd = _findWorkspacesRootPath(cwd);
    filename !== null && filename !== void 0 ? filename : (filename = `./CHANGELOG.md`);
    return (0, upath2_1.resolve)(cwd, filename);
}
exports.getWorkspacesRootChangelogPath = getWorkspacesRootChangelogPath;
function outputWorkspacesRootChangelog(cwd, filename) {
    cwd = _findWorkspacesRootPath(cwd);
    const md = createWorkspacesRootChangelog(cwd);
    const file = getWorkspacesRootChangelogPath(cwd, filename);
    (0, fs_1.writeFileSync)(file, md);
    return {
        file,
        md,
    };
}
exports.outputWorkspacesRootChangelog = outputWorkspacesRootChangelog;
async function outputWorkspacesRootChangelogAsync(cwd, filename) {
    cwd = _findWorkspacesRootPath(cwd);
    const md = createWorkspacesRootChangelog(cwd);
    const file = getWorkspacesRootChangelogPath(cwd, filename);
    await fs_1.promises.writeFile(file, md);
    return {
        file,
        md,
    };
}
exports.outputWorkspacesRootChangelogAsync = outputWorkspacesRootChangelogAsync;
function createWorkspacesRootChangelog(cwd) {
    const list = [];
    list.push('# Change Log');
    list.push('');
    list.push('Please see the individual package changelogs for what\'s new:');
    list.push('');
    cwd = _findWorkspacesRootPath(cwd);
    list.push(...listChangelog(cwd));
    list.push('');
    list.push('');
    return list.join('\n');
}
exports.createWorkspacesRootChangelog = createWorkspacesRootChangelog;
exports.default = createWorkspacesRootChangelog;
//# sourceMappingURL=index.js.map