"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pnpm = exports.yarn = exports.npm = exports.globalDirectory = void 0;
const tslib_1 = require("tslib");
/**
 * 改編自 https://github.com/sindresorhus/global-directory/blob/main/index.js
 * 原始版本為 ESM，此處改寫為 CommonJS (CJS) 以便在本 monorepo 的既有工具鏈中直接引用。
 *
 * Adapted from https://github.com/sindresorhus/global-directory/blob/main/index.js
 * The original is ESM-only; it is rewritten as CommonJS (CJS) so it can be consumed
 * directly by the existing toolchain of this monorepo.
 */
const process_1 = tslib_1.__importDefault(require("process"));
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
const ini_1 = require("ini");
;
/**
 * 是否為 Windows 平台。
 * 計算一次並供後續所有分支共用，避免各處重複讀取 `process.platform`。
 *
 * Whether the current platform is Windows.
 * Computed once and shared by every branch below to avoid re-reading `process.platform`.
 */
const isWindows = process_1.default.platform === 'win32';
/**
 * 將路徑開頭的 `~` 展開為使用者家目錄（Home Directory）。
 * 其他路徑原樣回傳；`falsy`（空字串、null、undefined）直接回傳，
 * 讓呼叫端可以安全地把設定檔讀值直接傳進來。
 *
 * Expands a leading `~` in a path to the user's home directory.
 * Other paths are returned unchanged; `falsy` values (empty string, null, undefined)
 * are passed through so callers can feed raw config values directly.
 */
const untildify = pathWithTilde => pathWithTilde && pathWithTilde.startsWith('~') ? (0, path_1.join)((0, os_1.homedir)(), pathWithTilde.slice(1)) : pathWithTilde;
/**
 * 讀取指定設定檔中的單一鍵值。
 *
 * 設計上有兩個刻意的寬鬆行為：
 * 1. 檔案路徑為空時直接回傳 `undefined`，避免對不存在的全域 npmrc 發起無謂的 I/O。
 * 2. 解析失敗一律以靜默 catch 吞掉並回傳 `undefined`，因為設定檔損壞不應中斷查詢流程，
 *    調用端本就會依序退回到下一個設定來源。
 *
 * Reads a single key from the given config file.
 *
 * Two intentionally lenient behaviours:
 * 1. An empty path returns `undefined` immediately, avoiding pointless I/O for a missing global npmrc.
 * 2. Any parse/read failure is swallowed silently and yields `undefined`, because a broken config file
 *    must not abort the lookup — callers simply fall back to the next config source.
 */
const readConfigValue = (filePath, key) => {
    if (!filePath) {
        return;
    }
    try {
        return (0, ini_1.parse)((0, fs_1.readFileSync)(filePath, 'utf8'))[key];
    }
    catch { }
};
/**
 * 從環境變數中取得 npm 設定值（`npm_config_<key>`）。
 *
 * 環境變數名稱的大小寫在不同平台與 CI 環境中並不一致（例如 `npm_config_prefix`
 * 與 `NPM_CONFIG_PREFIX`），因此先將所有候選名稱正規化（統一小寫、連字號換底線）
 * 再比對，才能跨平台找到同一個變數。
 *
 * Reads an npm config value (`npm_config_<key>`) from the environment.
 *
 * Env var casing differs across platforms and CI systems (e.g. `npm_config_prefix`
 * vs `NPM_CONFIG_PREFIX`), so candidate names are normalized (lowercased, hyphens to
 * underscores) before comparison to find the same variable everywhere.
 */
