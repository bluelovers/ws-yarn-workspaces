"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSemVer = void 0;
const tslib_1 = require("tslib");
const stringifySimpleSemVer_1 = require("./stringifySimpleSemVer");
const pruned_1 = require("./util/pruned");
const checker_1 = require("./checker");
const parseSimpleSemVer_1 = tslib_1.__importDefault(require("./parseSimpleSemVer"));
class SimpleSemVer {
    constructor(obj) {
        (0, checker_1.assertSimpleSemVerObjectOrOperatorLike)(obj);
        // @ts-ignore
        (0, pruned_1.prunedSimpleSemVer)(obj, this);
    }
    static create(version) {
        return new this((0, parseSimpleSemVer_1.default)(version));
    }
    isValid() {
        return (0, checker_1.isSimpleSemVerObjectOrOperatorLike)(this);
    }
    isValidOperator() {
        return (0, checker_1.isSimpleSemVerOperatorLike)(this);
    }
    isValidObject() {
        return (0, checker_1.isSimpleSemVerObjectLike)(this);
    }
    hasOperator() {
        return (0, checker_1.hasOperator)(this);
    }
    toJSON() {
        return (0, pruned_1.prunedSimpleSemVer)(this);
    }
    toString() {
        return (0, stringifySimpleSemVer_1.stringifySimpleSemVer)(this);
    }
    toFullString() {
        var _a;
        return ((_a = this.operator) !== null && _a !== void 0 ? _a : '') + this.toString();
    }
}
exports.SimpleSemVer = SimpleSemVer;
exports.default = SimpleSemVer;
//# sourceMappingURL=SimpleSemVer.js.map