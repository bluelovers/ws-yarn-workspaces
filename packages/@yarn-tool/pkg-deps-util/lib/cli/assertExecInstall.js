"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertExecInstall = void 0;
const err_code_1 = __importDefault(require("err-code"));
function assertExecInstall(cp) {
    if (cp.status) {
        throw err_code_1.default(new Error(`Process finished with exit code ${cp.status}`), 'EXIT_CODE', {
            status: cp.status,
            cp,
        });
    }
    return cp;
}
exports.assertExecInstall = assertExecInstall;
//# sourceMappingURL=assertExecInstall.js.map