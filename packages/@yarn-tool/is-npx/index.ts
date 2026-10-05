/**
 * 檢測當前是否在 NPX/YPX 環境中執行
 * Detect if running in NPX/YPX environment
 *
 * @module @yarn-tool/is-npx
 */
// import _isNpx from "is-npx";
import { ITSRequireAtLeastOne } from 'ts-type';

/**
 * NPX 檢測選項介面
 * NPX detection options interface
 */
export interface IOptionsDetectNpx
{
	/** 當前檔案目錄 / Current file directory */
	__dirname: string;
	/**
	 * 環境變數物件 / Environment variables object
	 *
	 * @example
	 * npm_config_user_agent: 'pnpm/10.29.3 npm/? node/v24.13.1 win32 x64',
	 * Path: 'C:\Users\User\AppData\Local\pnpm-cache\dlx\175f9f5d5c7af8761d30dae8a3e20fc64bfa6ca19c3c35b645b6c9c05efb1094\19cb8bf28e2-d784\node_modules\.bin;'
	 * NODE_PATH: 'C:\Users\User\AppData\Local\pnpm-cache\dlx\175f9f5d5c7af8761d30dae8a3e20fc64bfa6ca19c3c35b645b6c9c05efb1094\19cb8bf28e2-d784\node_modules\.pnpm\ts-node@10.9.2_@types+node@25.3.3_typescript@5.9.3\node_modules\ts-node\dist\node_modules;'
	 */
	env: Record<string, string>;
	/**
	 * 命令列參數陣列 / Command line arguments array
	 *
	 * @example
	 * [
	 *   'C:\Users\User\AppData\Local\pnpm-cache\dlx\175f9f5d5c7af8761d30dae8a3e20fc64bfa6ca19c3c35b645b6c9c05efb1094\19cb8bf28e2-d784\node_modules\.pnpm\ts-node@10.9.2_@types+node@25.3.3_typescript@5.9.3\node_modules\ts-node\dist\bin.js',
	 *   'D:\Users\WebstormProjects\nodejs-yarn\ws-ypx\packages\ypx\test\temp2.ts'
	 * ]
	 */
	argv: string[];
}

/**
 * NPX 檢測選項輸入型別（至少需要 __dirname 或 env）
 * NPX detection options input type (requires at least __dirname or env)
 */
export type IOptionsDetectNpxInput = ITSRequireAtLeastOne<IOptionsDetectNpx & {
	/**
	 * 交叉 `Record<any, any>` 將值型別放寬為 `any`，
	 * 讓測試或特殊情境能傳入非純字串的環境變數值
	 * Intersecting `Record<any, any>` widens values to `any`, so tests or
	 * special cases may pass environment variable values that are not plain strings
	 */
	env: Record<any, any>;
}>;

/**
 * 從 `is-npx` 複製的原始檢測函式
 * Original detection function copied from `is-npx`
 *
 * 透過檢查環境變數 `_` 是否以 '/npx' 結尾來判斷
 * Checks if environment variable `_` ends with '/npx'
 *
 * @param {IOptionsDetectNpx} opts - 檢測選項 / Detection options
 * @returns {boolean} 是否在 NPX 環境中 / Whether in NPX environment
 *
 * @deprecated 請使用 {@link isNpx} / Please use {@link isNpx}
 */
export function _isNpx(opts: IOptionsDetectNpx): boolean
{
	/**
	 * `_` 未設定時 optional chaining 回傳 undefined，
	 * `|| false` 將其正規化為布林值以符合回傳型別
	 * When `_` is unset the optional chaining yields undefined;
	 * `|| false` normalizes it to a boolean to match the return type
	 */
	return opts.env['_']?.endsWith('/npx') || false
}

/**
 * 檢查路徑是否包含 NPX/YPX/dlx 特徵
 * Check if path contains NPX/YPX/dlx characteristics
 *
 * 檢查路徑中是否包含以下特徵：
 * - `/ypx_` 或 `\ypx_` - YPX 快取路徑
 * - `_npx` - NPX 路徑標記
 * - `/dlx/` 或 `\dlx\` - PNPM dlx 快取路徑
 *
 * Checks if path contains:
 * - `/ypx_` or `\ypx_` - YPX cache path
 * - `_npx` - NPX path marker
 * - `/dlx/` or `\dlx\` - PNPM dlx cache path
 *
 * @param {string} __dirname - 目錄路徑 / Directory path
 * @returns {boolean} 是否為 NPX 路徑 / Whether it's an NPX path
 */
export function _inNpxPath(__dirname: string): boolean
{
	/**
	 * `/i` 讓 Windows 與 Unix 路徑大小寫差異不影響比對；
	 * `[/\\]` 同時相容兩種路徑分隔符
	 * `/i` keeps path casing differences between Windows and Unix from
	 * affecting the match; `[/\\]` accepts both path separators
	 */
	return /[/\\]ypx_|_npx|[/\\]dlx[/\\]/i.test(__dirname)
}

