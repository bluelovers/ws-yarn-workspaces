"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pnpm = exports.yarn = exports.npm = exports.globalDirectory = void 0;
const tslib_1 = require("tslib");
/**
 * copy from https://github.com/sindresorhus/global-directory/blob/main/index.js
 * but for cjs
 */
const process_1 = tslib_1.__importDefault(require("process"));
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
const ini_1 = require("ini");
;
const isWindows = process_1.default.platform === 'win32';
const untildify = pathWithTilde => pathWithTilde && pathWithTilde.startsWith('~') ? (0, path_1.join)((0, os_1.homedir)(), pathWithTilde.slice(1)) : pathWithTilde;
const readConfigValue = (filePath, key) => {
    if (!filePath) {
        return;
    }
    try {
        return (0, ini_1.parse)((0, fs_1.readFileSync)(filePath, 'utf8'))[key];
    }
    catch { }
};
const getEnvironmentNpmConfigValue = key => {
    const normalizedKey = `npm_config_${key.replaceAll('-', '_')}`.toLowerCase();
    const environmentKey = Object.keys(process_1.default.env).find(name => name.toLowerCase() === normalizedKey);
    return environmentKey ? process_1.default.env[environmentKey] : undefined;
};
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
const npmPrefix = (0, path_1.resolve)(untildify(getNpmPrefix()));
const getYarnHomeDirectory = () => {
    var _a;
    if (((_a = process_1.default.getuid) === null || _a === void 0 ? void 0 : _a.call(process_1.default)) === 0 && !process_1.default.env['FAKEROOTKEY']) {
        return '/usr/local/share';
    }
    return (0, os_1.homedir)();
};
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
 * Get the directory of globally installed packages and binaries
 * Uses the same resolution logic as npm, yarn, and pnpm.
 *
 * @see https://github.com/sindresorhus/global-directory/blob/main/index.js
 */
const globalDirectory = {};
exports.globalDirectory = globalDirectory;
globalDirectory.npm = {};
globalDirectory.npm.prefix = npmPrefix;
globalDirectory.npm.packages = (0, path_1.join)(npmPrefix, isWindows ? 'node_modules' : 'lib/node_modules');
globalDirectory.npm.binaries = isWindows ? npmPrefix : (0, path_1.join)(npmPrefix, 'bin');
const yarnDataDir = (0, path_1.resolve)(getYarnDataDirectory());
globalDirectory.yarn = {};
globalDirectory.yarn.prefix = yarnDataDir;
globalDirectory.yarn.packages = (0, path_1.join)(yarnDataDir, 'global/node_modules');
globalDirectory.yarn.binaries = (0, path_1.join)((0, path_1.resolve)(getYarnBinPrefix()), 'bin');
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