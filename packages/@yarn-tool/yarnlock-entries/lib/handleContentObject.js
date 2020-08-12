"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleContentObject = void 0;
const YarnLockIterator_1 = __importDefault(require("./YarnLockIterator"));
function handleContentObject(data) {
    return new YarnLockIterator_1.default(data);
}
exports.handleContentObject = handleContentObject;
//# sourceMappingURL=handleContentObject.js.map