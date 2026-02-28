"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * copy from https://github.com/sindresorhus/global-directory/blob/main/index.js
 * but for cjs
 */
const node_process_1 = tslib_1.__importDefault(require("node:process"));
const node_path_1 = require("node:path");
const node_os_1 = require("node:os");
const node_fs_1 = require("node:fs");
const ini_1 = require("ini");
;
const isWindows = node_process_1.default.platform === 'win32';
const untildify = pathWithTilde => pathWithTilde && pathWithTilde.startsWith('~') ? (0, node_path_1.join)((0, node_os_1.homedir)(), pathWithTilde.slice(1)) : pathWithTilde;
const readConfigValue = (filePath, key) => {
    if (!filePath) {
        return;
    }
    try {
        return (0, ini_1.parse)((0, node_fs_1.readFileSync)(filePath, 'utf8'))[key];
    }
    catch { }
};
const getEnvironmentNpmConfigValue = key => {
    const normalizedKey = `npm_config_${key.replaceAll('-', '_')}`.toLowerCase();
    const environmentKey = Object.keys(node_process_1.default.env).find(name => name.toLowerCase() === normalizedKey);
    return environmentKey ? node_process_1.default.env[environmentKey] : undefined;
};
const getGlobalNpmrc = () => {
    if (isWindows && node_process_1.default.env.APPDATA) {
        // Hardcoded contents of `c:\Program Files\nodejs\node_modules\npm\npmrc`
        return (0, node_path_1.join)(node_process_1.default.env.APPDATA, '/npm/etc/npmrc');
    }
    // Homebrew special case: `$(brew --prefix)/lib/node_modules/npm/npmrc`
    if (node_process_1.default.execPath.includes('/Cellar/node')) {
        const homebrewPrefix = node_process_1.default.execPath.slice(0, node_process_1.default.execPath.indexOf('/Cellar/node'));
        return (0, node_path_1.join)(homebrewPrefix, '/lib/node_modules/npm/npmrc');
    }
    if (node_process_1.default.execPath.endsWith('/bin/node')) {
        const installDir = (0, node_path_1.dirname)((0, node_path_1.dirname)(node_process_1.default.execPath));
        return (0, node_path_1.join)(installDir, '/etc/npmrc');
    }
};
const getDefaultNpmPrefix = () => {
    if (isWindows) {
        const { APPDATA } = node_process_1.default.env;
        // `c:\node\node.exe` → `prefix=c:\node\`
        return APPDATA ? (0, node_path_1.join)(APPDATA, 'npm') : (0, node_path_1.dirname)(node_process_1.default.execPath);
    }
    // Homebrew: `/opt/homebrew/Cellar/node/21.0.0/bin/node` → `/opt/homebrew`
    if (node_process_1.default.execPath.includes('/Cellar/node')) {
        return node_process_1.default.execPath.slice(0, node_process_1.default.execPath.indexOf('/Cellar/node'));
    }
    // `/usr/local/bin/node` → `prefix=/usr/local`
    return (0, node_path_1.dirname)((0, node_path_1.dirname)(node_process_1.default.execPath));
};
const getNpmPrefix = () => {
    const environmentPrefix = getEnvironmentNpmConfigValue('prefix');
    if (environmentPrefix !== undefined) {
        return environmentPrefix;
    }
    const homePrefix = readConfigValue((0, node_path_1.join)((0, node_os_1.homedir)(), '.npmrc'), 'prefix');
    if (homePrefix !== undefined) {
        return homePrefix;
    }
    if (node_process_1.default.env.PREFIX) {
        return node_process_1.default.env.PREFIX;
    }
    const globalPrefix = readConfigValue(getGlobalNpmrc(), 'prefix');
    if (globalPrefix !== undefined) {
        return globalPrefix;
    }
    return getDefaultNpmPrefix();
};
const npmPrefix = (0, node_path_1.resolve)(untildify(getNpmPrefix()));
const getYarnHomeDirectory = () => {
    var _a;
    if (((_a = node_process_1.default.getuid) === null || _a === void 0 ? void 0 : _a.call(node_process_1.default)) === 0 && !node_process_1.default.env.FAKEROOTKEY) {
        return '/usr/local/share';
    }
    return (0, node_os_1.homedir)();
};
const getYarnDataDirectory = () => {
    if (isWindows) {
        return node_process_1.default.env.LOCALAPPDATA
            ? (0, node_path_1.join)(node_process_1.default.env.LOCALAPPDATA, 'Yarn/Data')
            : (0, node_path_1.join)((0, node_os_1.homedir)(), '.config/yarn');
    }
    if (node_process_1.default.env.XDG_DATA_HOME) {
        return (0, node_path_1.join)(node_process_1.default.env.XDG_DATA_HOME, 'yarn');
    }
    return (0, node_path_1.join)(getYarnHomeDirectory(), '.config/yarn');
};
const getYarnBinPrefix = () => {
    var _a;
    if (node_process_1.default.env.PREFIX) {
        return node_process_1.default.env.PREFIX;
    }
    if (isWindows) {
        return node_process_1.default.env.LOCALAPPDATA
            ? (0, node_path_1.join)(node_process_1.default.env.LOCALAPPDATA, 'Yarn')
            : (0, node_path_1.join)((0, node_os_1.homedir)(), '.yarn');
    }
    return `${(_a = node_process_1.default.env.DESTDIR) !== null && _a !== void 0 ? _a : ''}/usr/local`;
};
/**
 * Get the directory of globally installed packages and binaries
 * Uses the same resolution logic as npm, yarn, and pnpm.
 *
 * @see https://github.com/sindresorhus/global-directory/blob/main/index.js
 */
