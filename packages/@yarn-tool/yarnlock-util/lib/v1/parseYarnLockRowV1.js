"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV1 = void 0;
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
const const_1 = require("../const");
function parseYarnLockRowV1(packageName, packageData) {
    var _a, _b, _c;
    let parsed;
    try {
        parsed = npm_package_arg_1.default(packageName);
    }
    catch (e) { }
    const name = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.name) !== null && _a !== void 0 ? _a : (_c = (_b = const_1.PACKAGE_REGEX.exec(packageName)) === null || _b === void 0 ? void 0 : _b.groups) === null || _c === void 0 ? void 0 : _c.packageName;
    if (name === null || name === void 0 ? void 0 : name.length) {
        return {
            name,
            version: packageData.version,
        };
    }
}
exports.parseYarnLockRowV1 = parseYarnLockRowV1;
//# sourceMappingURL=parseYarnLockRowV1.js.map