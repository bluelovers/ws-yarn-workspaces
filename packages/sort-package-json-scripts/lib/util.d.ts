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
 * omit key logic
 */
export declare function omitKey(name: string): {
    /**
     * input name
     */
    name: string;
    /**
     * omit name and only keep first part
     */
    key: string;
    /**
     * omit key with pre / post
     */
    omitted: string;
};
/**
 * group / sore scripts order, by default is follow npm lifecycle scripts
 */
export declare const defaultNpmScriptsOrder: Set<string>;
/**
 * avoid omitKey wrong parse script name (e.g. prettier
 */
export declare const otherScriptNames: Set<string>;
