"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommended = nextVersionRecommended;
const semver_1 = require("semver");
const handleOptions_1 = require("./handleOptions");
function nextVersionRecommended(oldVersion, options) {
    var _a;
    options = (0, handleOptions_1.handleOptions)(options, oldVersion);
    let bump = (_a = options.bump) !== null && _a !== void 0 ? _a : 'patch';
    const newVersion = (0, semver_1.inc)(oldVersion, bump, options.preid, options.identifierBase);
    return {
        bump,
        oldVersion,
        newVersion,
    };
}
//# sourceMappingURL=nextVersionRecommended.js.map