const getEnvironmentNpmConfigValue = key => {
    const normalizedKey = `npm_config_${key.replaceAll('-', '_')}`.toLowerCase();
    const environmentKey = Object.keys(process_1.default.env).find(name => name.toLowerCase() === normalizedKey);
    return environmentKey ? process_1.default.env[environmentKey] : undefined;
};
/**
 * 推導「全域 npmrc」的路徑，回傳 `undefined` 表示找不到（例如 Linux 一般安裝）。
 *
 * 三種安裝型態的預設位置皆不同，依序判斷：
 * - Windows：npmrc 隨 npm 安裝在 `%APPDATA%` 下。
 * - Homebrew（macOS）：node 位於 `Cellar` 中，npmrc 必須回推 brew 前綴才能找到。
 * - 一般 Unix：由 `process.execPath` 往上兩層推導安裝目錄下的 `etc/npmrc`。
 *
 * Locates the "global" npmrc, returning `undefined` when it cannot be found
 * (e.g. a typical Linux install).
 *
 * The default location differs per install type, checked in order:
 * - Windows: the npmrc ships under `%APPDATA%` with npm.
 * - Homebrew (macOS): node lives inside `Cellar`, so the brew prefix must be recovered first.
 * - Plain Unix: derive the install dir from `process.execPath` and use its `etc/npmrc`.
 */
const getGlobalNpmrc = () => {
    if (isWindows && process_1.default.env['APPDATA']) {
        // Hardcoded contents of `c:\Program Files\nodejs\node_modules\npm\npmrc`
        return (0, path_1.join)(process_1.default.env['APPDATA'], '/npm/etc/npmrc');
    }
    // Homebrew special case: `$(brew --prefix)/lib/node_modules/npm/npmrc`
    if (process_1.default.execPath.includes('/Cellar/node')) {
        const homebrewPrefix = process_1.default.execPath.slice(0, process_1.default.execPath.indexOf('/Cellar/node'));
        return (0, path_1.join)(homebrewPrefix, '/lib/node_modules/npm/npmrc');
    }
    if (process_1.default.execPath.endsWith('/bin/node')) {
        const installDir = (0, path_1.dirname)((0, path_1.dirname)(process_1.default.execPath));
        return (0, path_1.join)(installDir, '/etc/npmrc');
    }
};
/**
 * 推導 npm 的預設全局前綴（Global Prefix）。
 *
 * 當環境變數與各層 npmrc 都沒有設定 `prefix` 時才會用到，因此以 `process.execPath`
 * 的位置反推安裝目錄是最後一道合理的猜測：
 * - Windows：`c:\node\node.exe` → `c:\node\`（有 `APPDATA` 時改用 `%APPDATA%/npm`）。
 * - Homebrew：node 位於 `Cellar/node/<ver>/bin/node`，前綴即為 Cellar 的上層。
 * - 一般 Unix：`/usr/local/bin/node` → `/usr/local`。
 *
 * Derives npm's default global prefix.
 *
 * Used only when neither env vars nor any npmrc layer sets `prefix`; inferring the
 * install directory from `process.execPath` is the last reasonable guess:
 * - Windows: `c:\node\node.exe` → `c:\node\` (or `%APPDATA%/npm` when `APPDATA` exists).
 * - Homebrew: node sits at `Cellar/node/<ver>/bin/node`, so the prefix is above Cellar.
 * - Plain Unix: `/usr/local/bin/node` → `/usr/local`.
 */
