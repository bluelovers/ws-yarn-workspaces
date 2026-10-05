/**
 * 改編自 https://github.com/sindresorhus/global-directory/blob/main/index.js
 * 原始版本為 ESM，此處改寫為 CommonJS (CJS) 以便在本 monorepo 的既有工具鏈中直接引用。
 *
 * Adapted from https://github.com/sindresorhus/global-directory/blob/main/index.js
 * The original is ESM-only; it is rewritten as CommonJS (CJS) so it can be consumed
 * directly by the existing toolchain of this monorepo.
 */
import process from 'process';
import { dirname, join, resolve } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import { parse as iniParse } from 'ini';

/**
 * 單一套件管理器的全局目錄集合，三個欄位皆為已解析為絕對路徑的目錄字串。
 *
 * A set of global directories for a single package manager;
 * every field is an already-resolved absolute directory path.
 */
export interface IGlobalDirectoryEntry
{
	/**
	 * 全局套件安裝目錄，等同於執行 `npm root --global` 的結果。

	 The directory with globally installed packages.

	 Equivalent to `npm root --global`.
	*/
	packages: string;

	/**
	 * 全局可執行檔（Binaries）目錄，等同於執行 `npm bin --global` 的結果。

	 The directory with globally installed binaries.

	 Equivalent to `npm bin --global`.
	*/
	binaries: string;

	/**
	 * 全局前綴（Prefix）目錄，同時作為 packages 與 binaries 的上層目錄；
	 * 一般情境下較常直接使用上面兩個欄位。

	 The directory with directories for packages and binaries. You probably want either of the above.

	 Equivalent to `npm prefix --global`.
	*/
	prefix: string;
};

/**
 * 三種套件管理器（npm / yarn / pnpm）的全局目錄彙整介面。
 * 屬性在模組載入時即以 eager（立即求值）方式解析完成，讀取時不再有 I/O。
 *
 * Aggregated global directories for the three package managers (npm / yarn / pnpm).
 * Properties are resolved eagerly at module load time, so no I/O happens on access.
 */
export interface IGlobalDirectory
{
	/**
	 * 取得 npm 全局套件與可執行檔的目錄。

	 Get the directory of globally installed packages and binaries.

	 @example
	 ```
	 import globalDirectory from 'global-directory';

	 console.log(globalDirectory.npm.prefix);
	 //=> '/usr/local'

	 console.log(globalDirectory.npm.packages);
	 //=> '/usr/local/lib/node_modules'
	 ```
	*/
	npm: IGlobalDirectoryEntry;

	/**
	 * 取得 yarn 全局套件與可執行檔的目錄。

	 Get the directory of globally installed packages and binaries.

	 @example
	 ```
	 import globalDirectory from 'global-directory';

	 console.log(globalDirectory.npm.binaries);
	 //=> '/usr/local/bin'

	 console.log(globalDirectory.yarn.packages);
	 //=> '/Users/sindresorhus/.config/yarn/global/node_modules'
	 ```
	*/
	yarn: IGlobalDirectoryEntry;

	/**
	 * 取得 pnpm 全局套件與可執行檔的目錄。

	 Get the directory of globally installed packages and binaries.

	 @example
	 ```
	 import globalDirectory from 'global-directory';

	 console.log(globalDirectory.pnpm.prefix);
	 //=> '/Users/sindresorhus/Library/pnpm'

	 console.log(globalDirectory.pnpm.packages);
	 //=> '/Users/sindresorhus/Library/pnpm/global/5/node_modules'
	 ```
	*/
	pnpm: IGlobalDirectoryEntry;
}

/**
 * 是否為 Windows 平台。
 * 計算一次並供後續所有分支共用，避免各處重複讀取 `process.platform`。
 *
 * Whether the current platform is Windows.
 * Computed once and shared by every branch below to avoid re-reading `process.platform`.
 */
const isWindows = process.platform === 'win32';

