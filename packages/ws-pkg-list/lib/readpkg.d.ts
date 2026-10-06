/**
 * Created by user on 2020/6/5.
 */
import IPackageJson from '@ts-type/package-dts';
import { IReadedPackages } from './types';
/**
 * 讀取一組套件路徑下的 package.json，並以套件名稱為鍵建立索引。
 * Read the `package.json` of each given package path and build an index keyed by package name.
 *
 * @param ls 套件資料夾路徑清單，通常來自 workspacesPackagesList()。List of package folder paths, usually from `workspacesPackagesList()`.
 * @param cwd 解析相對路徑的基準目錄，預設為 process.cwd()。Base directory used to resolve relative paths; defaults to `process.cwd()`.
 * @returns 以 name 為鍵的 IReadedPackages 物件。An `IReadedPackages` object keyed by package name.
 */
export declare function readPackages<T = IPackageJson>(ls: string[], cwd?: string): IReadedPackages<T>;
export default readPackages;
