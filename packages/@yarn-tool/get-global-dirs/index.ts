/**
 * copy from https://github.com/sindresorhus/global-directory/blob/main/index.js
 * but for cjs
 */
import process from 'node:process';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { readFileSync } from 'node:fs';
import { parse as iniParse } from 'ini';

export interface IGlobalDirectoryEntry
{
	/**
	The directory with globally installed packages.

	Equivalent to `npm root --global`.
	*/
	packages: string;

	/**
	The directory with globally installed binaries.

	Equivalent to `npm bin --global`.
	*/
	binaries: string;

	/**
	The directory with directories for packages and binaries. You probably want either of the above.

	Equivalent to `npm prefix --global`.
	*/
	prefix: string;
};

export interface IGlobalDirectory
{
	/**
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

const isWindows = process.platform === 'win32';

const untildify = pathWithTilde => pathWithTilde && pathWithTilde.startsWith('~') ? join(homedir(), pathWithTilde.slice(1)) : pathWithTilde;

const readConfigValue = (filePath, key) => {
	if (!filePath) {
		return;
	}

	try {
		return iniParse(readFileSync(filePath, 'utf8'))[key];
	} catch {}
};

const getEnvironmentNpmConfigValue = key => {
	const normalizedKey = `npm_config_${key.replaceAll('-', '_')}`.toLowerCase();
	const environmentKey = Object.keys(process.env).find(name => name.toLowerCase() === normalizedKey);
	return environmentKey ? process.env[environmentKey] : undefined;
};

const getGlobalNpmrc = () => {
	if (isWindows && process.env.APPDATA) {
		// Hardcoded contents of `c:\Program Files\nodejs\node_modules\npm\npmrc`
		return join(process.env.APPDATA, '/npm/etc/npmrc');
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

const getNpmPrefix = () => {
	const environmentPrefix = getEnvironmentNpmConfigValue('prefix');
	if (environmentPrefix !== undefined) {
		return environmentPrefix;
	}

	const homePrefix = readConfigValue(join(homedir(), '.npmrc'), 'prefix');
	if (homePrefix !== undefined) {
		return homePrefix;
	}

	if (process.env.PREFIX) {
		return process.env.PREFIX;
	}

	const globalPrefix = readConfigValue(getGlobalNpmrc(), 'prefix');
	if (globalPrefix !== undefined) {
		return globalPrefix;
	}

	return getDefaultNpmPrefix();
};

const npmPrefix = resolve(untildify(getNpmPrefix()));

const getYarnHomeDirectory = () => {
	if (process.getuid?.() === 0 && !process.env.FAKEROOTKEY) {
		return '/usr/local/share';
	}

	return homedir();
};

const getYarnDataDirectory = () => {
	if (isWindows) {
		return process.env.LOCALAPPDATA
			? join(process.env.LOCALAPPDATA, 'Yarn/Data')
			: join(homedir(), '.config/yarn');
	}

	if (process.env.XDG_DATA_HOME) {
		return join(process.env.XDG_DATA_HOME, 'yarn');
	}

	return join(getYarnHomeDirectory(), '.config/yarn');
};

const getYarnBinPrefix = () => {
	if (process.env.PREFIX) {
		return process.env.PREFIX;
	}

	if (isWindows) {
		return process.env.LOCALAPPDATA
			? join(process.env.LOCALAPPDATA, 'Yarn')
			: join(homedir(), '.yarn');
	}

	return `${process.env.DESTDIR ?? ''}/usr/local`;
};

/**
 * Get the directory of globally installed packages and binaries
 * Uses the same resolution logic as npm, yarn, and pnpm.
 *
 * @see https://github.com/sindresorhus/global-directory/blob/main/index.js
 */
const globalDirectory = {} as IGlobalDirectory;

globalDirectory.npm = {} as any;
globalDirectory.npm.prefix = npmPrefix;
globalDirectory.npm.packages = join(npmPrefix, isWindows ? 'node_modules' : 'lib/node_modules');
globalDirectory.npm.binaries = isWindows ? npmPrefix : join(npmPrefix, 'bin');

const yarnDataDir = resolve(getYarnDataDirectory());
globalDirectory.yarn = {} as any;
globalDirectory.yarn.prefix = yarnDataDir;
globalDirectory.yarn.packages = join(yarnDataDir, 'global/node_modules');
globalDirectory.yarn.binaries = join(resolve(getYarnBinPrefix()), 'bin');

const getPnpmDataDirectory = () => {
	if (process.env.PNPM_HOME) {
		return process.env.PNPM_HOME;
	}

	if (process.env.XDG_DATA_HOME) {
		return join(process.env.XDG_DATA_HOME, 'pnpm');
	}

	if (process.platform === 'darwin') {
		return join(homedir(), 'Library/pnpm');
	}

	if (!isWindows) {
		return join(homedir(), '.local/share/pnpm');
	}

	if (process.env.LOCALAPPDATA) {
		return join(process.env.LOCALAPPDATA, 'pnpm');
	}

	return join(homedir(), '.pnpm');
};

const getPnpmConfigFilePath = () => {
	if (process.env.XDG_CONFIG_HOME) {
		return join(process.env.XDG_CONFIG_HOME, 'pnpm', 'rc');
	}

	if (isWindows) {
		const localConfigHome = process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local');
		return join(localConfigHome, 'pnpm', 'config', 'rc');
	}

	if (process.platform === 'darwin') {
		return join(homedir(), 'Library', 'Preferences', 'pnpm', 'rc');
	}

	return join(homedir(), '.config', 'pnpm', 'rc');
};

const getPnpmConfigValue = key => {
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

const pnpmDataDir = resolve(getPnpmDataDirectory());
const pnpmGlobalDir = getPnpmConfigValue('global-dir');
const pnpmGlobalBinDir = getPnpmConfigValue('global-bin-dir');
const resolvedPnpmGlobalDir = resolve(untildify(pnpmGlobalDir ?? join(pnpmDataDir, 'global')));
const resolvedPnpmGlobalBinDir = resolve(untildify(pnpmGlobalBinDir ?? pnpmDataDir));
globalDirectory.pnpm = {} as any;
globalDirectory.pnpm.prefix = pnpmDataDir;
globalDirectory.pnpm.packages = join(resolvedPnpmGlobalDir, '5/node_modules');
globalDirectory.pnpm.binaries = resolvedPnpmGlobalBinDir;

export default globalDirectory;
