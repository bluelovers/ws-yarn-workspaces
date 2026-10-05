import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { pathUpToWorkspacesGenerator } from '@yarn-tool/path-parents';
import { resolve, join } from 'upath2';
import { pathExistsSync } from 'fs-extra';

/**
 * 計算 dotenv 檔案清單時的模式選項。
 * 不指定時會自動從 NODE_ENV 推斷，讓大多數呼叫端無需額外設定。
 *
 * Mode options for computing the dotenv file list.
 * Inferred from NODE_ENV when omitted, so most callers need no extra configuration.
 */
export interface IDotenvFilesParams
{
	/** 是否為測試模式；未指定時以 NODE_ENV === 'test' 判斷 / whether it is test mode; defaults to NODE_ENV === 'test' when unspecified */
	isTest?: boolean;
	/** 是否為開發模式（僅在非測試模式生效）/ whether it is development mode (only effective outside test mode) */
	dev?: boolean;
}

/**
 * 依模式計算待載入的 dotenv 檔案清單（依優先順序排列）。
 * 只負責計算不負責載入，方便呼叫端先確認清單再決定是否載入。
 *
 * Computes the ordered list of dotenv files to load (highest priority first).
 * Computes only, without loading, so callers can inspect the list before loading.
 *
 * @param options 模式選項 / mode options
 * @returns isTest、dev、mode 與 dotenvFiles / isTest, dev, mode and dotenvFiles
 */
export function dotEnvFiles(options?: IDotenvFilesParams)
{
	let {
		isTest,
		dev,
	} = options ?? {};

	/**
	 * 未指定 isTest 時回退到 NODE_ENV，與 dotenv/常見工具的慣例一致
	 *
	 * Falls back to NODE_ENV when isTest is unspecified, matching dotenv and common tooling conventions
	 */
	isTest = isTest ?? process.env['NODE_ENV'] === 'test'
	/**
	 * test 優先於 dev：測試期間不應被 development 設定干擾
	 *
	 * test takes precedence over dev: tests must not be affected by development settings
	 */
	const mode = isTest ? 'test' : dev ? 'development' : 'production';

	const dotenvFiles = [
		`.env.${mode}.local`,
		/**
		 * test 環境刻意排除 `.env.local`，確保所有人的測試結果一致
		 *
		 * Don't include `.env.local` for `test` environment
		 * since normally you expect tests to produce the same
		 * results for everyone
		 */
		mode !== 'test' && `.env.local`,
		`.env.${mode}`,
		'.env',
		/**
		 * filter(Boolean) 會移除 mode === 'test' 時的 false 項，故需斷言為 string[]
		 *
		 * filter(Boolean) drops the false entry when mode === 'test', hence the string[] assertion
		 */
	].filter(Boolean) as string[]

	return {
		isTest,
		dev,
		mode,
		dotenvFiles,
	}
}

/**
 * 從 cwd 逐層向上尋找 dotenv 檔並載入（套件主要入口）。
 * 搜尋至工作區根目錄為止；每一層依優先序嘗試，第一個成功載入者即回傳。
 *
 * Walks upward from cwd to locate and load a dotenv file (main entry).
 * Stops at the workspace root; each level tries files by priority and the first successful load wins.
 *
 * @param cwd 起始目錄，預設 process.cwd() / starting directory, defaults to process.cwd()
 * @param options 模式選項 / mode options
 * @returns dotenv 載入結果與 path/cwd/current/fileExists 診斷資訊 / dotenv result plus path/cwd/current/fileExists diagnostics
 */
export function wsEnvConfig<E extends {
	[key: string]: any,
} = typeof process.env>(cwd?: string, options?: IDotenvFilesParams)
{
	/**
	 * 統一 resolve 成絕對路徑，避免相對路徑與向上逐層比對時產生不一致
	 *
	 * Resolve to an absolute path up front to avoid inconsistencies when walking up from a relative path
	 */
	cwd = resolve(cwd ?? process.cwd());
	const files = dotEnvFiles(options).dotenvFiles;

	let ret: DotenvConfigOutput & {
		parsed?: E;
		error?: {
			code?: string,
		};
	};
	/**
	 * path/current 可能在迴圈一次都未執行時仍未賦值，故宣告於迴圈外供最終回傳使用
	 *
	 * path/current may remain unassigned if the loop never runs, so they are declared outside for the final return
	 */
	let current: string;
	let path: string;
	let fileExists: boolean;

	/**
	 * 外層走訪目錄層級、內層依優先序嘗試各檔案；
	 * 兩層巢狀是為了「越靠近 cwd 的層級越優先、同層內越特別的檔越優先」
	 *
	 * The outer loop walks directory levels, the inner tries files by priority;
	 * the nesting enforces "closer to cwd first, more specific file first within a level"
	 */
	for (current of pathUpToWorkspacesGenerator(cwd))
	{
		for (let file of files)
		{
			path = join(current, file);

			/**
			 * 先檢查存在性並回傳，讓呼叫端能區分「檔案不存在」與「解析失敗」
			 *
			 * Check existence and return it so callers can tell "missing file" from "parse failure"
			 */
			fileExists = pathExistsSync(path);

			// @ts-ignore
			ret = config({
				path,
			});

			/**
			 * 無 error 即視為成功載入（dotenv 對不存在的檔案不會回報 error）
			 *
			 * No error means a successful load (dotenv does not report an error for a missing file)
			 */
			if (!ret.error)
			{
				return {
					...ret,
					path,
					cwd,
					current,
					fileExists,
				}
			}
		}
	}

	/**
	 * 所有層級都失敗：以最後一次嘗試的 path/current 回傳，
	 * 讓呼叫端仍能取得錯誤與最後檢查的位置
	 *
	 * All levels failed: return the last attempted path/current so the caller
	 * still gets the error and the last location checked
	 */
	fileExists = pathExistsSync(path);

	return {
		...ret,
		path,
		cwd,
		current,
		fileExists,
	}
}

/**
 * 預設匯出 (Default Export)：wsEnvConfig，便於 `import wsEnvConfig from '@yarn-tool/dotenv'` 直接使用。
 *
 * Default export: wsEnvConfig, for using it directly via `import wsEnvConfig from '@yarn-tool/dotenv'`.
 */
export default wsEnvConfig
