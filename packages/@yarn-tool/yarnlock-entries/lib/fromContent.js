"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromContent = fromContent;
exports.fromContentAsync = fromContentAsync;
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
const handleContentObject_1 = require("./handleContentObject");
function fromContent(yarnlock_old) {
    return (0, handleContentObject_1.handleContentObject)((0, yarnlock_parse_1.yarnLockParse)(yarnlock_old));
}
async function fromContentAsync(yarnlock_old) {
    return fromContent(yarnlock_old);
}
exports.default = fromContent;
//# sourceMappingURL=fromContent.js.map