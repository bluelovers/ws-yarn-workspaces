"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNpaResultHasName = assertNpaResultHasName;
function assertNpaResultHasName(result) {
    var _a;
    if (!((_a = result.name) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new Error(`Invalid input: ${result.raw}`);
    }
}
//# sourceMappingURL=assert.js.map