import type { IPackageJson } from '@ts-type/package-dts';
import type { ILernaJsonCommand } from '@ts-type/package-dts/lerna-json';
import type { IPackageJsonDependenciesField, IDependency } from '@ts-type/package-dts/lib/package-json/types';
import type {
	FileResult,
	HostedGitResult,
	URLResult,
	AliasResult,
	RegistryResult
} from 'npm-package-arg';
import type { ITSOverwrite } from 'ts-type';
import { IReleaseType } from '@ts-type/package-dts/lerna-json';

/**
 * WorkspacesProject 常用的預設值常量。
 * Well-known default values used by `WorkspacesProject`.
 */
export const enum EnumWorkspacesProject
{
	/** 預設的 workspace glob。The default workspace glob. */
	workspace = 'packages/*',
	/** Lerna 獨立版本模式的版本值。The version value marking Lerna independent versioning. */
	independent = 'independent'
}

/**
 * WorkspacesProject 內部快取欄位的形狀。
 * Shape of the internal cache fields of `WorkspacesProject`.
 */
export interface IWorkspacesProjectInternal
{
	/** 目前選用的 workspace glob。The currently preferred workspace glob. */
	defaultWorkspace: string;
	/** 已解析的 workspaces glob 清單。The resolved workspace glob list. */
	workspaces: string[];
	/** 合併過的發佈設定，含推導出的 changelogPreset/bump。Merged release config including derived `changelogPreset`/`bump`. */
	releaseConfig: ITSOverwrite<ILernaJsonCommand["version"] & ILernaJsonCommand["publish"], {
		changelogPreset: ILernaJsonCommand["version"]['changelogPreset'],
		conventionalGraduate: ILernaJsonCommand["publish"]['conventionalGraduate'],
		bump: IReleaseType,
	}>,
}

/**
 * 依 npm-package-arg 解析後的套件解析結果聯集型別。
 * Union of the npm-package-arg resolution results for a dependency.
 */
export type IResolvedResult = FileResult | HostedGitResult | URLResult | AliasResult | RegistryResult;

/**
 * IPackedManifest 中屬於本套件自訂、會覆寫 package.json 同名欄位的部分。
 * The custom part of `IPackedManifest` that overrides same-named `package.json` fields.
 *
 * @see WorkspacesProject.manifest
 */
export interface IPackedManifestCore extends Record<IPackageJsonDependenciesField, IDependency>
{
	name: string
	location: string
	private: boolean
	/** 依賴的解析結果。The parsed resolution result of the dependency. */
	resolved: IResolvedResult;
	/** 工作區根目錄。The workspace root. */
	rootPath: string
	/** 是否為 Lerna 套件。Whether this is a Lerna package. */
	__isLernaPackage: boolean
	/** bin 映射。The `bin` mapping. */
	bin: Record<string, string>
	scripts: IPackageJson["scripts"]
	/**
	 * package.json 檔案路徑。
	 * Path of the `package.json` file.
	 */
	manifestLocation: string
	/**
	 * node_modules 資料夾路徑。
	 * Path of the `node_modules` folder.
	 */
	nodeModulesLocation: string
	/**
	 * node_modules/.bin 資料夾路徑。
	 * Path of the `node_modules/.bin` folder.
	 */
	binLocation: string
	version: string
	/** 套件內容目錄。The package contents directory. */
	contents: string

	/** 轉回純 package.json 物件。Convert back to a plain `package.json` object. */
	toJSON(): IPackageJson
	/** 重新讀取磁碟上的最新狀態。Re-read the latest state from disk. */
	refresh(): Promise<IPackedManifest>
	/** 序列化目前狀態。Serialize the current state. */
	serialize(): Promise<IPackedManifest>
	/** 更新本地依賴的版本字串。Update the version string of a local dependency. */
	updateLocalDependency(resolved: IResolvedResult, depVersion: string, savePrefix: string)

}

/**
 * 完整的封裝 manifest：自訂欄位與標準 package.json 欄位的合體。
 * The full packed manifest: custom fields merged with the standard `package.json` fields.
 */
export interface IPackedManifest extends IPackedManifestCore, Omit<IPackageJson, keyof IPackedManifestCore>
{

}
