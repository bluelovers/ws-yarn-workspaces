"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromContentAsync = exports.fromContent = void 0;
const index_1 = require("@yarn-tool/yarnlock-parse/index");
const handleContentObject_1 = require("./handleContentObject");
function fromContent(yarnlock_old) {
    return handleContentObject_1.handleContentObject(index_1.yarnLockParse(yarnlock_old));
}
exports.fromContent = fromContent;
async function fromContentAsync(yarnlock_old) {
    return fromContent(yarnlock_old);
}
exports.fromContentAsync = fromContentAsync;
exports.default = fromContent;
//# sourceMappingURL=fromContent.js.map