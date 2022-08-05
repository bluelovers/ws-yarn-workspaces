"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getMetadataVersionCore = exports.getMetadataVersion = void 0;
function getMetadataVersion(yarnLockObject) {
    return _getMetadataVersionCore(yarnLockObject.__metadata);
}
exports.getMetadataVersion = getMetadataVersion;
function _getMetadataVersionCore(__metadata) {
    var _a;
    return (_a = __metadata === null || __metadata === void 0 ? void 0 : __metadata.version) === null || _a === void 0 ? void 0 : _a.toString();
}
exports._getMetadataVersionCore = _getMetadataVersionCore;
//# sourceMappingURL=util.js.map