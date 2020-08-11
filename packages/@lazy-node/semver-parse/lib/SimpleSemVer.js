"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSemVer = void 0;
const stringifySimpleSemVer_1 = require("./stringifySimpleSemVer");
const pruned_1 = require("./util/pruned");
const checker_1 = require("./checker");
const parseSimpleSemVer_1 = __importDefault(require("./parseSimpleSemVer"));
class SimpleSemVer {
    constructor(obj) {
        var _a, _b;
        if (!((_a = obj === null || obj === void 0 ? void 0 : obj.semver) === null || _a === void 0 ? void 0 : _a.length) && !((_b = obj === null || obj === void 0 ? void 0 : obj.operator) === null || _b === void 0 ? void 0 : _b.length)) {
            throw new TypeError(`obj not a SimpleSemVerLike`);
        }
        // @ts-ignore
        pruned_1.prunedSimpleSemVer(obj, this);
    }
    static create(version) {
        return new this(parseSimpleSemVer_1.default(version));
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
        return stringifySimpleSemVer_1.stringifySimpleSemVer(this);
    }
    toFullString() {
        var _a;
        return ((_a = this.operator) !== null && _a !== void 0 ? _a : '') + this.toString();
    }
}
exports.SimpleSemVer = SimpleSemVer;
exports.default = SimpleSemVer;
//# sourceMappingURL=SimpleSemVer.js.map