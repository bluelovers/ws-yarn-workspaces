/**
 * 以 `cwd` 為起點尋找 workspace 根目錄，並將根目錄的 `yarn.lock` 複製到
 * 每一個 workspace 套件。
 *
 * Locates the workspace root from `cwd` and copies the root `yarn.lock` into
 * every workspace package.
 *
 * @param cwd 起始目錄，向上尋找 workspace 根目錄 / start directory used to
 * search upward for the workspace root
 * @param options 列印與錯誤處理選項 / printing and error handling options
 * @returns 成功同步回傳 `true`；失敗時依 `noThrowError` 回傳 `null` 或丟出
 * `Error` /
 * `true` on success; on failure either `null` or a thrown `Error`,
 * depending on `noThrowError`
 */
export declare function syncLockfile(cwd: string, options?: {
    /** 是否印出處理過程與計時 / whether to print progress and timing */
    print?: boolean;
    /** 失敗時回傳 null 而非丟錯 / return null instead of throwing on failure */
    noThrowError?: boolean;
}): boolean;
/**
 * 預設匯出 (Default export) 指向 syncLockfile，
 * 讓 `import syncLockfile from 'sync-lockfile'` 成為最短的使用方式。
 *
 * The default export points to syncLockfile so the shortest import form
 * remains the primary usage.
 */
export default syncLockfile;
