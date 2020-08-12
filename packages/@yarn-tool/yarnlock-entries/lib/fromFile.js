"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFileAsync = exports.fromFile = void 0;
const fs_1 = require("fs");
const fromContent_1 = __importDefault(require("./fromContent"));
function fromFile(yarnlock_file) {
    return fromContent_1.default(fs_1.readFileSync(yarnlock_file));
}
exports.fromFile = fromFile;
async function fromFileAsync(yarnlock_file) {
    return fromFile(yarnlock_file);
}
exports.fromFileAsync = fromFileAsync;
//# sourceMappingURL=fromFile.js.map