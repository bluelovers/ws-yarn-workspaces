"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isSameOptions = _isSameOptions;
exports._copyOptions = _copyOptions;
exports._normalizeOptions = _normalizeOptions;
const fixBooleanProperty_1 = require("../util/fixBooleanProperty");
function _isSameOptions(oldOptions, newOptions) {
    return oldOptions.loose === newOptions.loose &&
        oldOptions.includePrerelease === newOptions.includePrerelease;
}
function _copyOptions(oldOptions, newOptions) {
    oldOptions.loose = !!newOptions.loose;
    oldOptions.includePrerelease = !!newOptions.includePrerelease;
    return oldOptions;
}
function _normalizeOptions(options) {
    options = (0, fixBooleanProperty_1.fixBooleanProperty)(options, [
        'loose',
        'includePrerelease',
    ], true);
    return options;
}
//# sourceMappingURL=options.js.map