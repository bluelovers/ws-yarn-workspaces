"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptionsOrLoose = parseOptionsOrLoose;
const index_1 = require("../util/index");
const fixBooleanProperty_1 = require("../util/fixBooleanProperty");
/**
 * 把各種選項傳入形式統一成純物件
 * Normalize the many ways options can be passed into a plain object
 *
 * 允許的傳入形式有三種，對應三個分支：
 * 1. `false` → 明確的寬鬆旗標，轉成 { loose: false }
 * 2. 非純物件（undefined、類陣列等）→ 給空物件，避免後續存取到意外欄位
 * 3. 真正的布林值 `true` → 轉成 { loose: true }
 * 其餘（純物件）則交給 fixBooleanProperty 把布林欄位正規化。
 * Three input shapes map to the branches below:
 * 1. `false` → an explicit loose flag, becoming { loose: false }
 * 2. a non-plain object (undefined, array-like, …) → an empty object so
 *    downstream code never reads unexpected fields
 * 3. a real boolean `true` → { loose: true }
 * Everything else (a plain object) goes through fixBooleanProperty to coerce
 * its boolean fields.
 *
 * @param options - 任意形式的選項 / Options in any accepted form
 * @returns 純物件形式的選項 / Options as a plain object
 */
function parseOptionsOrLoose(options) {
    if (options === false) {
        options = {
            loose: !!options,
        };
    }
    else if (!options || typeof options === 'object' && !(0, index_1.isPlainObject)(options)) {
        options = {};
    }
    else if (typeof options !== 'object' || !(0, index_1.isPlainObject)(options)) {
        options = {
            loose: !!options,
        };
    }
    else {
        options = (0, fixBooleanProperty_1.fixBooleanProperty)(options, fixBooleanProperty_1.opts);
    }
    return options;
}
//# sourceMappingURL=parseOptionsOrLoose.js.map