"use strict";
/**
 * Created by user on 2020/6/11.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDependencyTable = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
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