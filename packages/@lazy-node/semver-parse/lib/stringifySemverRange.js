"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySemverRange = void 0;
const isSimpleSemVerOperatorLike_1 = require("./isSimpleSemVerOperatorLike");
const SimpleSemVer_1 = require("./SimpleSemVer");
const stringifySemver_1 = require("./stringifySemver");
function stringifySemverRange(arr) {
    return arr.reduce((a, ver) => {
        let bool = true;
        if (isSimpleSemVerOperatorLike_1.hasOperator(ver)) {
            a.push(ver.operator);
            bool = false;
        }
        if (isSimpleSemVerOperatorLike_1.isSimpleSemVerObjectLike(ver)) {
            if (ver instanceof SimpleSemVer_1.SimpleSemVer) {
                a.push(ver.toString());
            }
            else {
                a.push(stringifySemver_1.stringifySemver(ver));
            }
            bool = false;
        }
        else if (bool === true) {
            throw new TypeError(`obj not a ISimpleSemVerLike`);
        }
        return a;
    }, []).join(' ');
}
exports.stringifySemverRange = stringifySemverRange;
//# sourceMappingURL=stringifySemverRange.js.map