"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStyleBorderless = void 0;
function applyStyleBorderless(table) {
    Object.assign(table.options, {
        chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
            middle: '',
        },
    });
    return table;
}
exports.applyStyleBorderless = applyStyleBorderless;
//# sourceMappingURL=style.js.map