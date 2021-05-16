"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendVersion = void 0;
const recommend_version_1 = require("@lerna/conventional-commits/lib/recommend-version");
const util_1 = require("./util");
function recommendVersion(pkg, options) {
    options = util_1.handleOptions(options);
    return recommend_version_1.recommendVersion(pkg, options.type, options);
}
exports.recommendVersion = recommendVersion;
exports.default = recommendVersion;
//# sourceMappingURL=recommend.js.map