"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDependencyTable = void 0;
const tslib_1 = require("tslib");
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
function createDependencyTable(options) {
    return new cli_table3_1.default({
        colAligns: ['left', 'right', 'right', 'right'],
        //colAligns: ['left', 'center', 'center', 'center'],
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
        ...options,
    });
}
exports.createDependencyTable = createDependencyTable;
//# sourceMappingURL=core.js.map