/**
 * 安裝目標的前置檢查 (Pre-install check for an install target)
 *
 * 在真正寫入依賴前，先確認套件是否存在、是否已存在於依賴欄位、是否已棄用，
 * 讓 CLI 能依不同狀態給出對應訊息。
 *
 * Before a dependency is written, verify that the package exists, is not
 * already listed, and is not deprecated, so the CLI can report each state.
 */
import { packageNameToTypes } from '@yarn-tool/npm-package-arg-util/lib/packageNameToTypes';
import { generatePackageArg } from '@yarn-tool/npm-package-arg-util/lib/generatePackageArg';
import { existsDependencies } from './util/existsDependencies';
import { getPackageInfo } from './getPackageInfo';
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
export async function checkInstallTargetTypes(packageName: string, options?: IOptionsCheckInstallTarget)
{
	let data = packageNameToTypes(packageName);
	let { name } = data;

	/**
	 * 已存在於依賴欄位時直接略過，不必連線查詢 registry
	 *
	 * Skips the registry round-trip when it is already listed in dependencies.
	 */
	if (options?.checkExists && existsDependencies(name, options?.pkg ?? {}))
	{
		let target = generatePackageArg({
			name,
			semver: data.semver,
		}, data.semver?.length > 0);

		return {
			name,
			target,
			error: EnumInstallTypesErrorCode.SKIP,
			msg: `${name} already exists in package dependencies`,
		}
	}

	let info = await getPackageInfo(data, options?.excludeVersion);

	/**
	 * 非 tag 輸入且 registry 有回傳版本時，改寫成 `^版本` 以保留 compatible 更新；
	 * tag 輸入則維持原樣，讓 yarn 依 tag 解析。
	 *
	 * For non-tag input with a registry version, rewrite as `^version` to allow
	 * compatible updates; tag input is left alone so yarn resolves the tag.
	 */
	let target = generatePackageArg({
		name,
		semver: data.type !== 'tag' && info?.version?.length ? `^${info.version}` : data.semver,
	}, data.semver?.length > 0);

	if (info == null)
	{
		/**
		 * 套件不存在：回報 `NOT_EXISTS`，訊息由這裡統一產生
		 *
		 * Unknown package: report NOT_EXISTS with a consistent message.
		 */
		return {
			name,
			target,
			error: EnumInstallTypesErrorCode.NOT_EXISTS,
			msg: `${name} not exists`,
		}
	}
	else if (info.deprecated)
	{
		/**
		 * 已棄用：直接沿用 registry 的說明文字，資訊比自行撰寫的更有用
		 *
		 * Deprecated: reuse the registry's own note, which is more useful than our own text.
		 */
		return {
			name,
			target,
			error: EnumInstallTypesErrorCode.DEPRECATED,
			msg: info.deprecated,
		}
	}

	return {
		name,
		target,
		error: EnumInstallTypesErrorCode.SUCCESS,
		msg: `add ${target} to dependency`,
	}
}
