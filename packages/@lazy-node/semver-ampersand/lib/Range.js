"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.SemverRange = void 0;
const tslib_1 = require("tslib");
/**
 * 增強版 semver Range 類別
 * Enhanced semver Range class
 *
 * 繼承 semver 的 Range，但刻意略過父層建構函式（super() 不帶參數），
 * 改由 _inherit 自行正規化輸入，才能同時接受字串、Comparator、SemVer
 * 與原生 Range 作為來源，並在搬移時保留原有的比較器集合以避免重複解析。
 * Extends semver's Range but deliberately skips the parent constructor
 * (`super()` takes no arguments), letting `_inherit` normalize the input so a
 * string, Comparator, SemVer, or native Range can all serve as the source while
 * an existing comparator set is carried over instead of re-parsed.
 *
 * @packageDocumentation
 */
const range_1 = tslib_1.__importDefault(require("semver/classes/range"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
const stringifyComparators_1 = require("./util/stringifyComparators");
const semver_1 = tslib_1.__importDefault(require("semver/classes/semver"));
const class_without_call_parent_constructor_1 = require("class-without-call-parent-constructor");
const semver_2 = require("semver");
const options_1 = require("./range/options");
const toRangeString_1 = require("./range/toRangeString");
const assert_1 = require("./util/assert");
const fixComparatorSet_1 = require("./range/fixComparatorSet");
const parseOptionsOrLoose_1 = require("./internal/parseOptionsOrLoose");
const split_1 = require("./util/split");
const parseRange_1 = require("./range/parseRange");
/**
 * SemverRange 類別（對外以 Range 匯出）
 * The SemverRange class (exported as `Range`)
 *
 * 特點：來源可為多種型別、支援 ampersand 語法、可重用既有比較器集合。
 * Highlights: accepts several source types, supports ampersand syntax, and
 * can reuse an existing comparator set.
 *
 * @template RAW - 原始輸入的型別 / Type of the raw input
 *
 * @example
 * ```typescript
 * const range = new Range('>=1.0.0 & <2.0.0');
 * range.test('1.5.0'); // true
 * range.toString(); // '>=1.0.0 <2.0.0'
 * ```
 */
class SemverRange extends (0, class_without_call_parent_constructor_1.classWithoutCallParentConstructor)(range_1.default) {
    /**
     * 建立 Range 實例
     * Create a Range instance
     *
     * @param rawSource - 範圍來源（字串、Comparator、SemVer、原生 Range）/ Range source (string, Comparator, SemVer, native Range)
     * @param optionsOrLoose - 選項或寬鬆旗標 / Options or loose flag
     * @throws {TypeError} 當比較器集合為空（整個範圍無效）時 / When the comparator set is empty (the whole range is invalid)
     */
    constructor(rawSource, optionsOrLoose) {
        // skip original semverRange constructor
        super();
        // 統一選項格式，讓後續一律拿到物件形態的選項
        // Normalize option shape so everything downstream sees an object
        optionsOrLoose = (0, parseOptionsOrLoose_1.parseOptionsOrLoose)(optionsOrLoose);
        let { range, options, set } = this._inherit(rawSource, optionsOrLoose);
        /**
         * 只有當正規化後的字串與呼叫端輸入不同時才記錄 rawSource，
         * 否則保留 undefined，避免不必要的記憶體佔用。
         * Record rawSource only when normalization changed the string;
         * otherwise leave it undefined to avoid needless memory use.
         */
        if (typeof rawSource === 'string' && range !== rawSource) {
            this.rawSource = rawSource;
        }
        this._inheritOptions(options);
        /**
         * 來源若已帶有比較器集合（例如搬移另一個 Range），
         * 直接沿用，省下重新解析的成本。
         * When the source already carries a comparator set (e.g. another
         * Range being copied), reuse it instead of paying for a re-parse.
         */
        if (!set) {
            set = this._buildComparatorsSet(range, options);
        }
        (0, assert_1.assertInvalidComparatorSet)(set, `Invalid SemVer Range: ${range}`);
        // unsafeOptimize 才會真的做集合簡化，預設保持原樣以確保行為一致
        // The set is only simplified under unsafeOptimize; by default it is kept
        // as-is so behavior stays predictable
        set = (0, fixComparatorSet_1.fixComparatorSet)(set, options.unsafeOptimize);
        (0, assert_1.assertInvalidComparatorSet)(set);
        this.raw = range;
        this.set = set;
        this.format();
    }
    /**
     * 把範圍字串切成二維比較器集合
     * Turn a range string into a two-dimensional comparator set
     *
     * 以 `||` 分割成多個集合，各集合再解析為比較器；
     * 空集合會被過濾（loose 模式下允許個別條件無效），
     * 但若整個範圍都無效，外層的 assert 仍會拋錯。
     * Split on `||` into groups, then parse each group into comparators; empty
     * groups are dropped (loose mode tolerates invalid individual conditions),
     * while a wholly invalid range still throws at the outer assert.
     *
     * @param range - 範圍字串 / Range string
     * @param options - 選項 / Options
     * @returns 比較器集合 / Comparator set
     */
    _buildComparatorsSet(range, options) {
        let comparatorsSet = (0, split_1.splitDoubleVerticalBar)(range)
            // map the range to a 2d array of comparators
            .map(range => this.parseRange(range))
            // throw out any comparator lists that are empty
            // this generally means that it was not a valid range, which is allowed
            // in loose mode, but will still throw if the WHOLE range is invalid.
            .filter(c => c.length);
        return comparatorsSet;
    }
    /**
     * 解析單一（不含 `||`）的範圍字串
     * Parse a single range string (without `||`)
     *
     * 這裡帶入 this.options，確保 ampersand 與空格的處理與建構時一致。
     * Options are threaded through here so ampersand/space handling matches
     * what the constructor did.
     *
     * @param range - 範圍字串 / Range string
     * @returns 比較器陣列 / Comparator array
     */
    parseRange(range) {
        return (0, parseRange_1.parseRange)(range, this.options);
    }
    /**
     * 從各種來源繼承範圍與選項
     * Inherit range and options from any supported source
     *
     * 輸入為原生 semver Range 時：合併兩側選項，且僅在選項完全相同的情況下
     * 直接沿用其 set；否則會重新解析（選項不同可能產生不同結果）。
     * When the input is a native semver Range: options from both sides are
     * merged, and its `set` is reused only when the merged options match
     * exactly — otherwise it is re-parsed, since differing options can produce
     * a different set.
     *
     * @param range - 範圍來源 / Range source
     * @param options - 已正規化的選項 / Normalized options
     * @returns 正規化後的 range、options 與（可能存在的）set / Normalized range, options, and (possibly) set
     */
    _inherit(range, options) {
        let set;
        if (range instanceof range_1.default) {
            options = {
                loose: range.loose,
                includePrerelease: range.includePrerelease,
                ...range.options,
                ...options,
            };
            options = (0, options_1._normalizeOptions)(options);
            // 選項一致才可安全搬移 set，否則可能與新選項不相符
            // The set may only be moved when options agree, otherwise it might
            // not match the new options
            if ((0, options_1._isSameOptions)(range, options)) {
                set = range.set;
            }
            range = range.raw;
        }
        /**
         * Comparator / SemVer 這兩種來源各自轉成可繼續解析的形態：
         * Comparator 直接包成單元素集合，SemVer 則取其格式化字串。
         * Comparator and SemVer sources are each converted into something
         * parseable: a Comparator becomes a single-element set, a SemVer is
         * reduced to its formatted string.
         */
        if (range instanceof semver_2.Comparator) {
            set = [[range]];
            range = range.value;
        }
        else if (range instanceof semver_1.default) {
            range = range.format();
        }
        // 有 set 但為空集合代表來源無效，提早拋錯避免帶到後續流程
        // An existing-but-empty set means the source is invalid; fail fast
        // instead of letting it travel further downstream
        if ((set === null || set === void 0 ? void 0 : set.length) === 0) {
            (0, assert_1.assertInvalidComparatorSet)(set);
        }
        options = (0, options_1._normalizeOptions)(options);
        // 依選項決定是否把 & 視為「且」並整理空白
        // Decide per options whether `&` means "AND" and tidy the whitespace
        range = (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range, options);
        return {
            range,
            options,
            set,
        };
    }
    /**
     * 把選項同步到實例上
     * Sync options onto the instance
     *
     * options 寫入父層欄位後，再以 _copyOptions 複製 loose / includePrerelease
     * 兩個常用欄位，避免每次取值都要翻閱 options 物件。
     * After writing `options` to the parent field, `_copyOptions` mirrors the
     * frequently used `loose` / `includePrerelease` fields so readers do not
     * have to dig into the options object.
     *
     * @param options - 已正規化的選項 / Normalized options
     */
    _inheritOptions(options) {
        this.options = options;
        (0, options_1._copyOptions)(this, options);
    }
    /**
     * 取得格式化後的範圍字串
     * Get the formatted range string
     *
     * 每次存取都從 set 重新組字串（而非取快取），因為 set 可能已被外部修改。
     * The string is rebuilt from `set` on every access instead of being cached,
     * because `set` may have been mutated externally.
     */
    // @ts-ignore
    get range() {
        // @ts-ignore
        this.formatted = (0, stringifyComparators_1.stringifyComparatorsSet)(this.set);
        return this.formatted;
    }
    //	override format()
    //	{
    //		return this.range
    //	}
    /**
     * Return '*' instead of '' so that truthiness works.
     *
     * 回傳 `*` 而非空字串，可讓 `if (range.toRangeString())` 這類真值判斷成立。
     * Returning `*` instead of an empty string keeps truthiness checks such as
     * `if (range.toRangeString())` working.
     */
    toRangeString() {
        return (0, toRangeString_1.toRangeString)(this.range);
    }
}
exports.SemverRange = SemverRange;
exports.Range = SemverRange;
exports.default = SemverRange;
//# sourceMappingURL=Range.js.map