/**
 * 將路徑開頭的 `~` 展開為使用者家目錄（Home Directory）。
 * 其他路徑原樣回傳；`falsy`（空字串、null、undefined）直接回傳，
 * 讓呼叫端可以安全地把設定檔讀值直接傳進來。
 *
 * Expands a leading `~` in a path to the user's home directory.
 * Other paths are returned unchanged; `falsy` values (empty string, null, undefined)
 * are passed through so callers can feed raw config values directly.
 */
const untildify = pathWithTilde => pathWithTilde && pathWithTilde.startsWith('~') ? join(homedir(), pathWithTilde.slice(1)) : pathWithTilde;

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
		return iniParse(readFileSync(filePath, 'utf8'))[key];
	} catch {}
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
	const environmentKey = Object.keys(process.env).find(name => name.toLowerCase() === normalizedKey);
	return environmentKey ? process.env[environmentKey] : undefined;
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
	if (isWindows && process.env['APPDATA']) {
		// Hardcoded contents of `c:\Program Files\nodejs\node_modules\npm\npmrc`
		return join(process.env['APPDATA'], '/npm/etc/npmrc');
	}

	// Homebrew special case: `$(brew --prefix)/lib/node_modules/npm/npmrc`
	if (process.execPath.includes('/Cellar/node')) {
		const homebrewPrefix = process.execPath.slice(0, process.execPath.indexOf('/Cellar/node'));
		return join(homebrewPrefix, '/lib/node_modules/npm/npmrc');
	}

	if (process.execPath.endsWith('/bin/node')) {
		const installDir = dirname(dirname(process.execPath));
		return join(installDir, '/etc/npmrc');
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
		const {APPDATA} = process.env;
		// `c:\node\node.exe` → `prefix=c:\node\`
		return APPDATA ? join(APPDATA, 'npm') : dirname(process.execPath);
	}

	// Homebrew: `/opt/homebrew/Cellar/node/21.0.0/bin/node` → `/opt/homebrew`
	if (process.execPath.includes('/Cellar/node')) {
		return process.execPath.slice(0, process.execPath.indexOf('/Cellar/node'));
	}

	// `/usr/local/bin/node` → `prefix=/usr/local`
	return dirname(dirname(process.execPath));
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

	const homePrefix = readConfigValue(join(homedir(), '.npmrc'), 'prefix');
	if (homePrefix !== undefined) {
		return homePrefix;
	}

	if (process.env['PREFIX']) {
		return process.env['PREFIX'];
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
const npmPrefix = resolve(untildify(getNpmPrefix()));

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
	if (process.getuid?.() === 0 && !process.env['FAKEROOTKEY']) {
		return '/usr/local/share';
	}

	return homedir();
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
		return process.env['LOCALAPPDATA']
			? join(process.env['LOCALAPPDATA'], 'Yarn/Data')
			: join(homedir(), '.config/yarn');
	}

	if (process.env['XDG_DATA_HOME']) {
		return join(process.env['XDG_DATA_HOME'], 'yarn');
	}

	return join(getYarnHomeDirectory(), '.config/yarn');
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
	if (process.env['PREFIX']) {
		return process.env['PREFIX'];
	}

	if (isWindows) {
		return process.env['LOCALAPPDATA']
			? join(process.env['LOCALAPPDATA'], 'Yarn')
			: join(homedir(), '.yarn');
	}

	return `${process.env['DESTDIR'] ?? ''}/usr/local`;
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
const globalDirectory = {} as IGlobalDirectory;

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
globalDirectory.npm = {} as any;
globalDirectory.npm.prefix = npmPrefix;
globalDirectory.npm.packages = join(npmPrefix, isWindows ? 'node_modules' : 'lib/node_modules');
globalDirectory.npm.binaries = isWindows ? npmPrefix : join(npmPrefix, 'bin');