const getDefaultNpmPrefix = () => {
    if (isWindows) {
        const { APPDATA } = process_1.default.env;
        // `c:\node\node.exe` → `prefix=c:\node\`
        return APPDATA ? (0, path_1.join)(APPDATA, 'npm') : (0, path_1.dirname)(process_1.default.execPath);
    }
    // Homebrew: `/opt/homebrew/Cellar/node/21.0.0/bin/node` → `/opt/homebrew`
    if (process_1.default.execPath.includes('/Cellar/node')) {
        return process_1.default.execPath.slice(0, process_1.default.execPath.indexOf('/Cellar/node'));
    }
    // `/usr/local/bin/node` → `prefix=/usr/local`
    return (0, path_1.dirname)((0, path_1.dirname)(process_1.default.execPath));
};
/**
 * 依序解析 npm 的全局前綴，回傳的第一個定義值即為最終結果。
 *
 * 優先順序（由高至低）刻意對齊 npm 自身的設定優先級：
 * 1. `npm_config_prefix` 環境變數（CI 與 script 最常覆寫的方式）
 * 2. 使用者 `~/.npmrc`
 * 3. `PREFIX` 環境變數（非 npm 官方慣例，但許多安裝腳本會使用）
 * 4. 全域 npmrc
 * 5. 由 `process.execPath` 推導的預設值
 *
 * 使用 `!== undefined` 而非真值判斷，是為了讓空字串等「已設定但 falsy」的值
 * 也能被視為有效覆寫，不致被誤判為未設定。
 *
 * Resolves npm's global prefix in order; the first defined value wins.
 *
 * The priority deliberately mirrors npm's own config precedence:
 * 1. `npm_config_prefix` env var (the usual override in CI and scripts)
 * 2. user `~/.npmrc`
 * 3. `PREFIX` env var (not an npm convention, but used by many install scripts)
 * 4. the global npmrc
 * 5. the default inferred from `process.execPath`
 *
 * `!== undefined` is used instead of a truthy check so that defined-but-falsy values
 * (e.g. an empty string) count as a real override instead of "unset".
 */
const getNpmPrefix = () => {
    const environmentPrefix = getEnvironmentNpmConfigValue('prefix');
    if (environmentPrefix !== undefined) {
        return environmentPrefix;
    }
    const homePrefix = readConfigValue((0, path_1.join)((0, os_1.homedir)(), '.npmrc'), 'prefix');
    if (homePrefix !== undefined) {
        return homePrefix;
    }
    if (process_1.default.env['PREFIX']) {
        return process_1.default.env['PREFIX'];
    }
    const globalPrefix = readConfigValue(getGlobalNpmrc(), 'prefix');
    if (globalPrefix !== undefined) {
        return globalPrefix;
    }
    return getDefaultNpmPrefix();
};
/**
 * 模組載入時即解析完成的 npm 全局前綴（絕對路徑）。
 * 放在模組層級是刻意的：整份檔案只解析一次，後續所有 npm 相關路徑皆由此衍生。
 *
 * The npm global prefix (absolute path), resolved once at module load time.
 * Keeping it at module level is intentional: resolved once per process, with every
 * other npm path derived from it.
 */
const npmPrefix = (0, path_1.resolve)(untildify(getNpmPrefix()));
/**
 * 取得 yarn 的家目錄基準點。
 *
 * 以 root 身分執行時（`uid === 0`）不能沿用 `/root`，否則會產生 root 專屬路徑；
 * 此時改用系統層級的 `/usr/local/share`。`FAKEROOTKEY` 存在代表正處於 fakeroot
 * 沙箱中，此時的 uid 是模擬出來的，必須略過此特殊處理以免容器/測試環境行為不一致。
 *
 * Gets the base home directory used by yarn.
 *
 * When running as root (`uid === 0`) reusing `/root` would yield root-only paths,
 * so the system-wide `/usr/local/share` is used instead. A present `FAKEROOTKEY`
 * means we are inside a fakeroot sandbox where the uid is faked, so the special case
 * must be skipped to keep container/test environments consistent.
 */
const getYarnHomeDirectory = () => {
    var _a;
    if (((_a = process_1.default.getuid) === null || _a === void 0 ? void 0 : _a.call(process_1.default)) === 0 && !process_1.default.env['FAKEROOTKEY']) {
        return '/usr/local/share';
    }
    return (0, os_1.homedir)();
};
/**
 * 解析 yarn 的資料目錄（Data Directory），優先採用各平台的慣例位置：
 * - Windows：`%LOCALAPPDATA%/Yarn/Data`，未設定時退回類 Unix 的 `.config/yarn`。
 * - 設定 `XDG_DATA_HOME` 時遵循 XDG 規範。
 * - 其餘：`<yarn home>/.config/yarn`。
 *
 * Resolves yarn's data directory, preferring each platform's conventional location:
 * - Honors `XDG_DATA_HOME` when set (XDG spec).
 * - Otherwise: `<yarn home>/.config/yarn`.
 */
