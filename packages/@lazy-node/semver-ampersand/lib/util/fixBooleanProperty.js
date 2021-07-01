"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixBooleanProperty = exports.opts = void 0;
exports.opts = ['includePrerelease', 'loose', 'rtl'];
function fixBooleanProperty(options, fields = exports.opts, mode) {
    fields.forEach(k => {
        if (typeof options[k] !== 'undefined' || mode === true) {
            // @ts-ignore
            options[k] = !!options[k];
        }
    });
    return options;
}
exports.fixBooleanProperty = fixBooleanProperty;
//# sourceMappingURL=fixBooleanProperty.js.map