"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSimpleSemVer = void 0;
const const_1 = require("./const");
const SimpleSemVer_1 = require("./SimpleSemVer");
const checker_1 = require("./checker");
function parseSimpleSemVer(version) {
    // semver, major, minor, patch
    // https://github.com/mojombo/semver/issues/32
    // https://github.com/isaacs/node-semver/issues/10
    // optional v
    const m = const_1.reSemverWithRange.exec(version);
    let ver;
    if ((m === null || m === void 0 ? void 0 : m.length) > 0) {
        let [semver, operator, version, major, minor, patch, release, build] = m;
        ver = new SimpleSemVer_1.SimpleSemVer({
            operator,
            semver,
            version,
            major,
            minor,
            patch,
            release,
            build,
        });
        checker_1.assertSimpleSemVerObjectLike(ver);
    }
    return ver;
}
exports.parseSimpleSemVer = parseSimpleSemVer;
exports.default = parseSimpleSemVer;
//# sourceMappingURL=parseSimpleSemVer.js.map