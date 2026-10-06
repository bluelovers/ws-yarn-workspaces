"use strict";
/**
 * 依賴表格的建立核心：提供預設「無邊框」樣式的 `cli-table3` 表格。
 *
 * Core for building dependency tables: provides a `cli-table3` table with a
 * borderless style by default.
 *
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDependencyTable = createDependencyTable;
const tslib_1 = require("tslib");
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
/**
 * 建立預設無邊框的依賴表格 (Dependency Table)。
 *
 * 為什麼預設值必須是「無邊框」：yarn-tool 的輸出多為終端列 (CLI) 較短的
 * 狀態清單，框線字元會造成多餘的視覺噪音，因此整份預設 `chars` 皆設為空字串。
 * `colAligns` 預設第一欄靠左（套件名稱較長可讀）、其餘靠右（版本欄數字對齊）。
 *
 * @param options - 額外的 `cli-table3` 建構選項 / Extra `cli-table3` constructor options
 *
 * 呼叫端的 `options` 刻意放在物件最後展開：任何指定的欄位（如自訂
 * `colAligns`、`head`、`chars`）都會覆寫上面的預設值。
 *
 * The caller's `options` are deliberately spread last: any specified field
 * (custom `colAligns`, `head`, `chars`, ...) overrides the defaults above.
 *
 * @returns 無邊框的 `cli-table3` 表格實例 / A borderless `cli-table3` table instance
 */
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
//# sourceMappingURL=core.js.map