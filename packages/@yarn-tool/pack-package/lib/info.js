"use strict";
/**
 * Created by user on 2020/4/9.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackedTarballInfo = void 0;
const get_packed_1 = __importDefault(require("@lerna/get-packed"));
async function getPackedTarballInfo(options) {
    return get_packed_1.default(options.pkg, options.packageTarball);
}
exports.getPackedTarballInfo = getPackedTarballInfo;
exports.default = getPackedTarballInfo;
//# sourceMappingURL=info.js.map