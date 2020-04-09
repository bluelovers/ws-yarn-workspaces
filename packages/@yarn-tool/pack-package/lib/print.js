"use strict";
/**
 * Created by user on 2020/4/9.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printPackedTarballInfo = void 0;
const log_packed_1 = __importDefault(require("@lerna/log-packed"));
function printPackedTarballInfo(tarball) {
    return log_packed_1.default(tarball);
}
exports.printPackedTarballInfo = printPackedTarballInfo;
exports.default = printPackedTarballInfo;
//# sourceMappingURL=print.js.map