/**
 * 去除字串開頭的底線、冒號、橫線
 * Remove leading underscores, colons, and hyphens from string
 *
 * @param name - 要處理的腳本名稱
 * @param skipNumber - 是否跳過數字處理
 * @returns 處理後的字串
 *
 * @example
 * trimKey('_test')     // 'test'
 * trimKey(':build')    // 'build'
 * trimKey('--test-1')  // 'test'
 */
export declare function trimKey(name: string, skipNumber?: boolean): string;
/**
 * 取得腳本名稱的第一部分（第一個區段）
 * Extract the first segment (first part) of a script name
 *
 * 將腳本名稱依據底線、冒號、橫線進行分割，取第一個區段作為主要 key。
 * 例如 'pretest:watch' 会返回 'test'，'build:esm' 会返回 'build'。
 *
 * @param name - 要處理的腳本名稱
 * @returns 第一個區段
 *
 * @example
 * firstPartKey('pretest')      // 'test'
 * firstPartKey('build:esm')    // 'build'
 * firstPartKey('postpublish')  // 'publish'
 */
export declare function firstPartKey(name: string): string;
/**
 * 從腳本名稱推導分組用的三個鍵值 / Derive the three keys used for grouping from a script name
 *
 * - name：原始腳本名稱不動，供回溯對照 / the untouched original name, for mapping back
 * - key：保留 pre/post 之外的基礎鍵（如 'pretest:watch' -> 'test'）
 *        the base key with pre/post retained only outside the base segment
 * - omitted：再去除 pre/post 前綴（如 'pretest' -> 'test'），用於判斷是否為同一組生命週期腳本
 *            the key with pre/post stripped (e.g. 'pretest' -> 'test'), used to decide
 *            whether scripts belong to the same lifecycle group
 *
 * @param name - 要解析的腳本名稱 / the script name to parse
 * @returns 包含 name、key、omitted 的物件 / an object containing name, key and omitted
 */
export declare function omitKey(name: string): {
    /**
     * 原始腳本名稱 / the original script name
     */
    name: string;
    /**
     * 去除分隔前後綴後的第一段鍵 / the first-segment key after separators are trimmed
     */
    key: string;
    /**
     * 再去除 pre / post 前綴後的鍵 / the key with the pre / post prefix removed
     */
    omitted: string;
};
/**
 * 腳本的預設分組與排序順序 / Default grouping and sorting order for scripts
 * 預設遵循 npm 生命週期腳本順序 / By default it follows the npm lifecycle scripts order
 *
 * 此順序是 handleKeyOrdersCore 的排序基準（第一組放入最終順序），
 * 陣列由上而下即為由前至後的優先度，故新增或對調項目會直接改變排序結果。
 *
 * This order is the baseline used by `handleKeyOrdersCore` (its values are put
 * first into the final order); the array top-to-bottom equals front-to-back
 * priority, so adding or swapping entries directly changes the sort result.
 */
export declare const defaultNpmScriptsOrder: Set<string>;
/**
 * 需特別對待的「其他腳本」名稱清單 / Names treated as "other" scripts
 *
 * 這些名稱本身不是生命週期腳本，但以 pre 開頭（如 prettier），
 * 若不列於此，omitKey 會把 'prettier' 誤解析成 'ttier' 之類的基礎鍵而分組錯誤。
 *
 * These names are not lifecycle scripts yet start with `pre` (e.g. `prettier`);
 * without this list, `omitKey` would mis-parse `prettier` into a bogus base key
 * such as `ttier` and group it incorrectly.
 */
export declare const otherScriptNames: Set<string>;
