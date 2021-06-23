"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBinPathCore = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
function findBinPathCore(options = {}) {
    let { cwd = process.cwd(), stopPath, } = options;
    if (typeof stopPath === 'string') {
        stopPath = [stopPath];
    }
    else if (!Array.isArray(stopPath)) {
        stopPath = [];
    }
    else {
        stopPath = stopPath.slice();
    }
    let bool = true;
    let current = (0, path_1.resolve)(cwd);
    let prev;
    let result = [];
    let history = [];
    stopPath = stopPath.map(v => {
        return (0, path_1.resolve)(v);
    });
    while (bool) {
        if (prev == current) {
            break;
        }
        let dir = (0, path_1.resolve)(current, './node_modules/.bin/');
        history.push(dir);
        let stat;
        try {
            stat = (0, fs_1.statSync)(dir);
            if (stat.isDirectory()) {
                result.push(dir);
            }
        }
        catch (e) {
        }
        if (stopPath.length && stopPath.includes(current)) {
            break;
        }
        prev = current;
        current = (0, path_1.resolve)(current, '..');
    }
    return {
        result,
        history,
    };
}
exports.findBinPathCore = findBinPathCore;
exports.default = findBinPathCore;
//# sourceMappingURL=core.js.map