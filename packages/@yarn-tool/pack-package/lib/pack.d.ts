/**
 * Created by user on 2020/4/9.
 */
import { IPackageJson } from '@ts-type/package-dts';
/**
 * 以 npm 的打包規則計算欲收錄的檔案清單。
 * 先由 Arborist 載入實際的 node_modules 樹，再交給 npm-packlist
 * 決定收錄內容（Why：與 `npm pack` 的判斷邏輯保持一致）。
 *
 * Compute the file list to pack using npm's packing rules. Arborist loads the
 * actual node_modules tree first, then npm-packlist decides what is included
 * (Why: keeps the behavior identical to `npm pack`).
 *
 * @param options.path 套件目錄 / package directory
 */
export declare function packlist(options: {
    path: string;
}): Promise<string[]>;
/**
 * 將套件目錄打包為 tarball。
 *
 * mtime 固定為 1985-10-26 是 tar 的 portable 慣例（Why：讓同一份內容
 * 產出位元相同的壓縮檔，以利重現建置 Reproducible Build）。
 * prefix 固定 'package/' 與 npm tarball 結構一致。
 *
 * Pack a package directory into a tarball. The fixed mtime (1985-10-26, the
 * tar portability convention) keeps byte-identical output for identical input
 * (Why: reproducible builds). The `package/` prefix matches npm tarballs.
 *
 * @param options.packageDir 套件目錄 / package directory
 * @param options.packageTarball tarball 輸出路徑 / output tarball path
 */
export declare function packTargetDirectory({ packageDir, packageTarball, }: {
    packageDir: string;
    packageTarball: string;
}): Promise<readonly string[]>;
/**
 * 打包指定套件並回傳打包上下文（pkg、目錄、tarball 路徑、檔案清單）。
 *
 * realpathSync 展開符號連結 (Symlink)（Why：cwd 為 symlink 時
 * tar 內的相對路徑會失準，必須以真實路徑為基準）。
 * 未提供 pkg 時才讀檔，避免呼叫者已載入 package.json 時的重複 I/O。
 *
 * Pack the given package and return the packing context (pkg, dir, tarball
 * path, file list). realpathSync resolves symlinks (Why: when cwd is a symlink
 * the relative paths inside the tarball would otherwise be wrong). package.json
 * is only read when pkg is not supplied, avoiding duplicate I/O.
 *
 * @param options 打包選項 / packing options
 */
export declare function packTargetPackage(options: {
    pkg?: IPackageJson;
    packageDir: string;
    packageTarball?: string;
    versionPrefix?: string;
}): Promise<{
    pkg: IPackageJson<unknown>;
    packageDir: string;
    packageTarball: string;
    files: readonly string[];
    versionPrefix?: string;
}>;
/**
 * 預設匯出打包函式。
 *
 * Default export of the pack function.
 */
export default packTargetPackage;