/**
 * yarn 分支：資料目錄與 bin 前綴刻意分開解析（見 `getYarnBinPrefix` 的說明），
 * 因為兩者可被不同的環境變數獨立覆寫。
 *
 * yarn branch: the data directory and the bin prefix are resolved separately
 * (see `getYarnBinPrefix`), because each can be overridden independently
 * by different environment variables.
 */
const yarnDataDir = resolve(getYarnDataDirectory());
globalDirectory.yarn = {} as any;
globalDirectory.yarn.prefix = yarnDataDir;
globalDirectory.yarn.packages = join(yarnDataDir, 'global/node_modules');
globalDirectory.yarn.binaries = join(resolve(getYarnBinPrefix()), 'bin');

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
	if (process.env['PNPM_HOME']) {
		return process.env['PNPM_HOME'];
	}

	if (process.env['XDG_DATA_HOME']) {
		return join(process.env['XDG_DATA_HOME'], 'pnpm');
	}

	if (process.platform === 'darwin') {
		return join(homedir(), 'Library/pnpm');
	}

	if (!isWindows) {
		return join(homedir(), '.local/share/pnpm');
	}

	if (process.env['LOCALAPPDATA']) {
		return join(process.env['LOCALAPPDATA'], 'pnpm');
	}

	return join(homedir(), '.pnpm');
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
	if (process.env['XDG_CONFIG_HOME']) {
		return join(process.env['XDG_CONFIG_HOME'], 'pnpm', 'rc');
	}

	if (isWindows) {
		const localConfigHome = process.env['LOCALAPPDATA'] ?? join(homedir(), 'AppData', 'Local');
		return join(localConfigHome, 'pnpm', 'config', 'rc');
	}

	if (process.platform === 'darwin') {
		return join(homedir(), 'Library', 'Preferences', 'pnpm', 'rc');
	}

	return join(homedir(), '.config', 'pnpm', 'rc');
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
const getPnpmConfigValue = (key: string) => {
	const environmentValue = getEnvironmentNpmConfigValue(key);
	if (environmentValue !== undefined) {
		return environmentValue;
	}

	const pnpmGlobalValue = readConfigValue(getPnpmConfigFilePath(), key);
	if (pnpmGlobalValue !== undefined) {
		return pnpmGlobalValue;
	}

	const homeValue = readConfigValue(join(homedir(), '.npmrc'), key);
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
const pnpmDataDir = resolve(getPnpmDataDirectory());
const pnpmGlobalDir = getPnpmConfigValue('global-dir');
const pnpmGlobalBinDir = getPnpmConfigValue('global-bin-dir');
const resolvedPnpmGlobalDir = resolve(untildify(pnpmGlobalDir ?? join(pnpmDataDir, 'global')));
const resolvedPnpmGlobalBinDir = resolve(untildify(pnpmGlobalBinDir ?? pnpmDataDir));
globalDirectory.pnpm = {} as any;
globalDirectory.pnpm.prefix = pnpmDataDir;
globalDirectory.pnpm.packages = join(resolvedPnpmGlobalDir, '5/node_modules');
globalDirectory.pnpm.binaries = resolvedPnpmGlobalBinDir;

/**
 * 匯出面：
 * - `globalDirectory`（預設與具名）：完整的 npm/yarn/pnpm 目錄集合。
 * - `npm` / `yarn` / `pnpm` 具名匯出：方便只取單一套件管理器的目錄。
 * - `IGlobalDirectory` / `IGlobalDirectoryEntry`：型別定義（type-only，無執行期產出）。
 *
 * Exports:
 * - `globalDirectory` (default & named): the full npm/yarn/pnpm directory set.
 * - `npm` / `yarn` / `pnpm` named exports: convenience for using a single
 *   package manager's directories only.
 * - `IGlobalDirectory` / `IGlobalDirectoryEntry`: type definitions
 *   (type-only, no runtime output).
 */
export { globalDirectory }

export const npm = globalDirectory.npm;
export const yarn = globalDirectory.yarn;
export const pnpm = globalDirectory.pnpm;

export default globalDirectory;
