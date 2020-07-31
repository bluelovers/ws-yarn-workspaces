"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePackageRow = void 0;
const const_1 = require("./const");
function parsePackageRow(packageName, packageData) {
    var _a;
    const regexResult = const_1.PACKAGE_REGEX.exec(packageName);
    const packageNameWithoutVersion = (_a = regexResult === null || regexResult === void 0 ? void 0 : regexResult.groups) === null || _a === void 0 ? void 0 : _a.packageName;
    if (packageNameWithoutVersion) {
        return {
            name: packageNameWithoutVersion,
            version: packageData.version,
        };
    }
}
exports.parsePackageRow = parsePackageRow;
//# sourceMappingURL=parsePackageRow.js.map