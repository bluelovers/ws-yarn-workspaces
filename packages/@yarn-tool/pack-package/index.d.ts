/**
 * Created by user on 2020/4/9.
 */
import { IPackageJson } from '@ts-type/package-dts';
import { IPackedTarballInfo } from './lib/types';
export { packTargetPackage } from './lib/pack';
export { printPackedTarballInfo } from './lib/print';
export { getPackedTarballInfo } from './lib/info';
/**
 * 打包套件並回傳可延遲取得 tarball 資訊的凍結物件。
 *
 * tarball() 與 log() 以閉包快取 (Cache) tarball 資訊：
 * 多次呼叫只會讀取/解析一次 tar 檔（Why：解析成本不低且結果不可變）。
 * 使用 Object.freeze 防止呼叫者改寫凍結後的結果。
 *
 * Pack a package and return a frozen object with lazily obtainable tarball
 * info. tarball()/log() cache the info via closure so the tarball is read and
 * parsed at most once (Why: parsing is not cheap and the result is immutable).
 * Object.freeze prevents callers from mutating the result.
 *
 * @param options 打包選項 / packing options
 */
export declare function packPackage(options: {
    pkg?: IPackageJson;
    packageDir: string;
    packageTarball?: string;
    versionPrefix?: string;
}): Promise<Readonly<{
    tarball(): Promise<IPackedTarballInfo>;
    log(): Promise<void>;
    pkg: IPackageJson<unknown>;
    packageDir: string;
    packageTarball: string;
    files: readonly string[];
    versionPrefix?: string;
}>>;
/**
 * 預設匯出主要打包入口（Why：單一主要用途的模組以預設匯出最為直覺）。
 *
 * Default-exports the main pack entry (Why: the most intuitive default for a
 * single-purpose module).
 */
export default packPackage;
