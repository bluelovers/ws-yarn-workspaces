/**
 * Created by user on 2020/4/9.
 */

import { getPacked } from '@lerna/get-packed';
import { IPackageJson } from '@ts-type/package-dts';
import { IPackedTarballInfo } from './types';

/**
 * 讀取已打包 tarball 的詳細資訊（大小、shasum、integrity、檔案清單等）。
 * 交由 @lerna/get-packed 解析，並以 as 收窄為本套件的 IPackedTarballInfo
 * （Why：lerna 未回傳可推導的精確型別）。
 *
 * Read detailed info (size, shasum, integrity, file list, ...) of an already
 * packed tarball. Delegates parsing to @lerna/get-packed and narrows to this
 * package's IPackedTarballInfo via `as` (Why: lerna does not expose a
 * precisely inferable type).
 *
 * @param options.pkg 套件的 package.json / the package's package.json
 * @param options.packageTarball tarball 路徑 / tarball path
 */
export async function getPackedTarballInfo(options: {
	pkg: IPackageJson,
	packageTarball: string,
})
{
	return getPacked(options.pkg, options.packageTarball) as IPackedTarballInfo
}

/**
 * 預設匯出 tarball 資訊讀取函式。
 *
 * Default export of the tarball-info reader.
 */
export default getPackedTarballInfo
