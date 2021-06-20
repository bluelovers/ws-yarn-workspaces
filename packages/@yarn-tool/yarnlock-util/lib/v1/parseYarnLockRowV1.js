"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV1 = void 0;
const const_1 = require("../const");
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const getSemverFromNpaResult_1 = require("@yarn-tool/npm-package-arg-util/lib/getSemverFromNpaResult");
function parseYarnLockRowV1(packageName, packageData) {
    var _a, _b, _c;
    let parsed = npm_package_arg_util_1.npaTry(packageName);
    const name = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.name) !== null && _a !== void 0 ? _a : (_c = (_b = const_1.PACKAGE_REGEX.exec(packageName)) === null || _b === void 0 ? void 0 : _b.groups) === null || _c === void 0 ? void 0 : _c.packageName;
    if (name === null || name === void 0 ? void 0 : name.length) {
        let semver = getSemverFromNpaResult_1.getSemverFromNpaResult(parsed);
        return {
            name,
            version: packageData.version,
            type: parsed.type,
            raw: parsed.raw,
            semver,
        };
    }
}
exports.parseYarnLockRowV1 = parseYarnLockRowV1;
//# sourceMappingURL=parseYarnLockRowV1.js.map