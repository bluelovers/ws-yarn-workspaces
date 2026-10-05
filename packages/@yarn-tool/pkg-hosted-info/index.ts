import { IPackageJson } from '@ts-type/package-dts/package-json';
import { findRootLazy, IFindRootReturnType } from '@yarn-tool/find-root';
import { relative } from 'upath2';
import { INpmHostedGitInfo, npmHostedGitInfoLazy } from '@yarn-tool/pkg-git-info';
import { ITSPickExtra } from 'ts-type/lib/type/record';

/**
 * 填入 package.json 託管 Git 資訊時的選項；
 * 除了 targetDir 之外皆可省略，由函式在需要時自行惰性推斷（Lazy Resolution），
 * 以免呼叫端為了單一欄位就必須先解析整個 workspace 根目錄。
 *
 * Options used when filling hosted git info into package.json.
 * Everything except targetDir is optional and derived lazily inside the function,
 * so callers do not need to resolve the whole workspace root for a single field.
 */
export interface IFillPkgHostedInfoOptions
{
	/** 套件所在目錄，作為推斷 workspace 相對路徑與 Git 資訊的起點 / Package directory used as the starting point for relative paths and git info */
	targetDir?: string;
	/** 已解析的根目錄資料；先提供可避免重複查找 / Pre-resolved root data; providing it avoids redundant lookups */
	rootData?: IFindRootReturnType;
	/** 組成 homepage 時使用的分支名稱，預設 master / Branch name used to build homepage, defaults to master */
	branch?: string;
	/** 已取得的託管平台資訊；先提供則不再重新推斷 / Already-resolved hosted git info; skips re-detection when provided */
	hostedGitInfo?: INpmHostedGitInfo;
	/**
	 * true 時無條件覆寫既有欄位；false 只補上缺漏欄位。
	 * 預設 false 是為了尊重使用者手動撰寫的 homepage / bugs / repository。
	 *
	 * When true, overwrites existing fields unconditionally; when false, only fills missing ones.
	 * Defaults to false so hand-written homepage / bugs / repository are preserved.
	 */
	overwriteHostedGitInfo?: boolean;
}

/**
 * fillPkgHostedInfo 回傳值中保證存在的欄位，
 * 對應 npm package.json 的官方欄位定義，方便後續程式碼安全取用。
 *
 * Fields guaranteed to exist on the return value of fillPkgHostedInfo;
 * mirrors the official npm package.json fields for safe downstream access.
 */
export type IFillPkgHostedInfoFields = {
	/** 套件首頁網址 / Package homepage URL */
	homepage: string,
	/** 缺陷回報網址 / Bug report URL */
	bugs: {
		url: string,
	},
	repository: {
		/** 版控種類，npm 約定為 git / Version control kind, npm expects `git` */
		type: string | 'git',
		/** Git 倉庫網址 / Git repository URL */
		url: string,
		/**
		 * monorepo 中子套件的相對路徑；非 workspace 情境會缺省，
		 * 因為 npm 會忽略空值，寫入 directory: "" 反而製造雜訊。
		 *
		 * Relative path of the sub-package inside a monorepo; omitted for non-workspace
		 * projects because npm ignores empty values and `directory: ""` only adds noise.
		 *
		 * @see https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository
		 */
		directory: string,
	}
}

/**
 * 把已取得的託管 Git 資訊轉換成 package.json 的 homepage / bugs / repository 欄位。
 * 採用「必要選項」型別，表示此函式不負責推斷，推斷責任留在 fillPkgHostedInfo，
 * 讓兩層各自單純、也方便單元測試直接注入假資料。
 *
 * Converts already-resolved hosted git info into the homepage / bugs / repository fields.
 * Its options are required (no lazy detection here); detection lives in fillPkgHostedInfo,
 * which keeps both layers simple and lets tests inject fixtures directly.
 *
 * @param pkg 目標 package.json 物件，會被就地修改 / Target package.json object, mutated in place
 * @param options 必填的來源資料 / Required source data
 */
