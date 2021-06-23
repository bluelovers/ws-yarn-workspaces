"use strict";
/**
 * Created by user on 2020/6/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowUpdateVersion = exports.keyObjectToPackageMap = exports.isBadVersion = void 0;
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
const util_1 = require("util");
function isBadVersion(version) {
    let bool = false;
    switch (version) {
        case types_1.EnumVersionValue.minor:
        case types_1.EnumVersionValue.major:
        case types_1.EnumVersionValue.newest:
        case types_1.EnumVersionValue.latest:
        case types_1.EnumVersionValue.greatest:
        case "*" /* any */:
            bool = true;
            break;
        default:
            if (version == null) {
                bool = true;
            }
            break;
    }
    return bool;
}
exports.isBadVersion = isBadVersion;
function keyObjectToPackageMap(obj, useVarsionNew) {
    // @ts-ignore
    return obj.reduce(function (a, data) {
        if (useVarsionNew) {
            if (typeof data.version_new !== 'string') {
                return a;
                throw new TypeError(`not a IVersionCacheMapValue object, ${(0, util_1.inspect)(data)}`);
            }
            a[data.name] = data.version_new;
        }
        else {
            a[data.name] = data.version_old;
        }
        return a;
        // @ts-ignore
    }, {});
}
exports.keyObjectToPackageMap = keyObjectToPackageMap;
function allowUpdateVersion(version) {
    return (version === null || version === void 0 ? void 0 : version.length) && version !== "*" /* any */ && version !== types_1.EnumVersionValue.latest && !/^\s*(?:[><])|&|=|\|/.test(version);
}
exports.allowUpdateVersion = allowUpdateVersion;
//# sourceMappingURL=util.js.map