/**
 * 處理並標準化 NPX 檢測選項
 * Process and normalize NPX detection options
 *
 * 為選項提供預設值：
 * - `__dirname` 預設為空字串
 * - `env` 預設為 `process.env`
 * - `argv` 預設為 `process.argv` 或空陣列
 *
 * Provides default values for options:
 * - `__dirname` defaults to empty string
 * - `env` defaults to `process.env`
 * - `argv` defaults to `process.argv` or empty array
 *
 * @param {IOptionsDetectNpxInput} opts - 輸入選項 / Input options
 * @returns {IOptionsDetectNpx} 標準化後的選項 / Normalized options
 * @throws {RangeError} 當 `__dirname` 為空或 `env` 不存在時拋出 / Thrown when `__dirname` is empty or `env` is missing
 */
export function handleOptionsDetectNpx(opts: IOptionsDetectNpxInput)
{
	/** 僅取出驗證所需的欄位 / Extract only the fields needed for validation */
	let { __dirname, env } = opts;

	/**
	 * 驗證必要參數 / Validate required parameters
	 * `IOptionsDetectNpxInput` 只在型別上保證至少一項，
	 * 執行期仍可能傳入空值，故在此以執行期檢查攔截
	 * `IOptionsDetectNpxInput` only guarantees one field at the type level;
	 * empty values may still arrive at runtime, so the check happens here
	 */
	if (!__dirname?.length && !env)
	{
		throw new RangeError(`__dirname or env is required`)
	}

	/**
	 * 先 shallow copy 再補預設值，
	 * 避免 `??=` 直接改動呼叫端傳入的原始物件
	 * Shallow copy before filling defaults so that `??=`
	 * never mutates the object supplied by the caller
	 */
	opts = {
		...opts,
	};

	/**
	 * 設定預設值 / Set default values
	 * 每項皆以 `??=` 處理，只有 null/undefined 才會被取代，
	 * 呼叫端明確傳入的空字串或空陣列會被保留
	 * Each uses `??=`, so only null/undefined is replaced; explicit empty
	 * strings or arrays from the caller are preserved
	 */
	opts.__dirname ??= '';
	opts.env ??= process?.env ?? {};
	opts.argv ??= process?.argv ?? [];

	return opts as IOptionsDetectNpx;
}

/**
 * 檢測當前是否在 NPX/YPX/dlx 環境中
 * Detect if currently running in NPX/YPX/dlx environment
 *
 * 使用多種策略進行檢測：
 * 1. 檢查 `__dirname` 或 `argv[0]` 是否包含 NPX/YPX/dlx 路徑特徵
 * 2. 檢查環境變數 `PNPM_PACKAGE_NAME` 是否匹配 NPX/YPX 相關名稱
 * 3. 使用原始的 `is-npx` 模組進行檢測
 *
 * Uses multiple strategies for detection:
 * 1. Check if `__dirname` or `argv[0]` contains NPX/YPX/dlx path characteristics
 * 2. Check if environment variable `PNPM_PACKAGE_NAME` matches NPX/YPX related names
 * 3. Use original `is-npx` module for detection
 *
 * @param {IOptionsDetectNpxInput} opts - 檢測選項 / Detection options
 * @returns {boolean} 是否在 NPX/YPX/dlx 環境中 / Whether in NPX/YPX/dlx environment
 */
export function isNpx(opts: IOptionsDetectNpxInput): boolean
{
	/**
	 * 先標準化選項（補上預設值並做執行期驗證），
	 * 再解構出偵測所需的三個欄位，避免後續判斷處理未正規化的輸入
	 * Normalize the options first (fill defaults and run the runtime validation),
	 * then destructure the three fields needed for detection so later checks
	 * never have to deal with an un-normalized input
	 */
	opts = handleOptionsDetectNpx(opts);
	const { __dirname, env, argv } = opts as any as IOptionsDetectNpx;

	/**
	 * 檢查路徑特徵 / Check path characteristics
	 * `argv[0]` 為執行檔路徑，可能與 `__dirname` 不同來源，
	 * `&&` 使 `argv[0]` 為空時略過第二次比對
	 * `argv[0]` is the executable path and may come from a different source
	 * than `__dirname`; `&&` skips the second test when `argv[0]` is empty
	 */
	if (_inNpxPath(__dirname) || argv[0] && _inNpxPath(argv[0]))
	{
		return true
	}

	/**
	 * 檢查 PNPM 套件名稱 / Check PNPM package name
	 * pnpm dlx 執行時會設定 PNPM_PACKAGE_NAME，
	 * 其值需涵蓋 npx/ynpx/ypx 等變體
	 * pnpm dlx sets PNPM_PACKAGE_NAME whose value may be
	 * any of the npx/ynpx/ypx variants
	 */
	if (env['PNPM_PACKAGE_NAME']?.match(/y?yn?px|npx/))
	{
		return true
	}

	/**
	 * 使用原始 is-npx 檢測 / Use original is-npx detection
	 * 作為最後一道判斷：檢查 `_` 環境變數是否指向 npx 執行檔
	 * As the final check: whether the `_` env variable points at the npx executable
	 */
	if (_isNpx(opts as any))
	{
		return true
	}

	/**
	 * 三種策略皆未命中，判定為一般環境
	 * None of the three strategies matched, so this is a normal environment
	 */
	return false
}

/**
 * 預設匯出：isNpx 函式
 * Default export: isNpx function
 */
export default isNpx
