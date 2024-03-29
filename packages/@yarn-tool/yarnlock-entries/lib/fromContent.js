"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromContentAsync = exports.fromContent = void 0;
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
const handleContentObject_1 = require("./handleContentObject");
function fromContent(yarnlock_old) {
    return (0, handleContentObject_1.handleContentObject)((0, yarnlock_parse_1.yarnLockParse)(yarnlock_old));
}
exports.fromContent = fromContent;
async function fromContentAsync(yarnlock_old) {
    return fromContent(yarnlock_old);
}
exports.fromContentAsync = fromContentAsync;
exports.default = fromContent;
//# sourceMappingURL=fromContent.js.map