const getYarnDataDirectory = () => {
    if (isWindows) {
        return process_1.default.env['LOCALAPPDATA']
            ? (0, path_1.join)(process_1.default.env['LOCALAPPDATA'], 'Yarn/Data')
            : (0, path_1.join)((0, os_1.homedir)(), '.config/yarn');
    }
    if (process_1.default.env['XDG_DATA_HOME']) {
        return (0, path_1.join)(process_1.default.env['XDG_DATA_HOME'], 'yarn');
    }
    return (0, path_1.join)(getYarnHomeDirectory(), '.config/yarn');
};
/**
 * 解析 yarn 全局可執行檔的前綴（其下會再接 `bin`）。
 *
 * 注意此處刻意與資料目錄分開處理：`PREFIX` 是建置/安裝腳本最常覆寫的值，
 * 即使資料目錄走 XDG 路徑，bin 前綴仍可能被獨立指定。
 *
 * Resolves the prefix for yarn's global binaries (`bin` is appended by the caller).
 *
 * Deliberately kept separate from the data directory: `PREFIX` is the value most
 * install/build scripts override, so the bin prefix may be specified independently
 * even when the data directory follows the XDG path.
 */
const getYarnBinPrefix = () => {
    var _a;
    if (process_1.default.env['PREFIX']) {
        return process_1.default.env['PREFIX'];
    }
    if (isWindows) {
        return process_1.default.env['LOCALAPPDATA']
            ? (0, path_1.join)(process_1.default.env['LOCALAPPDATA'], 'Yarn')
            : (0, path_1.join)((0, os_1.homedir)(), '.yarn');
    }
    return `${(_a = process_1.default.env['DESTDIR']) !== null && _a !== void 0 ? _a : ''}/usr/local`;
};
/**
 * 取得全域安裝的套件與可執行檔目錄。
 * 沿用與 npm、yarn、pnpm 相同的解析邏輯，於模組載入時一次性建立。
 *
 * Get the directory of globally installed packages and binaries.
 * Uses the same resolution logic as npm, yarn, and pnpm,
 * built once eagerly when the module is loaded.
 *
 * @see https://github.com/sindresorhus/global-directory/blob/main/index.js
 */
const globalDirectory = {};
exports.globalDirectory = globalDirectory;
/**
 * npm 分支：所有路徑皆由先前解析出的 `npmPrefix` 衍生。
 * Windows 的套件與 bin 直接放在前綴下（無 `lib/` 與 `bin/` 層級），
 * 與 Unix 的 `lib/node_modules` + `bin` 結構不同，故需以平台分支組路徑。
 *
 * npm branch: every path is derived from the previously resolved `npmPrefix`.
 * On Windows packages and binaries live directly under the prefix (no `lib/`
 * or `bin/` level), unlike Unix's `lib/node_modules` + `bin` layout,
 * hence the platform-dependent path composition.
 */
globalDirectory.npm = {};
globalDirectory.npm.prefix = npmPrefix;
globalDirectory.npm.packages = (0, path_1.join)(npmPrefix, isWindows ? 'node_modules' : 'lib/node_modules');
globalDirectory.npm.binaries = isWindows ? npmPrefix : (0, path_1.join)(npmPrefix, 'bin');
/**
 * yarn 分支：資料目錄與 bin 前綴刻意分開解析（見 `getYarnBinPrefix` 的說明），
 * 因為兩者可被不同的環境變數獨立覆寫。
 *
 * yarn branch: the data directory and the bin prefix are resolved separately
 * (see `getYarnBinPrefix`), because each can be overridden independently
 * by different environment variables.
 */
