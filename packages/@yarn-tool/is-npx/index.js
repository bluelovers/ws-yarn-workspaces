"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isNpx = _isNpx;
exports._inNpxPath = _inNpxPath;
exports.handleOptionsDetectNpx = handleOptionsDetectNpx;
exports.isNpx = isNpx;
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
function _isNpx(opts) {
    var _a;
    return ((_a = opts.env['_']) === null || _a === void 0 ? void 0 : _a.endsWith('/npx')) || false;
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
function _inNpxPath(__dirname) {
    return /[/\\]ypx_|_npx|[/\\]dlx[/\\]/i.test(__dirname);
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
function handleOptionsDetectNpx(opts) {
    var _a, _b, _c, _d, _e;
    let { __dirname, env } = opts;
    // 驗證必要參數 / Validate required parameters
    if (!(__dirname === null || __dirname === void 0 ? void 0 : __dirname.length) && !env) {
        throw new RangeError(`__dirname or env is required`);
    }
    opts = {
        ...opts,
    };
    // 設定預設值 / Set default values
    (_a = opts.__dirname) !== null && _a !== void 0 ? _a : (opts.__dirname = '');
    (_b = opts.env) !== null && _b !== void 0 ? _b : (opts.env = (_c = process === null || process === void 0 ? void 0 : process.env) !== null && _c !== void 0 ? _c : {});
    (_d = opts.argv) !== null && _d !== void 0 ? _d : (opts.argv = (_e = process === null || process === void 0 ? void 0 : process.argv) !== null && _e !== void 0 ? _e : []);
    return opts;
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
function isNpx(opts) {
    var _a;
    opts = handleOptionsDetectNpx(opts);
    const { __dirname, env, argv } = opts;
    // 檢查路徑特徵 / Check path characteristics
    if (_inNpxPath(__dirname) || argv[0] && _inNpxPath(argv[0])) {
        return true;
    }
    // 檢查 PNPM 套件名稱 / Check PNPM package name
    if ((_a = env['PNPM_PACKAGE_NAME']) === null || _a === void 0 ? void 0 : _a.match(/y?yn?px|npx/)) {
        return true;
    }
    // 使用原始 is-npx 檢測 / Use original is-npx detection
    if (_isNpx(opts)) {
        return true;
    }
    return false;
}
/**
 * 預設匯出：isNpx 函式
 * Default export: isNpx function
 */
exports.default = isNpx;
//# sourceMappingURL=index.js.map