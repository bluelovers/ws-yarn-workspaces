"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumPackageManager = void 0;
exports._handleClientsToCheck = _handleClientsToCheck;
exports._whichPackageManagerAsyncGenerator = _whichPackageManagerAsyncGenerator;
exports._whichAsyncGeneratorCore = _whichAsyncGeneratorCore;
exports.whichPackageManagerAsync = whichPackageManagerAsync;
exports.whichPackageManagerAsyncAll = whichPackageManagerAsyncAll;
exports._whichPackageManagerSyncGenerator = _whichPackageManagerSyncGenerator;
exports._whichSyncGeneratorCore = _whichSyncGeneratorCore;
exports.whichPackageManagerSyncAll = whichPackageManagerSyncAll;
exports.whichPackageManagerSync = whichPackageManagerSync;
const tslib_1 = require("tslib");
const which_1 = tslib_1.__importStar(require("which"));
/**
 * 支援的套件管理器類型
 * Supported package manager types
 */
var EnumPackageManager;
(function (EnumPackageManager) {
    EnumPackageManager["yarn"] = "yarn";
    EnumPackageManager["npm"] = "npm";
    EnumPackageManager["pnpm"] = "pnpm";
})(EnumPackageManager || (exports.EnumPackageManager = EnumPackageManager = {}));
;
/**
 * 預設的套件管理器優先順序
 * Default package manager priority order
 */
const defaultClients = ["pnpm" /* EnumPackageManager.pnpm */, "yarn" /* EnumPackageManager.yarn */, "npm" /* EnumPackageManager.npm */];
/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
function _handleClientsToCheck(npmClients) {
    return (npmClients === null || npmClients === void 0 ? void 0 : npmClients.length)
        ? [...new Set([...npmClients, ...defaultClients])]
        : defaultClients;
}
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
/**
 * 非同步生成器 - 使用 which 依序檢查套件管理器列表
 * Async generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
async function* _whichPackageManagerAsyncGenerator(npmClients, returnDefault) {
    /**
     * 合併使用者指定的優先順序與預設順序
     * Merge user-specified priority with default order
     */
    const clientsToCheck = _handleClientsToCheck(npmClients);
    return _whichAsyncGeneratorCore(clientsToCheck, returnDefault);
}
/**
 * 非同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Async generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
async function* _whichAsyncGeneratorCore(clientsToCheck, returnDefault) {
    let notFound = true;
    /**
     * 依序檢查每個套件管理器是否可用
     * Check each package manager sequentially for availability
     */
    for (const client of clientsToCheck) {
        const commandPath = await (0, which_1.default)(client).catch(() => null);
        if (commandPath) {
            yield [client, commandPath];
            notFound = false;
        }
    }
    if (returnDefault && notFound)
        return [clientsToCheck[0]];
}
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
function whichPackageManagerAsync(npmClients, returnDefault) {
    return _whichPackageManagerAsyncGenerator(npmClients, returnDefault).next().then(next => { var _a; return (_a = next.value) === null || _a === void 0 ? void 0 : _a[0]; });
}
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列
 * Sequentially check package managers using which, return all available package managers as array
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
async function whichPackageManagerAsyncAll(npmClients, returnDefault) {
    const result = [];
    for await (const client of _whichPackageManagerAsyncGenerator(npmClients, returnDefault)) {
        result.push(client[0]);
    }
    return result;
}
/**
 * 使用 which 依序檢查套件管理器列表，以同步生成器方式 yield 所有可用的套件管理器
 * Sequentially check package managers using which, yield all available package managers via sync generator
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器（透過 yield）/ Available package manager (via yield)
 */
/**
 * 同步生成器 - 使用 which 依序檢查套件管理器列表
 * Sync generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
function* _whichPackageManagerSyncGenerator(npmClients, returnDefault) {
    /**
     * 合併使用者指定的優先順序與預設順序
     * Merge user-specified priority with default order
     */
    const clientsToCheck = _handleClientsToCheck(npmClients);
    return _whichSyncGeneratorCore(clientsToCheck, returnDefault);
}
/**
 * 同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Sync generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
function* _whichSyncGeneratorCore(clientsToCheck, returnDefault) {
    let notFound = true;
    /**
     * 依序檢查每個套件管理器是否可用
     * Check each package manager sequentially for availability
     */
    for (const client of clientsToCheck) {
        const commandPath = (0, which_1.sync)(client);
        if (commandPath) {
            yield [client, commandPath];
            notFound = false;
        }
    }
    if (returnDefault && notFound)
        return [clientsToCheck[0]];
}
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列（同步版本）
 * Sequentially check package managers using which, return all available package managers as array (sync version)
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
function whichPackageManagerSyncAll(npmClients, returnDefault) {
    const result = [];
    for (const client of _whichPackageManagerSyncGenerator(npmClients, returnDefault)) {
        result.push(client[0]);
    }
    return result;
}
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
function whichPackageManagerSync(npmClients, returnDefault) {
    var _a;
    return (_a = _whichPackageManagerSyncGenerator(npmClients, returnDefault).next().value) === null || _a === void 0 ? void 0 : _a[0];
}
exports.default = whichPackageManagerSync;
//# sourceMappingURL=index.js.map