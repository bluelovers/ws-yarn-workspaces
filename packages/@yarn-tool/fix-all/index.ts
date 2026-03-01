/**
 * @yarn-tool/fix-all
 *
 * 自動檢查和修復 workspaces/package 的工具
 * Auto check/fix tool for workspaces/packages
 *
 * 支援 git 資訊更新、靜態檔案複製與版本修正
 * Supports git info update, static file copy, and version fix
 */
import { findRoot, findRootLazy } from '@yarn-tool/find-root';
import { npmHostedGitInfoLazy } from '@yarn-tool/pkg-git-info';
import { _fixRoot, _fixWsRoot } from './lib/root/index';
import { _initPkgListableByRootData, _runEachPackagesAsync } from './lib/pkg/index';
import { consoleLogger } from 'debug-color2/logger';
import Bluebird from 'bluebird';
import { copyStaticFiles } from '@yarn-tool/static-file';
import { getWsCopyStaticFiles } from '@yarn-tool/static-file/lib/ws/wsCopyStaticFiles';
import { getRootCopyStaticFilesAuto } from '@yarn-tool/static-file/lib/root/getRootCopyStaticFiles';
import { _fixLernaJson } from './lib/ws/lerna';
import { _resetStaticFiles } from './lib/file/reset';

/**
 * npmAutoFixAll 的選項介面
 * Options interface for npmAutoFixAll
 */
export interface INpmAutoFixAll
{
	/**
	 * 是否覆寫 hosted git 資訊
	 * Whether to overwrite hosted git info
	 */
	overwriteHostedGitInfo?: boolean;

	/**
	 * Git 分支名稱
	 * Git branch name
	 */
	branch?: string;

	/**
	 * 是否重置靜態檔案
	 * Whether to reset static files
	 */
	resetStaticFiles?: boolean;
}

/**
 * 自動修復 workspaces/package 的主要函數
 * Main function for auto-fixing workspaces/packages
 *
 * 執行以下操作：
 * 1. 尋找工作區根目錄
 * 2. 複製靜態檔案（.gitignore, .npmignore 等）
 * 3. 更新 git 相關資訊（homepage, repository, bugs）
 * 4. 修復 lerna.json 配置
 * 5. 遍歷所有套件進行修復
 *
 * Performs the following operations:
 * 1. Find workspace root directory
 * 2. Copy static files (.gitignore, .npmignore, etc.)
 * 3. Update git-related info (homepage, repository, bugs)
 * 4. Fix lerna.json configuration
 * 5. Iterate all packages for fixing
 *
 * @param {string} cwd - 當前工作目錄 / Current working directory
 * @param {INpmAutoFixAll} options - 選項 / Options
 * @returns {Bluebird<void>} Promise 物件 / Promise object
 *
 * @example
 * // 在當前目錄執行
 * await npmAutoFixAll(process.cwd());
 *
 * @example
 * // 帶選項執行
 * await npmAutoFixAll(process.cwd(), {
 *   overwriteHostedGitInfo: true,
 *   branch: 'main',
 *   resetStaticFiles: true,
 * });
 */
export function npmAutoFixAll(cwd: string, options?: INpmAutoFixAll)
{
	return Bluebird.resolve().then(async () =>
	{
		// 設定預設工作目錄 / Set default working directory
		cwd ??= process.cwd();

		consoleLogger.info(`cwd: ${cwd}`);

		// 尋找工作區根目錄 / Find workspace root directory
		let rootData = findRootLazy({
			cwd,
		});

		/**
		 * 驗證是否為有效的工作區或套件
		 * Validate if it's a valid workspace or package
		 *
		 * 必須存在 root 屬性才視為有效專案
		 * Must have root property to be considered a valid project
		 */
		if (!rootData?.root)
		{
			throw new Error(`Invalid workspaces / package: ${cwd}`)
		}

		/**
		 * 若在 workspace 根目錄但不在子套件中，重新尋找根目錄
		 * If at workspace root but not in sub-package, re-find root
		 *
		 * 這確保我們總是從正確的位置開始處理
		 * This ensures we always start processing from the correct location
		 */
		if (rootData.hasWorkspace && !rootData.isWorkspace)
		{
			rootData = findRoot({
				cwd: rootData.root,
			});
		}

		console.log(`root:`, rootData.root);
		console.log(`hasWorkspace:`, rootData.hasWorkspace);

		// 解構選項 / Destructure options
		let {
			branch,
			overwriteHostedGitInfo,
			resetStaticFiles
		} = options ?? {};

		cwd = rootData.cwd;

		// 重置靜態檔案（若選項啟用）/ Reset static files (if option enabled)
		if (resetStaticFiles)
		{
			_resetStaticFiles(rootData.root, {
				rootData,
			});
		}

		/**
		 * 複製靜態檔案到 workspace 或根目錄
		 * Copy static files to workspace or root
		 *
		 * 根據專案類型（workspace 或單一套件）複製對應的模板檔案
		 * Copy corresponding template files based on project type
		 */
		if (rootData.hasWorkspace)
		{
			// Workspace 模式：複製 workspace 靜態檔案（.gitignore, .npmignore 等）
			// Workspace mode: copy workspace static files
			const file_map = getWsCopyStaticFiles();

			copyStaticFiles({
				cwd: rootData.ws,
				file_map,
			});
		}
		else if (rootData.root)
		{
			// 單一套件模式：複製根目錄靜態檔案
			// Single package mode: copy root static files
			const file_map = getRootCopyStaticFilesAuto({
				...rootData,
				isRoot: true,
			});

			copyStaticFiles({
				cwd: rootData.root,
				file_map,
			});
		}

		consoleLogger.info(`check git info`);

		// 取得 hosted git 資訊 / Get hosted git info
		const hostedGitInfo = npmHostedGitInfoLazy(cwd);

		console.log(`homepage:`, hostedGitInfo.homepage);
		console.log(`repository:`, hostedGitInfo.repository);

		consoleLogger.info(`auto fix root of workspaces / package`);

		console.log(`root:`, rootData.root);

		/**
		 * 修復根目錄 package.json
		 * Fix root package.json
		 *
		 * 根據專案類型選擇對應的修復策略
		 * Select appropriate fix strategy based on project type
		 */
		if (rootData.hasWorkspace)
		{
			// Workspace 模式：修復 workspace 根目錄的 package.json
			// Workspace mode: fix workspace root package.json
			_fixWsRoot({
				rootData,
				hostedGitInfo,
				branch,
				overwriteHostedGitInfo,
			});
		}
		else
		{
			// 單一套件模式：修復套件根目錄的 package.json
			// Single package mode: fix package root package.json
			_fixRoot({
				rootData,
				hostedGitInfo,
				branch,
				overwriteHostedGitInfo,
				targetDir: rootData.root,
			});
		}

		/**
		 * 修復 lerna.json 配置
		 * Fix lerna.json configuration
		 *
		 * 確保 lerna 配置與 workspace 設定一致
		 * Ensure lerna config is consistent with workspace settings
		 */
		_fixLernaJson({
			rootData,
		});

		/**
		 * 初始化套件列表並遍歷修復
		 * Initialize package list and iterate for fixing
		 *
		 * 對每個子套件執行自動修復操作
		 * Execute auto-fix operations for each sub-package
		 */
		const list = _initPkgListableByRootData(rootData);

		return _runEachPackagesAsync(list, {
			rootData,
			overwriteHostedGitInfo,
			branch,
			hostedGitInfo,
			resetStaticFiles,
		})
	}).then(() => void 0 as void)
}

export default npmAutoFixAll
