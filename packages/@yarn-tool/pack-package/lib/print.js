"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.printPackedTarballInfo = printPackedTarballInfo;
const log_packed_1 = require("@lerna/log-packed");
function printPackedTarballInfo(tarball) {
    return (0, log_packed_1.logPacked)(tarball);
}
exports.default = printPackedTarballInfo;
//# sourceMappingURL=print.js.map