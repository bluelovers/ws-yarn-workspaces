"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommended = void 0;
const semver_1 = require("semver");
function nextVersionRecommended(oldVersion, options) {
    var _a;
    let bump = (_a = options === null || options === void 0 ? void 0 : options.bump) !== null && _a !== void 0 ? _a : 'patch';
    const newVersion = semver_1.inc(oldVersion, bump);
    return {
        bump,
        oldVersion,
        newVersion,
    };
}
exports.nextVersionRecommended = nextVersionRecommended;
//# sourceMappingURL=nextVersionRecommended.js.map