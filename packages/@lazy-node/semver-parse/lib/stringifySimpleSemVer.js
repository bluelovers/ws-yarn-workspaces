"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySemverFull = exports.stringifySimpleSemVer = void 0;
const checker_1 = require("./checker");
function stringifySimpleSemVer(obj) {
    var _a, _b, _c, _d, _e;
    (0, checker_1.assertSimpleSemVerObjectLike)(obj);
    let str = '';
    str += (_a = obj.major) !== null && _a !== void 0 ? _a : '0';
    str += '.';
    str += (_b = obj.minor) !== null && _b !== void 0 ? _b : '0';
    str += '.';
    str += (_c = obj.patch) !== null && _c !== void 0 ? _c : '0';
    if (((_d = obj.release) === null || _d === void 0 ? void 0 : _d.length) > 0) {
        str += "-" /* EnumVersionExtra.release */ + obj.release;
    }
    if (((_e = obj.build) === null || _e === void 0 ? void 0 : _e.length) > 0) {
        str += "+" /* EnumVersionExtra.build */ + obj.build;
    }
    return str;
}
exports.stringifySimpleSemVer = stringifySimpleSemVer;
function stringifySemverFull(obj) {
    var _a;
    return ((_a = obj.operator) !== null && _a !== void 0 ? _a : '') + stringifySimpleSemVer(obj);
}
exports.stringifySemverFull = stringifySemverFull;
exports.default = stringifySimpleSemVer;
//# sourceMappingURL=stringifySimpleSemVer.js.map