import Comparator from 'semver/classes/comparator';
/**
 * 是否為 Null Set（<0.0.0-0，代表沒有任何版本符合）
 * Whether it is a null set (<0.0.0-0, nothing can match)
 *
 * @param c - 比較器 / Comparator
 * @returns 是否為 Null Set / Whether it is a null set
 */
export declare function isNullSet<T extends Comparator>(c: T): c is T & {
    value: '<0.0.0-0';
};
/**
 * 是否為任意版本比較器（`*`，值為空字串）
 * Whether it is an "any" comparator (`*`, empty-string value)
 *
 * @param c - 比較器 / Comparator
 * @returns 是否為任意版本 / Whether it matches any version
 */
export declare function isAny<T extends Comparator>(c: T): c is T & {
    value: '';
};
