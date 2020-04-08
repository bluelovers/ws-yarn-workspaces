export declare function trimKey(name: string, skipNumber?: boolean): string;
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
