"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFile = fromFile;
exports.fromFileAsync = fromFileAsync;
const fs_1 = require("fs");
const fromContent_1 = require("./fromContent");
function fromFile(yarnlock_file) {
    return (0, fromContent_1.fromContent)((0, fs_1.readFileSync)(yarnlock_file));
}
async function fromFileAsync(yarnlock_file) {
    return fromFile(yarnlock_file);
}
//# sourceMappingURL=fromFile.js.map