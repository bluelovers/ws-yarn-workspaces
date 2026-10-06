"use strict";
/**
 * 檢查指定的 node_modules 路徑是否為別名 (Alias) 的工具
 * Utilities to check whether a given node_modules path is an alias
 *
 * 「別名」指目錄名稱或 scope (範圍) 與實際解析 (Resolve) 出的套件名稱不一致，
 * 常見於符號連結 (Symlink)、工作區互相連結與被改名的資料夾。
 * An "alias" means the directory name or scope does not match the resolved
 * package name, commonly seen with symlinks, workspace links and renamed folders.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsAbsolutePath = assertIsAbsolutePath;
exports.parseModulePath = parseModulePath;
exports.parseModulePathIsAlias = parseModulePathIsAlias;
exports.parseModulePathIsAliasUnsafe = parseModulePathIsAliasUnsafe;
exports.modulePathIsAlias = modulePathIsAlias;
const pkg_dir_1 = require("pkg-dir");
const parseArgvPkgName_1 = require("@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName");
const resolve_package_1 = require("@yarn-tool/resolve-package");
const upath2_1 = require("upath2");
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
function assertIsAbsolutePath(absolutePath) {
    if (!(0, upath2_1.isAbsolute)(absolutePath)) {
        throw new RangeError(`Input path should be absolute path: ${absolutePath}`);
    }
}
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
function parseModulePath(absolutePath) {
    assertIsAbsolutePath(absolutePath);
    const root = (0, upath2_1.normalize)((0, pkg_dir_1.sync)(absolutePath));
    const moduleBasename = (0, upath2_1.basename)(root);
    const parentBasename = (0, upath2_1.basename)((0, upath2_1.dirname)(root));
    /**
     * @types 套件的目錄名稱與實際套件名稱遵循不同的比對規則，
     * 別名判定需要這個獨立旗標才能單獨處理。
     * @types packages follow different name-matching rules, so the alias check
     * needs this separate flag to treat them individually.
     */
    const isTypes = parentBasename === '@types';
    /**
     * 只有模組直接位於 node_modules 下（未帶 scope）時才為 true；
     * scoped 套件的父目錄是 @scope，因此會保持 false。
     * True only when the module sits directly under node_modules (unscoped);
     * a scoped package has @scope as its parent, so it stays false.
     */
    const inNodeModules = parentBasename === 'node_modules';
    return {
        root,
        moduleBasename,
        parentBasename,
        isTypes,
        inNodeModules,
    };
}
/**
 * 解析該路徑對應的實際套件並判斷是否為別名
 * Resolve the actual package for the path and decide whether it is an alias
 *
 * @param absolutePath - 模組的絕對路徑 / Absolute path of the module
 * @returns 模組路徑資料、套件名稱解析結果與 isAlias 旗標 / Module path data, package name parse and the isAlias flag
 */
function parseModulePathIsAlias(absolutePath) {
    const data = parseModulePath(absolutePath);
    const resolveData = (0, resolve_package_1.resolvePackage)(absolutePath);
    const parsed = (0, parseArgvPkgName_1.parsePackageName)(resolveData.pkg.name);
    /**
     * 三個條件以 OR 串接，任一成立即視為別名：
     * 1) 目錄名稱與實際套件的 subname 不符（資料夾被改名）
     * 2) 位於 @types 之下但實際套件不是 @types
     * 3) 實際套件帶有 scope，但父目錄名稱不是該 scope
     * Three conditions OR'ed together; any match marks an alias:
     * 1) directory name differs from the resolved subname (renamed folder)
     * 2) under @types while the resolved package is not @types
     * 3) the resolved package has a scope that does not match the parent folder
     *
     * 條件 2 以 data.isTypes 為前置、條件 3 以 parsed.scope 為前置，
     * 可避免一般（未帶 scope、非 @types）的套件被誤判為別名。
     * Condition 2 is guarded by data.isTypes and condition 3 by parsed.scope,
     * so regular unscoped, non-@types packages are never misflagged.
     */
    const isAlias = !!(data.moduleBasename !== parsed.subname || data.isTypes && parsed.scope !== '@types' || parsed.scope && parsed.scope !== data.parentBasename);
    return {
        ...data,
        parsed,
        resolveData,
        /** 是否為別名；true 表示目錄名稱或 scope 與實際套件不一致 / Whether it is an alias; true means directory name or scope mismatches the real package */
        isAlias,
    };
}
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
function parseModulePathIsAliasUnsafe(absolutePath) {
    return parseModulePathIsAlias((0, resolve_package_1.resolvePackageCore)(absolutePath).pkgRoot);
}
/**
 * 判斷指定路徑是否為別名的布林值捷徑
 * Boolean shortcut for checking whether a path is an alias
 *
 * @param dir - 模組路徑 / Module path
 * @returns 是否為別名 / Whether the path is an alias
 */
function modulePathIsAlias(dir) {
    return parseModulePathIsAlias(dir).isAlias;
}
/**
 * 預設匯出布林值捷徑，兼容 `import modulePathIsAlias from ...` 的用法
 * Default-export the boolean shortcut for `import modulePathIsAlias from ...` usage
 */
exports.default = modulePathIsAlias;
//# sourceMappingURL=index.js.map