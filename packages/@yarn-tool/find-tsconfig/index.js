"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTsconfig = void 0;
const tsconfig_1 = require("tsconfig");
const find_root_1 = require("@yarn-tool/find-root");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * find tsconfig and only allow inside current pkg/ws path
 *
 * @param {string} cwd
 * @returns {string}
 */
function findTsconfig(cwd) {
    let rooData = find_root_1.findRoot({
        cwd,
    });
    let file = tsconfig_1.findSync(cwd);
    if (!file) {
        file = tsconfig_1.findSync(fs_1.realpathSync(cwd));
    }
    if (file) {
        file = path_1.normalize(file);
        if (file.includes(path_1.normalize(rooData.pkg)) || rooData.hasWorkspace && !rooData.isWorkspace && file.includes(path_1.normalize(rooData.ws))) {
            return file;
        }
    }
}
exports.findTsconfig = findTsconfig;
exports.default = findTsconfig;
//# sourceMappingURL=index.js.map