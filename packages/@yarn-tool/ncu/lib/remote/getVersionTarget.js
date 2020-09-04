"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionTarget = exports._getVersionTarget = void 0;
function _getVersionTarget(options) {
    // @ts-ignore
    return options.semverLevel || (options.newest ? 'newest' :
        options.greatest ? 'greatest' :
            'latest');
}
exports._getVersionTarget = _getVersionTarget;
function getVersionTarget(options) {
    if (typeof options === 'string') {
        // @ts-ignore
        return options;
    }
    else if (options.versionTarget) {
        return options.versionTarget;
    }
    return _getVersionTarget(options);
}
exports.getVersionTarget = getVersionTarget;
//# sourceMappingURL=getVersionTarget.js.map