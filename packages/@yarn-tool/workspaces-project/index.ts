import { Project as LernaProject } from '@lerna/project';
import { resolve, normalize } from 'upath2';
import { IWorkspacesProjectInternal, EnumWorkspacesProject, IPackedManifest } from './lib/types';
import { findWorkspaceRoot } from 'find-yarn-workspace-root2/core';
import { checkPaths, EnumCheckPaths } from './lib/util';
import type { ILernaJson, IReleaseType } from '@ts-type/package-dts/lerna-json';
import type { IChangelogPreset } from '@yarn-tool/changelog';
import { merge } from 'lodash';
import { sortObjectKeys } from 'sort-object-keys2';
import { pathExistsSync } from 'fs-extra';

/**
 * 以 Lerna Project 為底層、混入（Mixin）Yarn Workspaces 概念的專案操作類別。
 * A project-handling class wrapping Lerna Project and mixing in Yarn Workspaces concepts.
 */
export class WorkspacesProject
{

	/**
	 * 底層的 Lerna Project 實例；config 已具型別為 ILernaJson。
	 * The underlying Lerna Project instance; `config` is typed as `ILernaJson`.
	 *
	 * @see https://github.com/lerna/lerna/tree/master/core/project
	 */
	protected _project: LernaProject & {
		config: ILernaJson,
	};

	/**
	 * 快取（Cache）內部狀態；避免重複解析 workspaces 與 releaseConfig。
	 * Internal cached state; avoids re-resolving `workspaces` and `releaseConfig`.
	 */
	#internal: IWorkspacesProjectInternal = {} as any;

	/**
	 * 建立實例並對齊 yarn／lerna 根目錄。
	 * Create an instance and reconcile the yarn/lerna roots.
	 *
	 * @param cwd 起始目錄，預設為 process.cwd()。Starting directory; defaults to `process.cwd()`.
	 * @param options skipStrictCheck 為 true 時放寬根目錄不一致的檢查。`skipStrictCheck: true` relaxes the mismatched-root check.
	 * @throws 當 lerna 根目錄與 yarn 根目錄不一致且未豁免時拋出 Error。Throws when the lerna root and yarn root mismatch without an exemption.
	 */
	constructor(cwd?: string, options?: {
		skipStrictCheck?: boolean
	})
	{
		cwd = resolve(cwd || process.cwd());

		let root = findWorkspaceRoot(cwd);

		this._project = new LernaProject(cwd)
		let rootPath: string = this._project.rootPath;

		// checkPaths 決定要用哪個根目錄；failed 代表兩根目錄衝突，直接失敗比默默採用錯誤根目錄更安全。
		// `checkPaths` decides which root to use; `failed` means the roots conflict, and failing fast is safer than silently using the wrong one.
		switch (checkPaths({
			root,
			rootPath,
		}, options))
		{
			case EnumCheckPaths.root:
				this._project = new LernaProject(root);
				break;
			case EnumCheckPaths.failed:
				throw new Error(`lerna root is not match yarn workspaces root.\ncwd: ${cwd}\nyarn: ${root}\nlerna: ${rootPath}`);
				break;
		}

		// 有 yarn 工作區時，未明確設定 npmClient 就補上 yarn 並啟用 useWorkspaces，讓 lerna 使用 yarn workspaces。
		// When a yarn workspace exists and `npmClient` is unset, default to yarn and enable `useWorkspaces` so lerna leverages yarn workspaces.
		if (root?.length)
		{
			if (typeof this.config.npmClient === 'undefined' && this.config.useWorkspaces !== false)
			{
				this.npmClient = 'yarn';
				this.config.useWorkspaces = true;
			}
		}

		// 統一路徑分隔符，避免 Windows 與 POSIX 產生不一致的字串比較結果。
		// Normalize path separators so Windows and POSIX do not produce inconsistent string comparisons.
		this._project.rootPath = normalize(this._project.rootPath);

		this._project.rootConfigLocation = normalize(this._project.rootConfigLocation);
	}

