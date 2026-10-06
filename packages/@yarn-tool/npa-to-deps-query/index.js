"use strict";
/**
 * @fileoverview Resolve npm-package-arg specs to concrete versions via the npm registry
 * @description 透過 npm registry 將 npm-package-arg (npa) 規格解析為具體版本
 *
 * 設計重點：只有轉換結果標記 fetchQuery 時才發送 registry 請求，
 * 可直接保留的範圍或標籤原樣回傳，避免不必要的網路查詢。
 *
 * Design note: a registry request is sent only when the conversion result is flagged
 * `fetchQuery`; ranges or tags that can be kept as-is are returned without any lookup.
 *
 * @module @yarn-tool/npa-to-deps-query
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDepsValueByNpaResult = queryDepsValueByNpaResult;
exports.queryDepsValueByNpa = queryDepsValueByNpa;
const tslib_1 = require("tslib");
const npa_to_deps_1 = require("@yarn-tool/npa-to-deps");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
/**
 * 針對既有的依賴值轉換結果查詢版本 / Query a version for an existing dependency value result
 *
 * 當結果標記 fetchQuery 時，以 semver（缺漏時退回 fetchSpec）向 registry 查詢符合的版本；
 * 否則直接以原始 semver 組出 value，不發送任何請求。
 *
 * When the result is flagged `fetchQuery`, query the registry for a matching version using
 * `semver` (falling back to `fetchSpec` when it is absent); otherwise compose `value` from the
 * original `semver` without any request.
 *
 * @param {ITSResolvable<IDepsResult>} depsResult - 依賴值轉換結果或其 Promise / dependency value result or a promise of it
 *
 * @param {IOptions} [options] - 查詢與轉換選項 / query and conversion options
 *
 * @returns {{ name: string, value: string }} value 為 operator 加上版本或原始範圍 / value is the operator plus the queried version or the original range
 *
 * @example
 * await queryDepsValueByNpaResult(npaToDepsValue('jest@^12'));
 * // => { name: 'jest', value: '^12.1.1' }
 *
 * @example
 * await queryDepsValueByNpaResult(npaToDepsValue('jest@>12'));
 * // => { name: 'jest', value: '>12' }（無需查詢 / no lookup needed）
 */
function queryDepsValueByNpaResult(depsResult, options) {
    /**
     * 以 Bluebird.resolve() 接受同步值與各種 thenable，讓呼叫端不必區分輸入是值還是 Promise
     * Bluebird.resolve() accepts plain values and any thenable, so callers need not distinguish values from promises
     */
    return bluebird_1.default.resolve(depsResult)
        .then(depsResult => {
        var _a, _b;
        const name = depsResult.name;
        /**
         * operator 缺漏時以空字串代替，組出的 value 才不會混入 "undefined" 字樣
         * Default a missing operator to an empty string so the composed value never contains "undefined"
         */
        const operator = (_a = depsResult.operator) !== null && _a !== void 0 ? _a : '';
        /**
         * fetchQuery 表示 npa-to-deps 無法自行決定版本（例如 ^12、未帶運算子的 "12"、
         * 標籤如 latest、或空輸入規格），必須向 registry 查詢；未標記者多半是可直接
         * 保留的範圍（如 >12、<12），保留原值可避免多餘的請求
         *
         * `fetchQuery` means npa-to-deps cannot decide the version by itself (e.g. `^12`,
         * the bare `12`, a tag like `latest`, or an empty input spec), so the registry must
         * be asked; unflagged results are usually ranges kept as-is (e.g. `>12`, `<12`),
         * which avoids an unnecessary request
         */
        if (depsResult.fetchQuery) {
            /**
             * semver 缺漏時（例如空輸入規格）退回 fetchSpec（如 "*"），確保查詢仍有依據
             * When `semver` is missing (e.g. an empty input spec), fall back to `fetchSpec`
             * (e.g. "*") so the lookup still has a basis
             */
            return (0, queryVersion_1.queryVersionWithCache)(depsResult.name, (_b = depsResult.semver) !== null && _b !== void 0 ? _b : depsResult.result.fetchSpec, options === null || options === void 0 ? void 0 : options.queryOptions)
                .then(version => {
                /**
                 * 把 operator（如 ^）接回查到的版本，讓 value 可直接寫入 package.json
                 * Re-attach the operator (e.g. `^`) to the queried version so the value can be written to package.json directly
                 */
                return {
                    name,
                    value: `${operator}${version}`,
                };
            });
        }
        /**
         * 不需查詢：operator 加上原始 semver 即為最終 value
         * No lookup needed: operator plus the original `semver` is the final value
         */
        return {
            name,
            value: `${operator}${depsResult.semver}`,
        };
    });
}
/**
 * 解析套件規格字串並查詢具體版本 / Parse a package spec string and query the concrete version
 *
 * 先以 npaToDepsValue 解析 input，再交給 queryDepsValueByNpaResult 查詢版本，
 * 最後把轉換結果與 { name, value } 合併回傳，讓呼叫端一次取得完整依賴資訊。
 *
 * Parse `input` with npaToDepsValue, run the lookup through queryDepsValueByNpaResult,
 * then merge the conversion result with `{ name, value }` so callers get the full
 * dependency information in one place.
 *
 * @param {string} input - 套件規格字串，例如 `jest@^12` / package spec string, e.g. `jest@^12`
 *
 * @param {IOptions} [options] - 解析、轉換與查詢選項 / parsing, conversion and query options
 *
 * @example
 * // 查詢 registry 取得具體版本 / Query the registry for a concrete version
 * queryDepsValueByNpa('jest@12').tap(console.dir);
 * // => { name: 'jest', value: '12.1.1', ..., result: ... }
 *
 * @example
 * // 已有轉換結果時請改用 queryDepsValueByNpaResult
 * // Use queryDepsValueByNpaResult when you already have a conversion result
 * queryDepsValueByNpaResult(npaToDepsValue('jest@>12'));
 * // => { name: 'jest', value: '>12' }
 */
function queryDepsValueByNpa(input, options) {
    /**
     * 刻意把同步的 npaToDepsValue 包進 .then()，讓解析階段拋出的同步錯誤
     * 也轉成 promise rejection，呼叫端只需處理一種失敗形式
     *
     * Wrapping the synchronous npaToDepsValue in `.then()` turns synchronous parse errors
     * into promise rejections, so callers only ever handle one failure mode
     */
    return bluebird_1.default.resolve()
        .then(() => {
        return (0, npa_to_deps_1.npaToDepsValue)(input, options);
    })
        .then((result) => {
        /**
         * 以展開合併：ret 覆寫 name 與 value，其餘 npa 轉換欄位（semver、operator、result 等）
         * 全部保留；型別斷言則標示出合併後新增的 value 欄位
         *
         * Merge by spreading: `ret` overwrites `name` and `value` while the other npa fields
         * (semver, operator, result, ...) are kept; the type assertion marks the `value`
         * field added by the merge
         */
        return queryDepsValueByNpaResult(result, options)
            .then((ret) => {
            return {
                ...result,
                ...ret,
            };
        });
    });
}
exports.default = queryDepsValueByNpa;
//# sourceMappingURL=index.js.map