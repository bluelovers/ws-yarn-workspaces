"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySimpleSemVerRange = void 0;
const checker_1 = require("./checker");
const SimpleSemVer_1 = require("./SimpleSemVer");
const stringifySimpleSemVer_1 = require("./stringifySimpleSemVer");
function stringifySimpleSemVerRange(arr) {
    return arr.reduce((a, ver) => {
        if ((0, checker_1.isSimpleSemVerOperatorLike)(ver)) {
            a.push(ver.operator);
        }
        else if ((0, checker_1.isSimpleSemVerObjectLike)(ver)) {
            let str;
            if (ver instanceof SimpleSemVer_1.SimpleSemVer) {
                str = ver.toFullString();
            }
            else {
                str = (0, stringifySimpleSemVer_1.stringifySemverFull)(ver);
            }
            a.push(str);
        }
        else {
            throw new TypeError(`obj not a ISimpleSemVerLike`);
        }
        return a;
    }, []).join(' ');
}
exports.stringifySimpleSemVerRange = stringifySimpleSemVerRange;
exports.default = stringifySimpleSemVerRange;
//# sourceMappingURL=stringifySimpleSemVerRange.js.map