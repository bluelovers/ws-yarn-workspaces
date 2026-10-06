/**
 * 判斷兩個路徑是否為同一位置（已標記 @deprecated，請改用 path-is-same）。
 * Check whether two paths point to the same location (marked `@deprecated`; use `path-is-same` instead).
 *
 * @param p1 第一個路徑。The first path.
 * @param p2 第二個路徑。The second path.
 * @returns 兩路徑相同時為 true；任一為空則直接 false。`true` when they match; `false` when either input is empty.
 */
export declare function isSamePath(p1: string, p2: string): boolean;
