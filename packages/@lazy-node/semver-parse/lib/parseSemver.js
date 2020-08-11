"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSemver = void 0;
const const_1 = require("./const");
const SimpleSemVer_1 = require("./SimpleSemVer");
function parseSemver(version) {
    // semver, major, minor, patch
    // https://github.com/mojombo/semver/issues/32
    // https://github.com/isaacs/node-semver/issues/10
    // optional v
    const m = const_1.reSemver.exec(version);
    let ver;
    if ((m === null || m === void 0 ? void 0 : m.length) > 0) {
        ver = new SimpleSemVer_1.SimpleSemVer({
            semver: m[0],
            version: m[1],
            major: m[2],
            minor: m[3],
            patch: m[4],
            release: m[5],
            build: m[6],
        });
    }
    return ver;
}
exports.parseSemver = parseSemver;
exports.default = parseSemver;
//# sourceMappingURL=parseSemver.js.map