	/**
	 * 檢查內部快取是否已存在指定欄位。
	 * Check whether the internal cache already holds the given field.
	 *
	 * @param field 快取欄位名稱。The cached field name.
	 */
	protected _hasInternal<K extends keyof IWorkspacesProjectInternal>(field: K)
	{
		return field in this.#internal
	}

	/**
	 * 讀取內部快取欄位。
	 * Read a field from the internal cache.
	 *
	 * @param field 快取欄位名稱。The cached field name.
	 */
	protected _getInternal<K extends keyof IWorkspacesProjectInternal>(field: K)
	{
		return this.#internal[field]
	}

	/**
	 * 寫入內部快取欄位。
	 * Write a field into the internal cache.
	 *
	 * @param field 快取欄位名稱。The cached field name.
	 * @param value 要寫入的值。The value to store.
	 */
	protected _setInternal<K extends keyof IWorkspacesProjectInternal>(field: K, value: IWorkspacesProjectInternal[K])
	{
		return this.#internal[field] = value
	}

	/**
	 * 工作區根目錄（已正規化）。
	 * The workspace root directory (already normalized).
	 */
	get rootPath(): string
	{
		return this._project.rootPath
	}

	/**
	 * lerna.json 設定檔的完整路徑。
	 * Full path to the `lerna.json` config file.
	 */
	get lernaConfigLocation(): string
	{
		return this._project.rootConfigLocation
	}

	/**
	 * lerna 的 npmClient 設定。
	 * The `npmClient` setting from lerna.
	 */
	get npmClient(): string
	{
		return this._project.config.npmClient
	}

	/**
	 * 設定 npmClient，會直接寫回 lerna 設定。
	 * Set `npmClient`, written back into the lerna config directly.
	 */
	set npmClient(value: string)
	{
		this._project.config.npmClient = value
	}

	/**
	 * workspaces 套件 glob 清單，解析結果會快取避免重複計算。
	 * The workspace glob list; the resolution result is cached to avoid recomputation.
	 */
	get workspaces(): string[]
	{
		let ws: string[];

		// 優先回傳快取，避免每次都重新解析 packageConfigs。
		// Return the cached value first to avoid re-parsing `packageConfigs` every time.
		if (this._hasInternal('workspaces'))
		{
			ws = this._getInternal('workspaces')
		}
		else
		{
			// packageConfigs 在缺少 lerna 配置時可能拋錯，靜默失敗後改用預設值。
			// `packageConfigs` may throw without lerna config; swallow the failure and fall back to a default.
			try
			{
				ws = this._project.packageConfigs;
			}
			catch (e)
			{

			}

			// 取不到任何套件設定時退回 packages/*，確保後續索引不會拿到 undefined。
			// Fall back to `packages/*` when nothing resolves, so downstream indexing never sees `undefined`.
			if (!ws?.length)
			{
				ws = [EnumWorkspacesProject.workspace]
			}

			this._setInternal('workspaces', ws)
		}

		return ws;
	}

	/**
	 * 目前預設使用的 workspace glob；找不到時回退到第一個。
	 * The currently preferred workspace glob; falls back to the first entry when unset.
	 */
	get defaultWorkspace(): string
	{
		if (this._hasInternal('defaultWorkspace'))
		{
			return this._getInternal('defaultWorkspace')
		}

		if (this.workspaces.includes(EnumWorkspacesProject.workspace))
		{
			return EnumWorkspacesProject.workspace
		}

		return this.workspaces[0]
	}

	/**
	 * 指定預設 workspace；不存在於清單時拋出 RangeError 以免寫入無效設定。
	 * Set the preferred workspace; throws `RangeError` when it is absent from the list to avoid persisting an invalid value.
	 *
	 * @throws 當 value 不在 workspaces 清單內時拋出。Throws when `value` is not in the `workspaces` list.
	 */
	set defaultWorkspace(value: string)
	{
		if (!this.workspaces.includes(value))
		{
			throw new RangeError(`${value} not exists in ${this.workspaces}`)
		}

		this.#internal.defaultWorkspace = value;
	}