const yarnDataDir = (0, path_1.resolve)(getYarnDataDirectory());
globalDirectory.yarn = {};
globalDirectory.yarn.prefix = yarnDataDir;
globalDirectory.yarn.packages = (0, path_1.join)(yarnDataDir, 'global/node_modules');
globalDirectory.yarn.binaries = (0, path_1.join)((0, path_1.resolve)(getYarnBinPrefix()), 'bin');
/**
 * 解析 pnpm 的資料目錄（Data Directory），依序檢查：
 * 1. `PNPM_HOME`：pnpm 官方建議的覆寫方式，優先度最高。
 * 2. `XDG_DATA_HOME`：遵循 XDG 規範的 Linux 環境。
 * 3. macOS / Linux 的平台慣例位置。
 * 4. Windows 的 `%LOCALAPPDATA%/pnpm`，最後退回 `~/.pnpm`。
 *
 * 此順序刻意讓「使用者明確設定」贏過「平台預設值」，
 * 避免平台慣例蓋掉使用者的自訂路徑。
 *
 * Resolves pnpm's data directory by checking, in order:
 * 1. `PNPM_HOME`: the officially recommended override, highest priority.
 * 2. `XDG_DATA_HOME`: XDG-compliant Linux environments.
 * 3. Platform-conventional locations on macOS / Linux.
 * 4. Windows `%LOCALAPPDATA%/pnpm`, falling back to `~/.pnpm`.
 *
 * The order deliberately lets "explicit user settings" win over
 * "platform defaults" so conventions never shadow a user's custom path.
 */
const getPnpmDataDirectory = () => {
    if (process_1.default.env['PNPM_HOME']) {
        return process_1.default.env['PNPM_HOME'];
    }
    if (process_1.default.env['XDG_DATA_HOME']) {
        return (0, path_1.join)(process_1.default.env['XDG_DATA_HOME'], 'pnpm');
    }
    if (process_1.default.platform === 'darwin') {
        return (0, path_1.join)((0, os_1.homedir)(), 'Library/pnpm');
    }
    if (!isWindows) {
        return (0, path_1.join)((0, os_1.homedir)(), '.local/share/pnpm');
    }
    if (process_1.default.env['LOCALAPPDATA']) {
        return (0, path_1.join)(process_1.default.env['LOCALAPPDATA'], 'pnpm');
    }
    return (0, path_1.join)((0, os_1.homedir)(), '.pnpm');
};
/**
 * 推導 pnpm 設定檔（`rc` 格式）的路徑。
 *
 * 各平台的 XDG 規範實作不同：Linux 遵循 `XDG_CONFIG_HOME`、
 * macOS 使用 `~/Library/Preferences`、Windows 使用 `%LOCALAPPDATA%`，
 * 故依序判斷平台後退回通用的 `~/.config/pnpm/rc`。
 * 注意：目前僅支援 `rc` 格式，尚未支援 pnpm 新版的 `config.yaml`。
 *
 * Derives the path of pnpm's config file (`rc` format).
 *
 * Each platform implements XDG differently: Linux honors `XDG_CONFIG_HOME`,
 * macOS uses `~/Library/Preferences`, Windows uses `%LOCALAPPDATA%`,
 * so the platform is checked in order before falling back to the generic
 * `~/.config/pnpm/rc`. Note: only the `rc` format is supported for now —
 * pnpm's newer `config.yaml` is not yet handled.
 */
