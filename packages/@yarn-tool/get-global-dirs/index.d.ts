/**
 * 單一套件管理器的全局目錄集合，三個欄位皆為已解析為絕對路徑的目錄字串。
 *
 * A set of global directories for a single package manager;
 * every field is an already-resolved absolute directory path.
 */
export interface IGlobalDirectoryEntry {
    /**
     * 全局套件安裝目錄，等同於執行 `npm root --global` 的結果。

     The directory with globally installed packages.

     Equivalent to `npm root --global`.
    */
    packages: string;
    /**
     * 全局可執行檔（Binaries）目錄，等同於執行 `npm bin --global` 的結果。

     The directory with globally installed binaries.

     Equivalent to `npm bin --global`.
    */
    binaries: string;
    /**
     * 全局前綴（Prefix）目錄，同時作為 packages 與 binaries 的上層目錄；
     * 一般情境下較常直接使用上面兩個欄位。

     The directory with directories for packages and binaries. You probably want either of the above.

     Equivalent to `npm prefix --global`.
    */
    prefix: string;
}
/**
 * 三種套件管理器（npm / yarn / pnpm）的全局目錄彙整介面。
 * 屬性在模組載入時即以 eager（立即求值）方式解析完成，讀取時不再有 I/O。
 *
 * Aggregated global directories for the three package managers (npm / yarn / pnpm).
 * Properties are resolved eagerly at module load time, so no I/O happens on access.
 */
export interface IGlobalDirectory {
    /**
     * 取得 npm 全局套件與可執行檔的目錄。

     Get the directory of globally installed packages and binaries.

     @example
     ```
     import globalDirectory from 'global-directory';

     console.log(globalDirectory.npm.prefix);
     //=> '/usr/local'

     console.log(globalDirectory.npm.packages);
     //=> '/usr/local/lib/node_modules'
     ```
    */
    npm: IGlobalDirectoryEntry;
    /**
     * 取得 yarn 全局套件與可執行檔的目錄。

     Get the directory of globally installed packages and binaries.

     @example
     ```
     import globalDirectory from 'global-directory';

     console.log(globalDirectory.npm.binaries);
     //=> '/usr/local/bin'

     console.log(globalDirectory.yarn.packages);
     //=> '/Users/sindresorhus/.config/yarn/global/node_modules'
     ```
    */
    yarn: IGlobalDirectoryEntry;
    /**
     * 取得 pnpm 全局套件與可執行檔的目錄。

     Get the directory of globally installed packages and binaries.

     @example
     ```
     import globalDirectory from 'global-directory';

     console.log(globalDirectory.pnpm.prefix);
     //=> '/Users/sindresorhus/Library/pnpm'

     console.log(globalDirectory.pnpm.packages);
     //=> '/Users/sindresorhus/Library/pnpm/global/5/node_modules'
     ```
    */
    pnpm: IGlobalDirectoryEntry;
}
/**
 * 取得全域安裝的套件與可執行檔目錄。
 * 沿用與 npm、yarn、pnpm 相同的解析邏輯，於模組載入時一次性建立。
 *
 * Get the directory of globally installed packages and binaries.
 * Uses the same resolution logic as npm, yarn, and pnpm,
 * built once eagerly when the module is loaded.
 *
 * @see https://github.com/sindresorhus/global-directory/blob/main/index.js
 */
declare const globalDirectory: IGlobalDirectory;
/**
 * 匯出面：
 * - `globalDirectory`（預設與具名）：完整的 npm/yarn/pnpm 目錄集合。
 * - `npm` / `yarn` / `pnpm` 具名匯出：方便只取單一套件管理器的目錄。
 * - `IGlobalDirectory` / `IGlobalDirectoryEntry`：型別定義（type-only，無執行期產出）。
 *
 * Exports:
 * - `globalDirectory` (default & named): the full npm/yarn/pnpm directory set.
 * - `npm` / `yarn` / `pnpm` named exports: convenience for using a single
 *   package manager's directories only.
 * - `IGlobalDirectory` / `IGlobalDirectoryEntry`: type definitions
 *   (type-only, no runtime output).
 */
export { globalDirectory };
export declare const npm: IGlobalDirectoryEntry;
export declare const yarn: IGlobalDirectoryEntry;
export declare const pnpm: IGlobalDirectoryEntry;
export default globalDirectory;
