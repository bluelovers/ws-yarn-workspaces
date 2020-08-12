"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV2 = void 0;
const parsers_1 = require("@yarnpkg/parsers");
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
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
        let parsed = npm_package_arg_1.default(`${name}@${version}`);
        return {
            name,
            version,
            type: parsed.type,
            raw: parsed.raw,
            semver: parsed.rawSpec,
        };
    }
}
exports.parseYarnLockRowV2 = parseYarnLockRowV2;
//# sourceMappingURL=parseYarnLockRowV2.js.map