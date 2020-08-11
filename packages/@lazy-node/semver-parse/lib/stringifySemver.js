"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySemver = void 0;
function stringifySemver(obj) {
    var _a, _b, _c, _d, _e;
    let str = '';
    str += (_a = obj.major) !== null && _a !== void 0 ? _a : '0';
    str += '.';
    str += (_b = obj.minor) !== null && _b !== void 0 ? _b : '0';
    str += '.';
    str += (_c = obj.patch) !== null && _c !== void 0 ? _c : '0';
    if (((_d = obj.release) === null || _d === void 0 ? void 0 : _d.length) > 0) {
        str += '-' + obj.release;
    }
    if (((_e = obj.build) === null || _e === void 0 ? void 0 : _e.length) > 0) {
        str += '+' + obj.build;
    }
    return str;
}
exports.stringifySemver = stringifySemver;
//# sourceMappingURL=stringifySemver.js.map