"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStyleBorderless = applyStyleBorderless;
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
//# sourceMappingURL=style.js.map