const globalDirectory = {};
globalDirectory.npm = {};
globalDirectory.npm.prefix = npmPrefix;
globalDirectory.npm.packages = (0, node_path_1.join)(npmPrefix, isWindows ? 'node_modules' : 'lib/node_modules');
globalDirectory.npm.binaries = isWindows ? npmPrefix : (0, node_path_1.join)(npmPrefix, 'bin');
const yarnDataDir = (0, node_path_1.resolve)(getYarnDataDirectory());
globalDirectory.yarn = {};
globalDirectory.yarn.prefix = yarnDataDir;
globalDirectory.yarn.packages = (0, node_path_1.join)(yarnDataDir, 'global/node_modules');
globalDirectory.yarn.binaries = (0, node_path_1.join)((0, node_path_1.resolve)(getYarnBinPrefix()), 'bin');
const getPnpmDataDirectory = () => {
    if (node_process_1.default.env.PNPM_HOME) {
        return node_process_1.default.env.PNPM_HOME;
    }
    if (node_process_1.default.env.XDG_DATA_HOME) {
        return (0, node_path_1.join)(node_process_1.default.env.XDG_DATA_HOME, 'pnpm');
    }
    if (node_process_1.default.platform === 'darwin') {
        return (0, node_path_1.join)((0, node_os_1.homedir)(), 'Library/pnpm');
    }
    if (!isWindows) {
        return (0, node_path_1.join)((0, node_os_1.homedir)(), '.local/share/pnpm');
    }
    if (node_process_1.default.env.LOCALAPPDATA) {
        return (0, node_path_1.join)(node_process_1.default.env.LOCALAPPDATA, 'pnpm');
    }
    return (0, node_path_1.join)((0, node_os_1.homedir)(), '.pnpm');
};
const getPnpmConfigFilePath = () => {
    var _a;
    if (node_process_1.default.env.XDG_CONFIG_HOME) {
        return (0, node_path_1.join)(node_process_1.default.env.XDG_CONFIG_HOME, 'pnpm', 'rc');
    }
    if (isWindows) {
        const localConfigHome = (_a = node_process_1.default.env.LOCALAPPDATA) !== null && _a !== void 0 ? _a : (0, node_path_1.join)((0, node_os_1.homedir)(), 'AppData', 'Local');
        return (0, node_path_1.join)(localConfigHome, 'pnpm', 'config', 'rc');
    }
    if (node_process_1.default.platform === 'darwin') {
        return (0, node_path_1.join)((0, node_os_1.homedir)(), 'Library', 'Preferences', 'pnpm', 'rc');
    }
    return (0, node_path_1.join)((0, node_os_1.homedir)(), '.config', 'pnpm', 'rc');
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
    const homeValue = readConfigValue((0, node_path_1.join)((0, node_os_1.homedir)(), '.npmrc'), key);
    if (homeValue !== undefined) {
        return homeValue;
    }
    const globalValue = readConfigValue(getGlobalNpmrc(), key);
    if (globalValue !== undefined) {
        return globalValue;
    }
};
const pnpmDataDir = (0, node_path_1.resolve)(getPnpmDataDirectory());
const pnpmGlobalDir = getPnpmConfigValue('global-dir');
const pnpmGlobalBinDir = getPnpmConfigValue('global-bin-dir');
const resolvedPnpmGlobalDir = (0, node_path_1.resolve)(untildify(pnpmGlobalDir !== null && pnpmGlobalDir !== void 0 ? pnpmGlobalDir : (0, node_path_1.join)(pnpmDataDir, 'global')));
const resolvedPnpmGlobalBinDir = (0, node_path_1.resolve)(untildify(pnpmGlobalBinDir !== null && pnpmGlobalBinDir !== void 0 ? pnpmGlobalBinDir : pnpmDataDir));
globalDirectory.pnpm = {};
globalDirectory.pnpm.prefix = pnpmDataDir;
globalDirectory.pnpm.packages = (0, node_path_1.join)(resolvedPnpmGlobalDir, '5/node_modules');
globalDirectory.pnpm.binaries = resolvedPnpmGlobalBinDir;
exports.default = globalDirectory;
//# sourceMappingURL=index.js.map