	/**
	 * 是否採用 Lerna 獨立版本（Independent Versioning）模式。
	 * Whether Lerna uses independent versioning.
	 */
	isIndependent()
	{
		return this.version === EnumWorkspacesProject.independent;
	}

	/**
	 * 版本模式；未設定時視為 independent。
	 * The versioning mode; treated as `independent` when unset.
	 */
	get version(): string | EnumWorkspacesProject.independent
	{
		return this._project.config.version ?? EnumWorkspacesProject.independent;
	}

	/**
	 * 設定版本模式，寫回 lerna 設定。
	 * Set the versioning mode, written back into the lerna config.
	 */
	set version(val: string | EnumWorkspacesProject.independent)
	{
		this._project.config.version = val;
	}

	/**
	 * 根套件的 package.json 封裝結果。
	 * The packed manifest of the root package.
	 *
	 * @see https://github.com/lerna/lerna/tree/master/core/package
	 */
	get manifest(): IPackedManifest
	{
		return this._project.manifest
	}

	/**
	 * 取得同步後的 lerna 設定；每次存取都會對齊 workspaces、version 與 defaultWorkspace。
	 * Obtain the synchronized lerna config; each access aligns `workspaces`, `version`, and `defaultWorkspace`.
	 */
	get config(): ILernaJson
	{
		let ws = this.workspaces;

		// 依 lerna 版本慣用的欄位（workspaces 或 packages）寫入套件清單，保持相容。
		// Write the package list into whichever field the lerna version uses (`workspaces` or `packages`) for compatibility.
		if ('workspaces' in this._project.config)
		{
			this._project.config.workspaces = ws
		}
		else if ('packages' in this._project.config || 1)
		{
			this._project.config.packages = ws
		}

		this._project.config.version = this.version;

		let w = this.defaultWorkspace;

		// 將預設 workspace 移到清單最前，讓 lerna 優先採用第一個 glob。
		// Move the preferred workspace to the front of the list so lerna picks the first glob first.
		if (ws[0] !== w)
		{
			let i = ws.indexOf(w)

			if (i !== -1)
			{
				ws.splice(i, 1);
				ws.unshift(w)
			}

		}

		return this._project.config
	}

	/**
	 * 發版級別（bump）；publish 指令優先於 version 指令。
	 * The release bump level; the `publish` command takes precedence over `version`.
	 */
	get bump(): IReleaseType
	{
		const command = this._project.config.command

		return command?.publish?.bump ?? command?.version?.bump
	}

	/**
	 * changelog 預設集（Preset）；version 指令優先於 publish 指令。
	 * The changelog preset; the `version` command takes precedence over `publish`.
	 */
	get changelogPreset(): IChangelogPreset
	{
		const command = this._project.config.command

		return command?.version?.changelogPreset ?? command?.publish?.changelogPreset
	}

	/**
	 * 合併 version/publish 指令與推導欄位，並依鍵名排序後回傳。
	 * Merge the `version`/`publish` commands with derived fields, sort by key, and return the result.
	 */
	get releaseConfig()
	{
		const command = this._project.config.command

		// merge 到快取欄位以保留前次結果；缺漏的 conventionalGraduate 同樣以 publish 優先補齊。
		// Merge into the cached field to preserve previous results; a missing `conventionalGraduate` is also filled with `publish` taking precedence.
		this.#internal.releaseConfig = merge(this.#internal.releaseConfig, command?.version, command?.publish, {
			changelogPreset: this.changelogPreset,
			bump: this.bump,
			conventionalGraduate: command?.publish?.conventionalGraduate ?? command?.version?.conventionalGraduate,
		});

		// 排序鍵名，讓輸出（如 JSON 寫回）保持穩定可讀的順序。
		// Sort keys so serialized output (e.g. JSON writes) stays stable and readable.
		this.#internal.releaseConfig = sortObjectKeys(this.#internal.releaseConfig) as any

		return this.#internal.releaseConfig
	}

	/**
	 * lerna.json 是否已存在於磁碟。
	 * Whether `lerna.json` exists on disk.
	 */
	existsLernaConfigFile()
	{
		return pathExistsSync(this.lernaConfigLocation)
	}

}

export default WorkspacesProject

