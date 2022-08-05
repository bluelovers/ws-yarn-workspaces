"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFileAsync = exports.fromFile = void 0;
const fs_1 = require("fs");
const fromContent_1 = require("./fromContent");
function fromFile(yarnlock_file) {
    return (0, fromContent_1.fromContent)((0, fs_1.readFileSync)(yarnlock_file));
}
exports.fromFile = fromFile;
async function fromFileAsync(yarnlock_file) {
    return fromFile(yarnlock_file);
}
exports.fromFileAsync = fromFileAsync;
//# sourceMappingURL=fromFile.js.map