/**
 * 檢查指定的 node_modules 路徑是否為別名 (Alias) 的工具
 * Utilities to check whether a given node_modules path is an alias
 *
 * 「別名」指目錄名稱或 scope (範圍) 與實際解析 (Resolve) 出的套件名稱不一致，
 * 常見於符號連結 (Symlink)、工作區互相連結與被改名的資料夾。
 * An "alias" means the directory name or scope does not match the resolved
 * package name, commonly seen with symlinks, workspace links and renamed folders.
 */
/**
 * 驗證輸入為絕對路徑 (Absolute Path)
 * Assert that the input is an absolute path
 *
 * @param absolutePath - 待驗證的路徑 / Path to validate
 * @throws RangeError 當路徑不是絕對路徑時 / When the path is not an absolute path
 *
 * 以丟出錯誤而非回傳布林值，可讓錯誤在呼叫端立即中斷，
 * 避免相對路徑被 pkg-dir 從錯誤的起點向上解析出錯誤的模組根目錄。
 * Throwing instead of returning a boolean stops the caller immediately and
 * stops pkg-dir from walking up from the wrong starting point.
 */
export declare function assertIsAbsolutePath(absolutePath: string): asserts absolutePath is string;
/**
 * 解析模組路徑，拆出模組根目錄與上下層目錄名稱
 * Parse a module path into its root directory and surrounding folder names
 *
 * @param absolutePath - 模組本身或其內部的絕對路徑 / Absolute path of or inside the module
 * @returns 模組根目錄、目錄名稱與兩個判定旗標 / Module root, folder names and two boolean flags
 *
 * 邊界情況：若向上找不到任何 package.json，pkgDirSync 會回傳 undefined，
 * 隨後的 normalize 會因參數非字串而丟出錯誤。
 * Edge case: if no package.json is found upward, pkgDirSync returns undefined
 * and normalize then throws because the argument is not a string.
 */
export declare function parseModulePath(absolutePath: string): {
    root: string;
    moduleBasename: string;
    parentBasename: string;
    isTypes: boolean;
    inNodeModules: boolean;
};
/**
 * 解析該路徑對應的實際套件並判斷是否為別名
 * Resolve the actual package for the path and decide whether it is an alias
 *
 * @param absolutePath - 模組的絕對路徑 / Absolute path of the module
 * @returns 模組路徑資料、套件名稱解析結果與 isAlias 旗標 / Module path data, package name parse and the isAlias flag
 */
export declare function parseModulePathIsAlias(absolutePath: string): {
    parsed: import("@yarn-tool/npm-package-arg-util/lib/types").IParsePackageName;
    resolveData: import("@yarn-tool/require-resolve").IPackageInfo<import("@ts-type/package-dts").IPackageJson<unknown>>;
    /** 是否為別名；true 表示目錄名稱或 scope 與實際套件不一致 / Whether it is an alias; true means directory name or scope mismatches the real package */
    isAlias: boolean;
    root: string;
    moduleBasename: string;
    parentBasename: string;
    isTypes: boolean;
    inNodeModules: boolean;
};
/**
 * 先解析套件根目錄再判定別名
 * Resolve the package root first, then check for an alias
 *
 * @param absolutePath - 套件內的任意路徑 / Any path inside the package
 * @returns 同 parseModulePathIsAlias / Same as parseModulePathIsAlias
 *
 * 適用於輸入可能是檔案路徑的情境；解析失敗時錯誤會直接丟出，
 * 沒有任何前置驗證，這正是 Unsafe 的含意。
 * Suited for inputs that may be file paths; resolution errors propagate
 * directly without prior validation, which is what "Unsafe" means here.
 */
export declare function parseModulePathIsAliasUnsafe(absolutePath: string): {
    parsed: import("@yarn-tool/npm-package-arg-util/lib/types").IParsePackageName;
    resolveData: import("@yarn-tool/require-resolve").IPackageInfo<import("@ts-type/package-dts").IPackageJson<unknown>>;
    /** 是否為別名；true 表示目錄名稱或 scope 與實際套件不一致 / Whether it is an alias; true means directory name or scope mismatches the real package */
    isAlias: boolean;
    root: string;
    moduleBasename: string;
    parentBasename: string;
    isTypes: boolean;
    inNodeModules: boolean;
};
/**
 * 判斷指定路徑是否為別名的布林值捷徑
 * Boolean shortcut for checking whether a path is an alias
 *
 * @param dir - 模組路徑 / Module path
 * @returns 是否為別名 / Whether the path is an alias
 */
export declare function modulePathIsAlias(dir: string): boolean;
/**
 * 預設匯出布林值捷徑，兼容 `import modulePathIsAlias from ...` 的用法
 * Default-export the boolean shortcut for `import modulePathIsAlias from ...` usage
 */
export default modulePathIsAlias;