const getPnpmConfigFilePath = () => {
    var _a;
    if (process_1.default.env['XDG_CONFIG_HOME']) {
        return (0, path_1.join)(process_1.default.env['XDG_CONFIG_HOME'], 'pnpm', 'rc');
    }
    if (isWindows) {
        const localConfigHome = (_a = process_1.default.env['LOCALAPPDATA']) !== null && _a !== void 0 ? _a : (0, path_1.join)((0, os_1.homedir)(), 'AppData', 'Local');
        return (0, path_1.join)(localConfigHome, 'pnpm', 'config', 'rc');
    }
    if (process_1.default.platform === 'darwin') {
        return (0, path_1.join)((0, os_1.homedir)(), 'Library', 'Preferences', 'pnpm', 'rc');
    }
    return (0, path_1.join)((0, os_1.homedir)(), '.config', 'pnpm', 'rc');
};
/**
 * 依優先順序讀取 pnpm 的單一設定值，回傳的第一個定義值即為最終結果。
 *
 * 來源順序刻意與 npm 前綴的解析一致（見 `getNpmPrefix`）：
 * 環境變數 → pnpm 自身設定檔 → 使用者 `~/.npmrc` → 全域 npmrc。
 * 全部未定義時回傳 `undefined`，交由呼叫端決定預設值（見下方 pnpm 組裝區塊）。
 *
 * Reads a single pnpm config value with fallback precedence;
 * the first defined value wins.
 *
 * The source order deliberately matches npm prefix resolution (see `getNpmPrefix`):
 * env var → pnpm's own config file → user `~/.npmrc` → global npmrc.
 * Returns `undefined` when nothing is defined, letting the caller supply the
 * default (see the pnpm assembly block below).
 */
const getPnpmConfigValue = (key) => {
    const environmentValue = getEnvironmentNpmConfigValue(key);
    if (environmentValue !== undefined) {
        return environmentValue;
    }
    const pnpmGlobalValue = readConfigValue(getPnpmConfigFilePath(), key);
    if (pnpmGlobalValue !== undefined) {
        return pnpmGlobalValue;
    }
    const homeValue = readConfigValue((0, path_1.join)((0, os_1.homedir)(), '.npmrc'), key);
    if (homeValue !== undefined) {
        return homeValue;
    }
    const globalValue = readConfigValue(getGlobalNpmrc(), key);
    if (globalValue !== undefined) {
        return globalValue;
    }
};
/**
 * pnpm 分支的組裝區塊。
 *
 * `global-dir` / `global-bin-dir` 可由設定檔指定，未設定時才退回
 * `<pnpm data dir>/global` 與 `<pnpm data dir>`；兩者皆先經 `untildify`
 * 展開 `~` 再 `resolve`，確保回傳值一律是絕對路徑。
 * `5/node_modules` 是目前 pnpm 全局套件的版本化 store 子目錄。
 *
 * Assembly block for the pnpm branch.
 *
 * `global-dir` / `global-bin-dir` may come from config files; when unset they
 * fall back to `<pnpm data dir>/global` and `<pnpm data dir>`. Both are passed
 * through `untildify` and then `resolve` so the returned values are always
 * absolute paths. `5/node_modules` is the versioned store subdirectory that
 * pnpm currently uses for global packages.
 */
const pnpmDataDir = (0, path_1.resolve)(getPnpmDataDirectory());
const pnpmGlobalDir = getPnpmConfigValue('global-dir');
const pnpmGlobalBinDir = getPnpmConfigValue('global-bin-dir');
const resolvedPnpmGlobalDir = (0, path_1.resolve)(untildify(pnpmGlobalDir !== null && pnpmGlobalDir !== void 0 ? pnpmGlobalDir : (0, path_1.join)(pnpmDataDir, 'global')));
const resolvedPnpmGlobalBinDir = (0, path_1.resolve)(untildify(pnpmGlobalBinDir !== null && pnpmGlobalBinDir !== void 0 ? pnpmGlobalBinDir : pnpmDataDir));
globalDirectory.pnpm = {};
globalDirectory.pnpm.prefix = pnpmDataDir;
globalDirectory.pnpm.packages = (0, path_1.join)(resolvedPnpmGlobalDir, '5/node_modules');
globalDirectory.pnpm.binaries = resolvedPnpmGlobalBinDir;
exports.npm = globalDirectory.npm;
exports.yarn = globalDirectory.yarn;
exports.pnpm = globalDirectory.pnpm;
exports.default = globalDirectory;
//# sourceMappingURL=index.js.map