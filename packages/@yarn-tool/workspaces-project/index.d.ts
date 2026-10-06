import { Project as LernaProject } from '@lerna/project';
import { IWorkspacesProjectInternal, EnumWorkspacesProject, IPackedManifest } from './lib/types';
import type { ILernaJson, IReleaseType } from '@ts-type/package-dts/lerna-json';
import type { IChangelogPreset } from '@yarn-tool/changelog';
/**
 * 以 Lerna Project 為底層、混入（Mixin）Yarn Workspaces 概念的專案操作類別。
 * A project-handling class wrapping Lerna Project and mixing in Yarn Workspaces concepts.
 */
export declare class WorkspacesProject {
    #private;
    /**
     * 底層的 Lerna Project 實例；config 已具型別為 ILernaJson。
     * The underlying Lerna Project instance; `config` is typed as `ILernaJson`.
     *
     * @see https://github.com/lerna/lerna/tree/master/core/project
     */
    protected _project: LernaProject & {
        config: ILernaJson;
    };
    /**
     * 建立實例並對齊 yarn／lerna 根目錄。
     * Create an instance and reconcile the yarn/lerna roots.
     *
     * @param cwd 起始目錄，預設為 process.cwd()。Starting directory; defaults to `process.cwd()`.
     * @param options skipStrictCheck 為 true 時放寬根目錄不一致的檢查。`skipStrictCheck: true` relaxes the mismatched-root check.
     * @throws 當 lerna 根目錄與 yarn 根目錄不一致且未豁免時拋出 Error。Throws when the lerna root and yarn root mismatch without an exemption.
     */
    constructor(cwd?: string, options?: {
        skipStrictCheck?: boolean;
    });
    /**
     * 檢查內部快取是否已存在指定欄位。
     * Check whether the internal cache already holds the given field.
     *
     * @param field 快取欄位名稱。The cached field name.
     */
    protected _hasInternal<K extends keyof IWorkspacesProjectInternal>(field: K): boolean;
    /**
     * 讀取內部快取欄位。
     * Read a field from the internal cache.
     *
     * @param field 快取欄位名稱。The cached field name.
     */
    protected _getInternal<K extends keyof IWorkspacesProjectInternal>(field: K): IWorkspacesProjectInternal[K];
    /**
     * 寫入內部快取欄位。
     * Write a field into the internal cache.
     *
     * @param field 快取欄位名稱。The cached field name.
     * @param value 要寫入的值。The value to store.
     */
    protected _setInternal<K extends keyof IWorkspacesProjectInternal>(field: K, value: IWorkspacesProjectInternal[K]): IWorkspacesProjectInternal[K];
    /**
     * 工作區根目錄（已正規化）。
     * The workspace root directory (already normalized).
     */
    get rootPath(): string;
    /**
     * lerna.json 設定檔的完整路徑。
     * Full path to the `lerna.json` config file.
     */
    get lernaConfigLocation(): string;
    /**
     * lerna 的 npmClient 設定。
     * The `npmClient` setting from lerna.
     */
    get npmClient(): string;
    /**
     * 設定 npmClient，會直接寫回 lerna 設定。
     * Set `npmClient`, written back into the lerna config directly.
     */
    set npmClient(value: string);
    /**
     * workspaces 套件 glob 清單，解析結果會快取避免重複計算。
     * The workspace glob list; the resolution result is cached to avoid recomputation.
     */
    get workspaces(): string[];
    /**
     * 目前預設使用的 workspace glob；找不到時回退到第一個。
     * The currently preferred workspace glob; falls back to the first entry when unset.
     */
    get defaultWorkspace(): string;
    /**
     * 指定預設 workspace；不存在於清單時拋出 RangeError 以免寫入無效設定。
     * Set the preferred workspace; throws `RangeError` when it is absent from the list to avoid persisting an invalid value.
     *
     * @throws 當 value 不在 workspaces 清單內時拋出。Throws when `value` is not in the `workspaces` list.
     */
    set defaultWorkspace(value: string);
    /**
     * 是否採用 Lerna 獨立版本（Independent Versioning）模式。
     * Whether Lerna uses independent versioning.
     */
    isIndependent(): boolean;
    /**
     * 版本模式；未設定時視為 independent。
     * The versioning mode; treated as `independent` when unset.
     */
    get version(): string | EnumWorkspacesProject.independent;
    /**
     * 設定版本模式，寫回 lerna 設定。
     * Set the versioning mode, written back into the lerna config.
     */
    set version(val: string | EnumWorkspacesProject.independent);
    /**
     * 根套件的 package.json 封裝結果。
     * The packed manifest of the root package.
     *
     * @see https://github.com/lerna/lerna/tree/master/core/package
     */
    get manifest(): IPackedManifest;
    /**
     * 取得同步後的 lerna 設定；每次存取都會對齊 workspaces、version 與 defaultWorkspace。
     * Obtain the synchronized lerna config; each access aligns `workspaces`, `version`, and `defaultWorkspace`.
     */
    get config(): ILernaJson;
    /**
     * 發版級別（bump）；publish 指令優先於 version 指令。
     * The release bump level; the `publish` command takes precedence over `version`.
     */
    get bump(): IReleaseType;
    /**
     * changelog 預設集（Preset）；version 指令優先於 publish 指令。
     * The changelog preset; the `version` command takes precedence over `publish`.
     */
    get changelogPreset(): IChangelogPreset;
    /**
     * 合併 version/publish 指令與推導欄位，並依鍵名排序後回傳。
     * Merge the `version`/`publish` commands with derived fields, sort by key, and return the result.
     */
    get releaseConfig(): import("ts-type").ITSOverwrite<import("ts-type").ITSPickBothDiff<{
        [k: string]: unknown;
        allowBranch?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        conventionalCommits?: boolean;
        changelogPreset?: string | "@bluelovers/conventional-changelog-bluelovers";
        exact?: boolean;
        createRelease?: "gitlab" | "github";
        noPrivate?: boolean;
    }> & Pick<{
        concurrency?: number;
        bump?: IReleaseType;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        conventionalCommits?: boolean;
        changelogPreset?: string | "@bluelovers/conventional-changelog-bluelovers";
        exact?: boolean;
        createRelease?: "gitlab" | "github";
        noPrivate?: boolean;
    } | {
        [k: string]: unknown;
        allowBranch?: string | string[];
        message?: string;
    }, import("ts-type").ITSKeyofBothSame<{
        [k: string]: unknown;
        allowBranch?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        conventionalCommits?: boolean;
        changelogPreset?: string | "@bluelovers/conventional-changelog-bluelovers";
        exact?: boolean;
        createRelease?: "gitlab" | "github";
        noPrivate?: boolean;
    }>> & import("ts-type").ITSPickBothDiff<{
        [k: string]: unknown;
        ignoreChanges?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        conventionalGraduate?: boolean;
        distTag?: import("@ts-type/package-dts/package-json").IPackageJsonTag;
        npmClient?: import("@ts-type/package-dts/lerna-json").INpmClient;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        noPrivate?: boolean;
    }> & Pick<{
        concurrency?: number;
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        conventionalGraduate?: boolean;
        distTag?: import("@ts-type/package-dts/package-json").IPackageJsonTag;
        npmClient?: import("@ts-type/package-dts/lerna-json").INpmClient;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        noPrivate?: boolean;
    } | {
        [k: string]: unknown;
        ignoreChanges?: string | string[];
        message?: string;
    }, import("ts-type").ITSKeyofBothSame<{
        [k: string]: unknown;
        ignoreChanges?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        conventionalGraduate?: boolean;
        distTag?: import("@ts-type/package-dts/package-json").IPackageJsonTag;
        npmClient?: import("@ts-type/package-dts/lerna-json").INpmClient;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        noPrivate?: boolean;
    }>>, {
        changelogPreset: import("@ts-type/package-dts/lerna-json").ILernaJsonCommand["version"]["changelogPreset"];
        conventionalGraduate: import("@ts-type/package-dts/lerna-json").ILernaJsonCommand["publish"]["conventionalGraduate"];
        bump: IReleaseType;
    }>;
    /**
     * lerna.json 是否已存在於磁碟。
     * Whether `lerna.json` exists on disk.
     */
    existsLernaConfigFile(): boolean;
}
export default WorkspacesProject;
