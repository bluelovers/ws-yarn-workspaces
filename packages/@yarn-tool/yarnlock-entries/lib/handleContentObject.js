"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleContentObjectAsync = exports.handleContentObject = void 0;
const YarnLockIterator_1 = require("./YarnLockIterator");
function handleContentObject(data) {
    return new YarnLockIterator_1.YarnLockIterator(data);
}
exports.handleContentObject = handleContentObject;
async function handleContentObjectAsync(data) {
    return handleContentObject(data);
}
exports.handleContentObjectAsync = handleContentObjectAsync;
//# sourceMappingURL=handleContentObject.js.map