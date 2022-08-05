"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupYarnLockParsedEntries = void 0;
const parseYarnLockRowV1_1 = require("../v1/parseYarnLockRowV1");
const parseYarnLockRowV2_1 = require("../v2/parseYarnLockRowV2");
const reduceYarnLockParsedEntries_1 = require("./reduceYarnLockParsedEntries");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
function groupYarnLockParsedEntries(parsedOldPackage, options) {
    let fn;
    (0, yarnlock_parse_assert_1.assertYarnLockParsedIsSupported)(parsedOldPackage, (verType, parsedOldPackage) => {
        if (verType === yarnlock_types_1.EnumDetectYarnLock.v1) {
            fn = parseYarnLockRowV1_1.parseYarnLockRowV1;
        }
        else {
            fn = parseYarnLockRowV2_1.parseYarnLockRowV2;
        }
    });
    let names = options === null || options === void 0 ? void 0 : options.names;
    if ((names === null || names === void 0 ? void 0 : names.length) === 0) {
        names = void 0;
    }
    return (0, reduceYarnLockParsedEntries_1.reduceYarnLockParsedEntries)({}, parsedOldPackage, (data, [packageName, packageData]) => {
        var _a, _b;
        const result = fn(packageName, packageData);
        const { name, version } = result;
        if ((_a = names === null || names === void 0 ? void 0 : names.includes(name)) !== null && _a !== void 0 ? _a : true) {
            (_b = data[name]) !== null && _b !== void 0 ? _b : (data[name] = []);
            data[name].push([version, result]);
        }
        return data;
    });
}
exports.groupYarnLockParsedEntries = groupYarnLockParsedEntries;
//# sourceMappingURL=groupYarnLockParsedEntries.js.map