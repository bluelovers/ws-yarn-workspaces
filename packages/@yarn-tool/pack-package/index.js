"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.packPackage = exports.getPackedTarballInfo = exports.printPackedTarballInfo = exports.packTargetPackage = void 0;
const pack_1 = require("./lib/pack");
const info_1 = require("./lib/info");
const print_1 = require("./lib/print");
var pack_2 = require("./lib/pack");
Object.defineProperty(exports, "packTargetPackage", { enumerable: true, get: function () { return pack_2.packTargetPackage; } });
var print_2 = require("./lib/print");
Object.defineProperty(exports, "printPackedTarballInfo", { enumerable: true, get: function () { return print_2.printPackedTarballInfo; } });
var info_2 = require("./lib/info");
Object.defineProperty(exports, "getPackedTarballInfo", { enumerable: true, get: function () { return info_2.getPackedTarballInfo; } });
function packPackage(options) {
    return pack_1.packTargetPackage(options)
        .then(async (data) => {
        let tarball;
        const object = Object.freeze({
            ...data,
            async tarball() {
                return tarball !== null && tarball !== void 0 ? tarball : (tarball = await info_1.getPackedTarballInfo(data));
            },
            async log() {
                return print_1.printPackedTarballInfo(await object.tarball());
            },
        });
        return object;
    });
}
exports.packPackage = packPackage;
exports.default = packPackage;
//# sourceMappingURL=index.js.map