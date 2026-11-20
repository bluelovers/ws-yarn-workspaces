"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getStyleFromFlags = _getStyleFromFlags;
exports.analyzeVersionStyles = analyzeVersionStyles;
exports.selectVersionStyles = selectVersionStyles;
const types_1 = require("./types");
const helpers_1 = require("./helpers");
/**
 * 從解析旗標取得對應的版本樣式
 *
 * @param flags - 解析結果旗標
 * @returns 版本樣式
 */
function _getStyleFromFlags(flags) {
    const { isJetbrainsShort, isMDCombined, isDateTime, isY2KDateTime } = flags;
    /**
     * 日期時間樣式必然同時為短年份與月日合併，故需優先判斷，
     * 否則會被下方 2x2 矩陣誤判成 JetbrainsShortMD；
     * 兩種時間樣式再以 isY2KDateTime 區分年份編碼 (2YY 與 YYQ)
     */
    if (isDateTime) {
        return isY2KDateTime ? types_1.EnumVersionStyle.Y2KDateTime : types_1.EnumVersionStyle.JetbrainsDateTime;
    }
    /**
     * 兩個布林旗標組成 2x2 矩陣，先判斷年份格式再判斷月日格式，
     * 可避免四種樣式各寫一個條件
     */
    if (isJetbrainsShort) {
        return isMDCombined ? types_1.EnumVersionStyle.JetbrainsShortMD : types_1.EnumVersionStyle.JetbrainsShort;
    }
    return isMDCombined ? types_1.EnumVersionStyle.StandardFullMD : types_1.EnumVersionStyle.StandardFull;
}
/**
 * 分析版本號符合的風格
 *
 * 依優先序逐一嘗試各風格解析器，回傳所有符合的風格與同時符合時採用的優先風格；
 * 解析優先序是規則的單一事實來源，`parseVersion` 也由此取得優先結果，
 * 需要依 `prefer` / `exclude` 重排或排除時，交給 `selectVersionStyles` 處理本函式的結果
 *
 * @param version - 版本號字串
 * @returns 風格分析結果
 */
function analyzeVersionStyles(version) {
    /**
     * 各風格解析器，越前面優先權越高：
     *
     * 1. JetBrains 日期時間 (YYQ.MMDD.HHmm) 與 y2k 日期時間 (2YY.MMDD.HHmm) 同時符合時，JetBrains 優先
     * 2. 時間樣式須第三段為合法時分，否則交回給遞增式樣式解析
     * 3. 標準樣式以四位年份區隔，不會與三位年份編碼的樣式相撞
     * 4. JetBrains 短樣式要求合法 YYQ 編碼，避免 4 位年份被誤判
     *
     * 以包裝函式延遲取用解析器，避免模組載入循環時在初始化階段讀到未就緒的函式
     */
    const candidates = [
        (v) => (0, helpers_1._parseJetbrainsDateTime)(v),
        (v) => (0, helpers_1._parseY2KDateTime)(v),
        (v) => (0, helpers_1._parseStandardFullVersion)(v),
        (v) => (0, helpers_1._parseJetbrainsShort)(v),
    ];
    /** 符合的風格與其解析結果，依解析優先序收集 */
    const matches = [];
    for (const parse of candidates) {
        const result = parse(version);
        /** 不符合此風格即換下一個候選 */
        if (!result) {
            continue;
        }
        matches.push({ style: _getStyleFromFlags(result), result });
    }
    return _toAnalysis(matches);
}
/**
 * 依優先選用 / 排除清單，從風格分析結果選出最終樣式
 *
 * 只整理 `analyzeVersionStyles` 的結果，不重新解析：
 *
 * 1. `exclude` 先過濾：被排除的風格即使符合也不列入，更不可能成為優先風格
 * 2. `prefer` 再重排：符合的優先風格提到最前面（清單內依給定順序），其餘保持原解析優先序
 * 3. 未符合的優先風格不佔位；兩張清單都沒給時原樣回傳
 *
 * @param analysis - `analyzeVersionStyles` 的分析結果
 * @param options - 選擇選項（優先選用 / 排除特定風格）
 * @returns 整理後的風格分析結果
 */
function selectVersionStyles(analysis, options) {
    const { prefer, exclude } = options !== null && options !== void 0 ? options : {};
    /** 沒有給任何清單時無需整理，直接沿用原結果 */
    if (!(prefer === null || prefer === void 0 ? void 0 : prefer.length) && !(exclude === null || exclude === void 0 ? void 0 : exclude.length)) {
        return analysis;
    }
    const availableStyles = analysis.matchedStyles.filter((style) => !(exclude === null || exclude === void 0 ? void 0 : exclude.includes(style)));
    /**
     * 優先清單中的風格提到最前面並維持清單內先後順序，
     * 其餘風格保持原本的解析優先序
     */
    const orderedStyles = prefer
        ? [
            ...prefer.filter((style) => availableStyles.includes(style)),
            ...availableStyles.filter((style) => !prefer.includes(style)),
        ]
        : availableStyles;
    return _toAnalysis(orderedStyles
        .map((style) => ({ style, result: analysis.matchedResults[style] }))
        .filter((match) => match.result != null));
}
/**
 * 由「風格 + 解析結果」清單組出分析結果
 *
 * @param matches - 依最終順序排列的符合清單
 * @returns 風格分析結果
 */
function _toAnalysis(matches) {
    var _a, _b, _c;
    const matchedStyles = [];
    const matchedResults = {};
    for (const { style, result } of matches) {
        matchedStyles.push(style);
        (_a = matchedResults[style]) !== null && _a !== void 0 ? _a : (matchedResults[style] = result);
    }
    /** 優先風格即符合清單的第一筆 */
    const priorityStyle = (_b = matchedStyles[0]) !== null && _b !== void 0 ? _b : null;
    return {
        matchedStyles,
        matchedResults,
        priorityStyle,
        priorityResult: priorityStyle ? (_c = matchedResults[priorityStyle]) !== null && _c !== void 0 ? _c : null : null,
    };
}
//# sourceMappingURL=analyze.js.map