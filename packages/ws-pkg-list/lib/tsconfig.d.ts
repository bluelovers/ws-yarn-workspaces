/**
 * Created by user on 2020/6/5.
 */
import { readPackages } from './readpkg';
import workspacesPackagesList from './listpkg';
/**
 * 產生 tsconfig.json 的 compilerOptions.paths 映射。
 * Build the `compilerOptions.paths` mapping for `tsconfig.json`.
 *
 * @param ls 可為工作區 cwd 字串、套件路徑清單或 readPackages() 的回傳值。May be a workspace `cwd` string, a list of package paths, or the result of `readPackages()`.
 * @returns 以 `套件名/*` 為鍵、相對與絕對路徑清單為值的物件。An object keyed by `pkgName/*` with relative and absolute path arrays as values.
 */
export declare function tsConfigPaths(cwd?: string): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: string[]): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: ReturnType<typeof workspacesPackagesList>): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: ReturnType<typeof readPackages>): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: string[] | ReturnType<typeof workspacesPackagesList> | ReturnType<typeof readPackages>): {
    [k: string]: string[];
};
export default tsConfigPaths;
