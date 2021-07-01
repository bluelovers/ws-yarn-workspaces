"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._normalizeOptions = exports._copyOptions = exports._isSameOptions = void 0;
const fixBooleanProperty_1 = require("../util/fixBooleanProperty");
function _isSameOptions(oldOptions, newOptions) {
    return oldOptions.loose === newOptions.loose &&
        oldOptions.includePrerelease === newOptions.includePrerelease;
}
exports._isSameOptions = _isSameOptions;
function _copyOptions(oldOptions, newOptions) {
    oldOptions.loose = !!newOptions.loose;
    oldOptions.includePrerelease = !!newOptions.includePrerelease;
    return oldOptions;
}
exports._copyOptions = _copyOptions;
function _normalizeOptions(options) {
    options = (0, fixBooleanProperty_1.fixBooleanProperty)(options, [
        'loose',
        'includePrerelease',
    ], true);
    return options;
}
exports._normalizeOptions = _normalizeOptions;
//# sourceMappingURL=options.js.map