import { EnumInstallTypesErrorCode } from './const';
import { IOptionsCheckInstallTarget } from './types';
/**
 * 檢查套件是否可安裝 (Check whether a package can be installed)
 *
 * Check whether a package is installable and build its dependency string.
 *
 * @param packageName 套件名稱，可含版本查詢字串 (Package name, may include a version query)
 * @param options 檢查選項，例如是否略過版本 (Check options such as ignoring the version)
 *
 * @returns 回傳 `{ name, target, error, msg }`；`error` 為 `EnumInstallTypesErrorCode`，
 * `target` 即使在失敗時也會給出，方便 CLI 顯示預期要安裝的字串。
 *
 * Returns `{ name, target, error, msg }`; `error` is an `EnumInstallTypesErrorCode`
 * and `target` is provided even on failure so the CLI can show what would be
 * installed.
 */
export declare function checkInstallTargetTypes(packageName: string, options?: IOptionsCheckInstallTarget): Promise<{
    name: string;
    target: string;
    error: EnumInstallTypesErrorCode;
    msg: string;
}>;
