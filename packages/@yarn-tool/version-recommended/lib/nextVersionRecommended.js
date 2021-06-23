"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommended = void 0;
const semver_1 = require("semver");
const handleOptions_1 = require("./handleOptions");
function nextVersionRecommended(oldVersion, options) {
    var _a, _b;
    let bump = (_b = (_a = (0, handleOptions_1.handleOptions)(options)) === null || _a === void 0 ? void 0 : _a.bump) !== null && _b !== void 0 ? _b : 'patch';
    const newVersion = (0, semver_1.inc)(oldVersion, bump);
    return {
        bump,
        oldVersion,
        newVersion,
    };
}
exports.nextVersionRecommended = nextVersionRecommended;
//# sourceMappingURL=nextVersionRecommended.js.map