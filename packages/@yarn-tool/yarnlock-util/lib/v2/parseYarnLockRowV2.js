"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV2 = void 0;
const parsers_1 = require("@yarnpkg/parsers");
function parseYarnLockRowV2(packageName, packageData) {
    var _a, _b;
    let ret = parsers_1.parseResolution(packageData.resolution);
    let name = (_a = ret === null || ret === void 0 ? void 0 : ret.descriptor) === null || _a === void 0 ? void 0 : _a.fullName;
    let version = (_b = ret === null || ret === void 0 ? void 0 : ret.descriptor) === null || _b === void 0 ? void 0 : _b.description;
    if (name) {
        version = version.replace(/^(npm):/, '');
        if (!version.length) {
            version = ret.descriptor.description;
        }
        return {
            name,
            version,
        };
    }
}
exports.parseYarnLockRowV2 = parseYarnLockRowV2;
//# sourceMappingURL=parseYarnLockRowV2.js.map