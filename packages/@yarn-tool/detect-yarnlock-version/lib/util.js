"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataVersion = getMetadataVersion;
exports._getMetadataVersionCore = _getMetadataVersionCore;
function getMetadataVersion(yarnLockObject) {
    return _getMetadataVersionCore(yarnLockObject.__metadata);
}
function _getMetadataVersionCore(__metadata) {
    var _a;
    return (_a = __metadata === null || __metadata === void 0 ? void 0 : __metadata.version) === null || _a === void 0 ? void 0 : _a.toString();
}
//# sourceMappingURL=util.js.map