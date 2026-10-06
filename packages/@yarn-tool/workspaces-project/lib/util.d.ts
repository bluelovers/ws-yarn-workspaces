/**
 * checkPaths() 的回傳結果，代表兩種根目錄比對後的處置方式。
 * Result of `checkPaths()`, describing how to treat the two compared roots.
 */
export declare const enum EnumCheckPaths {
    /** lerna 根目錄位於 yarn 根目錄之下，應採用 yarn 根目錄。The lerna root sits under the yarn root; adopt the yarn root. */
    root = 1,
    /** 兩根目錄一致（或其中一方為空），沿用 lerna 根目錄即可。Roots match (or one side is empty); keep the lerna root. */
    rootPath = 0,
    /** 根目錄衝突，無法安全建立專案。Roots conflict; the project cannot be safely constructed. */
    failed = -1
}
/**
 * 比對 Yarn Workspaces 根目錄與 Lerna 根目錄，決定要採用哪一個。
 * Compare the Yarn Workspaces root against the Lerna root and decide which one to adopt.
 *
 * @param input.root 由 find-yarn-workspace-root2 找到的 yarn 根目錄。The yarn root found by `find-yarn-workspace-root2`.
 * @param input.rootPath 由 @lerna/project 解析出的 lerna 根目錄。The lerna root resolved by `@lerna/project`.
 * @param options skipStrictCheck 為 true 時，只要 lerna 根目錄在 yarn 根目錄之下就視為可接受。When `skipStrictCheck` is true, a lerna root nested under the yarn root is accepted.
 * @returns EnumCheckPaths 判定結果。The `EnumCheckPaths` verdict.
 */
export declare function checkPaths(input: {
    root: any;
    rootPath: any;
}, options?: {
    skipStrictCheck?: boolean;
}): EnumCheckPaths;
