"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWorkspaceRoot = findWorkspaceRoot;
exports.checkWorkspaces = checkWorkspaces;
exports.isMatchWorkspaces = isMatchWorkspaces;
exports.extractWorkspaces = extractWorkspaces;
exports.readPackageJSON = readPackageJSON;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const pkg_dir_1 = tslib_1.__importDefault(require("pkg-dir"));
const fs_1 = require("fs");
const micromatch_1 = tslib_1.__importDefault(require("micromatch"));
/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 * @param {string} [initial]
 * @return {string|null}
 */
function findWorkspaceRoot(initial) {
    if (!initial) {
        initial = process.cwd();
    }
    let _pkg = pkg_dir_1.default.sync(initial);
    if (!_pkg) {
        return null;
    }
    initial = (0, upath2_1.normalize)(_pkg);
    let previous = null;
    let current = initial;
    do {
        const manifest = readPackageJSON(current);
        const workspaces = extractWorkspaces(manifest);
        let { done, found } = checkWorkspaces(current, initial);
        if (done) {
            return found;
        }
        previous = current;
        current = (0, upath2_1.dirname)(current);
    } while (current !== previous);
    return null;
}
function checkWorkspaces(current, initial) {
    const manifest = readPackageJSON(current);
    const workspaces = extractWorkspaces(manifest);
    let done = false;
    let found;
    let relativePath;
    if (workspaces) {
        done = true;
        relativePath = (0, upath2_1.relative)(current, initial);
        if (relativePath === '' || isMatchWorkspaces(relativePath, workspaces)) {
            found = current;
        }
        else {
            found = null;
        }
    }
    return {
        done,
        found,
        relativePath,
    };
}
function isMatchWorkspaces(relativePath, workspaces) {
    let ls = (0, micromatch_1.default)([relativePath], workspaces);
    return ls.length > 0;
}
function extractWorkspaces(manifest) {
    const workspaces = (manifest || {}).workspaces;
    return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
}
function readPackageJSON(dir) {
    const file = (0, upath2_1.join)(dir, 'package.json');
    if ((0, fs_1.existsSync)(file)) {
        return JSON.parse((0, fs_1.readFileSync)(file, 'utf8'));
    }
    return null;
}
findWorkspaceRoot.findWorkspaceRoot = findWorkspaceRoot;
findWorkspaceRoot.readPackageJSON = readPackageJSON;
findWorkspaceRoot.extractWorkspaces = extractWorkspaces;
findWorkspaceRoot.isMatchWorkspaces = isMatchWorkspaces;
findWorkspaceRoot.default = findWorkspaceRoot;
exports.default = findWorkspaceRoot;
//# sourceMappingURL=core.js.map