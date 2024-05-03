"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleContentObject = handleContentObject;
exports.handleContentObjectAsync = handleContentObjectAsync;
const YarnLockIterator_1 = require("./YarnLockIterator");
function handleContentObject(data) {
    return new YarnLockIterator_1.YarnLockIterator(data);
}
async function handleContentObjectAsync(data) {
    return handleContentObject(data);
}
//# sourceMappingURL=handleContentObject.js.map