export function _hostedGitInfoToFields<P extends Partial<IPackageJson>>(pkg: P,
	options: ITSPickExtra<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'targetDir'>,
): P & IFillPkgHostedInfoFields
{
	let { targetDir, rootData, branch, hostedGitInfo, overwriteHostedGitInfo } = options;

	let directory: string;

	// 只有「位於 workspace 內但本身不是 workspace 根節點」才需要 directory；
	// 根節點或非 workspace 專案的相對路徑為空，npm 會忽略空值，
	// 因此刻意不給預設值，避免寫出 directory: "" 這種無意義欄位。
	//
	// directory is only needed when the package sits inside a workspace but is not the
	// workspace root itself; for the root or a standalone project the relative path is
	// empty, and npm ignores it, so no default is assigned to avoid a useless `directory: ""`.
	if (rootData?.hasWorkspace && !rootData?.isWorkspace)
	{
		directory = relative(rootData.ws, targetDir);
	}

	// 覆寫模式必須一次寫入三個欄位，否則會出現 homepage 已更新、
	// bugs / repository 仍為舊值的不一致狀態。
	//
	// Overwrite mode writes all three fields at once, otherwise homepage would be updated
	// while bugs / repository kept stale values, leaving the manifest inconsistent.
	if (overwriteHostedGitInfo)
	{
		pkg.homepage = hostedGitInfo.homepage;
		pkg.bugs = {
			url: hostedGitInfo.bugs,
		};
		pkg.repository = {
			"type": "git",
			url: hostedGitInfo.repository,
			directory,
		};
	}
	else
	{
		// 保留模式採用 ||=：只有欄位不存在時才填入，
		// 讓使用者手動維護的網址優先於自動推斷的結果。
		//
		// Preserve mode uses ||= so hand-maintained URLs always win over auto-detected ones.
		// @ts-ignore
		pkg.homepage ||= hostedGitInfo.homepage;

		// @ts-ignore
		pkg.bugs ||= {
			url: hostedGitInfo.bugs,
		};

		// @ts-ignore
		pkg.repository ||= {
			"type": "git",
			url: hostedGitInfo.repository,
			directory,
		};
	}

	// 只有真的算出子套件相對路徑時才改寫 homepage，
	// 否則會把單純的專案首頁誤改成指向 repo 根目錄的 tree 連結。
	//
	// homepage is only rewritten when an actual sub-package path was computed;
	// otherwise a plain project homepage would be turned into a repo-root tree link.
	if (directory?.length)
	{
		// 使用 ??= 而非 = ：未指定 branch 時才退回預設主分支，
		// 不會覆蓋呼叫端刻意傳入的 branch（包含空字串以外的自訂名稱）。
		//
		// ??= instead of = : the default branch is only used when none was given,
		// never clobbering a caller-provided branch name.
		branch ??= 'master';

		let u = new URL(pkg.homepage as string);

		// 追加 /tree/<branch>/<directory>，讓 homepage 直接指向套件所在資料夾，
		// 在 GitHub 等平台點開即是該子套件的目錄頁。
		//
		// Appending /tree/<branch>/<directory> makes homepage point at the package folder,
		// which opens the sub-package directory page on hosts like GitHub.
		u.pathname += `/tree/${branch}/` + directory;

		// @ts-ignore
		pkg.homepage = u.toString();
	}

	// 呼叫端傳入的 pkg 可能只是 Partial，這裡以 any 回傳以保留泛型推論。
	//
	// The incoming pkg may be Partial, so it is cast to any to preserve generic inference.
	return pkg as any
}

/**
 * 依託管 Git 資訊補齊 package.json 的 homepage / bugs / repository 欄位（本套件預設匯出）。
 *
 * Fills the homepage / bugs / repository fields of package.json from hosted git info
 * (the package's default export).
 *
 * @param pkg 目標 package.json 物件，會被就地修改 / Target package.json object, mutated in place
 * @param options 選項；全部皆可省略並自動推斷 / Optional; everything can be derived automatically
 * @returns 與 pkg 為同一個物件，且保證具備 IFillPkgHostedInfoFields 欄位
 *          The same object as pkg, guaranteed to carry the IFillPkgHostedInfoFields fields
 *
 * @example
 * fillPkgHostedInfo({ name: 'foo' }, { branch: 'main' });
 */
export function fillPkgHostedInfo<P extends IPackageJson>(pkg: P,
	options?: IFillPkgHostedInfoOptions,
): P & IFillPkgHostedInfoFields
{
	// 早退條件：既非覆寫模式、三個欄位又都齊全時完全不做事，
	// 避免為了「確認沒問題」而白白解析 root 與 Git 資訊（可能觸及檔案系統與 git 指令）。
	//
	// Early exit: when not overwriting and all three fields exist, do nothing at all,
	// avoiding root/git resolution (filesystem and git calls) just to verify what is already there.
	if (options?.overwriteHostedGitInfo || !pkg.homepage || !pkg.bugs || !pkg.repository)
	{
		let { targetDir, rootData, branch, hostedGitInfo } = options ?? {};

		// 以 ??= 依序補齊依賴：rootData → targetDir → hostedGitInfo。
		// 這個順序是刻意的，因為後者都需要前者的結果作為輸入。
		//
		// ??= fills dependencies in order: rootData → targetDir → hostedGitInfo.
		// The order is deliberate because each one needs the previous result as input.
		rootData ??= findRootLazy({
			cwd: targetDir,
		});

		targetDir ??= rootData.pkg;

		hostedGitInfo ??= npmHostedGitInfoLazy(targetDir);

		// hostedGitInfo 可能為空（例如目錄不是 Git repo 或無法辨識的託管平台）；
		// 此時寧可維持原樣也不寫入半套欄位，避免產生殘缺的 package.json。
		//
		// hostedGitInfo may be empty (not a git repo, or an unrecognised host);
		// leaving pkg untouched is better than writing a half-filled manifest.
		hostedGitInfo && _hostedGitInfoToFields(pkg, {
			hostedGitInfo,
			rootData,
			branch,
			targetDir,
			overwriteHostedGitInfo: options?.overwriteHostedGitInfo,
		});
	}

	// 實際欄位已由 _hostedGitInfoToFields 保證，故以 any 回傳維持泛型型別。
	//
	// Fields are guaranteed by _hostedGitInfoToFields, so any is used to keep the generic type.
	return pkg as any
}

/**
 * 預設匯出：多數情境只需直接呼叫 fillPkgHostedInfo，命名匯出主要供進階用法。
 *
 * Default export: most callers just use fillPkgHostedInfo directly; the named export
 * exists mainly for advanced usage.
 */
export default fillPkgHostedInfo
