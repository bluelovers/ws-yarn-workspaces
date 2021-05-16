"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.printPackedTarballInfo = void 0;
const log_packed_1 = require("@lerna/log-packed");
function printPackedTarballInfo(tarball) {
    return log_packed_1.logPacked(tarball);
}
exports.printPackedTarballInfo = printPackedTarballInfo;
exports.default = printPackedTarballInfo;
//# sourceMappingURL=print.js.map