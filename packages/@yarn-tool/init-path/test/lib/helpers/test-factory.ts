import { IParseStaticPackagesPathsReturnType } from 'workspaces-config';

/**
 * getTargetDir 函式的選項介面
 * Options interface for getTargetDir function
 */
export interface IGetTargetDirOptions
{
	/** 輸入的套件名稱 / Input package name */
	inputName: string;
	/** 當前工作目錄 / Current working directory */
	cwd: string;
	/** 目標套件名稱（可選）/ Target package name (optional) */
	targetName?: string;
	/** 工作區根目錄路徑（可選）/ Workspace root directory path (optional) */
	hasWorkspace?: string;
	/** 工作區前綴（可選）/ Workspace prefix (optional) */
	workspacePrefix?: string;
	/** 工作區配置（可選）/ Workspace configuration (optional) */
	workspacesConfig?: IParseStaticPackagesPathsReturnType;
}

/**
 * 預設測試選項
 * Default test options
 */
const DEFAULT_TEST_OPTIONS: Partial<IGetTargetDirOptions> = {
	cwd: '/current/dir',
};

/**
 * 建立測試選項
 * Create test options
 *
 * @param overrides - 覆寫的選項 / Options to override
 * @returns 合併後的測試選項 / Merged test options
 */
export function _createTestOptions(overrides: Partial<IGetTargetDirOptions> & { inputName: string }): IGetTargetDirOptions
{
	return {
		...DEFAULT_TEST_OPTIONS,
		...overrides,
	} as IGetTargetDirOptions;
}

/**
 * 預設工作區配置
 * Default workspaces configuration
 */
const DEFAULT_WORKSPACES_CONFIG: IParseStaticPackagesPathsReturnType = {
	prefix: ['packages'],
	prefixRoot: ['packages'],
	prefixSub: [],
	static: ['packages/*'],
	all: ['packages/*'],
};

/**
 * 建立測試工作區配置
 * Create test workspaces configuration
 *
 * @param overrides - 覆寫的配置 / Config to override
 * @returns 合併後的工作區配置 / Merged workspaces configuration
 */
export function _createTestWorkspacesConfig(
	overrides?: Partial<IParseStaticPackagesPathsReturnType>,
): IParseStaticPackagesPathsReturnType
{
	return {
		...DEFAULT_WORKSPACES_CONFIG,
		...overrides,
	};
}
