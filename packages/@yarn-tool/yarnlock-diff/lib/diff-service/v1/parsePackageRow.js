"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePackageRow = void 0;
const const_1 = require("./const");
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
function parsePackageRow(packageName, packageData) {
    var _a, _b, _c;
    let parsed;
    try {
        parsed = npm_package_arg_1.default(packageName);
    }
    catch (e) { }
    const packageNameWithoutVersion = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.name) !== null && _a !== void 0 ? _a : (_c = (_b = const_1.PACKAGE_REGEX.exec(packageName)) === null || _b === void 0 ? void 0 : _b.groups) === null || _c === void 0 ? void 0 : _c.packageName;
    if (packageNameWithoutVersion) {
        return {
            name: packageNameWithoutVersion,
            version: packageData.version,
        };
    }
}
exports.parsePackageRow = parsePackageRow;
//# sourceMappingURL=parsePackageRow.js.map