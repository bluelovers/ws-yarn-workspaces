"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackedTarballInfo = void 0;
const get_packed_1 = require("@lerna/get-packed");
async function getPackedTarballInfo(options) {
    return (0, get_packed_1.getPacked)(options.pkg, options.packageTarball);
}
exports.getPackedTarballInfo = getPackedTarballInfo;
exports.default = getPackedTarballInfo;
//# sourceMappingURL=info.js.map