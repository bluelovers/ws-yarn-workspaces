/**
 * Created by user on 2020/4/9.
 */
import { IPackageJson } from '@ts-type/package-dts';
/**
 * 依套件名稱與版本產生預設 tarball 檔名。
 *
 * scoped 名稱（@scope/pkg）須去掉 `@` 並將 `/` 換成 `-`
 * （Why：tarball 檔名不能含有斜線，且此為 npm 的命名慣例）。
 *
 * Derive the default tarball filename from the package name and version.
 *
 * Scoped names (@scope/pkg) drop the `@` and replace `/` with `-`
 * (Why: a filename cannot contain a slash, and this matches npm's convention).
 *
 * @param pkg 套件的 package.json / the package's package.json
 * @param versionPrefix 加在版本前的字串（如 'v'）/ string prefixed to the version (e.g. 'v')
 */
export declare function getTarballName(pkg: IPackageJson, versionPrefix?: string): string;
