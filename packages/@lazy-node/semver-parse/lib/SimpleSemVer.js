"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSemVer = void 0;
const stringifySemver_1 = require("./stringifySemver");
const pruned_1 = require("./util/pruned");
const checker_1 = require("./checker");
class SimpleSemVer {
    constructor(obj) {
        var _a, _b;
        if (!((_a = obj === null || obj === void 0 ? void 0 : obj.semver) === null || _a === void 0 ? void 0 : _a.length) && !((_b = obj === null || obj === void 0 ? void 0 : obj.operator) === null || _b === void 0 ? void 0 : _b.length)) {
            throw new TypeError(`obj not a SimpleSemVerLike`);
        }
        // @ts-ignore
        pruned_1.prunedSimpleSemVer(obj, this);
    }
    isValidOperator() {
        return checker_1.isSimpleSemVerOperatorLike(this);
    }
    isValidObject() {
        return checker_1.isSimpleSemVerObjectLike(this);
    }
    hasOperator() {
        return checker_1.hasOperator(this);
    }
    toJSON() {
        return pruned_1.prunedSimpleSemVer(this);
    }
    toString() {
        return stringifySemver_1.stringifySemver(this);
    }
    toFullString() {
        var _a;
        return ((_a = this.operator) !== null && _a !== void 0 ? _a : '') + this.toString();
    }
}
exports.SimpleSemVer = SimpleSemVer;
exports.default = SimpleSemVer;
//# sourceMappingURL=SimpleSemVer.js.map