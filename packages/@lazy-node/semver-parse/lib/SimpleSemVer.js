"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSemVer = void 0;
const stringifySemver_1 = require("./stringifySemver");
class SimpleSemVer {
    constructor(obj) {
        Object.keys(obj).forEach((key) => {
            this[key] = obj[key];
        });
    }
    toString() {
        return stringifySemver_1.stringifySemver(this);
    }
}
exports.SimpleSemVer = SimpleSemVer;
//# sourceMappingURL=SimpleSemVer.js.map