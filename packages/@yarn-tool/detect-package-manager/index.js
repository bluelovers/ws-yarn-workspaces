"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumPackageManager = void 0;
exports._handleOptionsWhichPackageManagerCore = _handleOptionsWhichPackageManagerCore;
exports.handleOptionsWhichPackageManager = handleOptionsWhichPackageManager;
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
 * which 命令選項配置
 * which command options configuration
 */
const _whichOptions = {
    nothrow: true,
};
/**
 * 核心選項處理函數 - 將輸入轉換為標準選項物件
 * Core options handler function - converts input to standard options object
 *
 * @param returnDefaultOrOptions - 布林值或選項物件 / Boolean or options object
 * @returns 標準選項物件 / Standard options object
 */
function _handleOptionsWhichPackageManagerCore(returnDefaultOrOptions) {
    if (typeof returnDefaultOrOptions === 'boolean') {
        returnDefaultOrOptions = {
            returnDefault: returnDefaultOrOptions,
        };
    }
    return returnDefaultOrOptions !== null && returnDefaultOrOptions !== void 0 ? returnDefaultOrOptions : {};
}
/**
 * 處理套件管理器選項與客戶端列表
 * Handle package manager options and client list
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 / Options input
 * @returns 包含選項與檢查列表的物件 / Object containing options and check list
 */
function handleOptionsWhichPackageManager(npmClients, returnDefaultOrOptions) {
    returnDefaultOrOptions = _handleOptionsWhichPackageManagerCore(returnDefaultOrOptions);
    return {
        options: returnDefaultOrOptions,
        /**
         * 合併使用者指定的優先順序與預設順序
         * Merge user-specified priority with default order
         */
        clientsToCheck: _handleClientsToCheck(npmClients, returnDefaultOrOptions),
    };
}
/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
function _handleClientsToCheck(npmClients, options) {
    /**
     * 合併使用者指定的優先順序與預設順序
     * Merge user-specified priority with default order
     */
    if (npmClients === null || npmClients === void 0 ? void 0 : npmClients.length) {
        // 過濾不合法的名稱
        npmClients = npmClients.filter(v => v === null || v === void 0 ? void 0 : v.length);
        return (options === null || options === void 0 ? void 0 : options.noUseDefaultClients)
            ? [...new Set([...npmClients])]
            : [...new Set([...npmClients, ...defaultClients])];
    }
    return [...defaultClients];
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
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
// @ts-ignore
async function* _whichPackageManagerAsyncGenerator(npmClients, returnDefaultOrOptions) {
    const { clientsToCheck, options } = handleOptionsWhichPackageManager(npmClients, returnDefaultOrOptions);
    yield* _whichAsyncGeneratorCore(clientsToCheck, options);
}
/**
 * 非同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Async generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param options - 選項 / Options
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
async function* _whichAsyncGeneratorCore(clientsToCheck, options) {
    let notFound = true;
    /**
     * 依序檢查每個套件管理器是否可用
     * Check each package manager sequentially for availability
     */
    for (const client of clientsToCheck) {
        const commandPath = await (0, which_1.default)(client, _whichOptions).catch(() => null);
        if (commandPath) {
            yield [client, commandPath];
            notFound = false;
        }
    }
    if (options.returnDefault && notFound)
        return [clientsToCheck[0]];
}
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
async function whichPackageManagerAsync(npmClients, returnDefaultOrOptions) {
    return _whichPackageManagerAsyncGenerator(npmClients, returnDefaultOrOptions).next().then(next => { var _a; return (_a = next.value) === null || _a === void 0 ? void 0 : _a[0]; });
}
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列
 * Sequentially check package managers using which, return all available package managers as array
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
async function whichPackageManagerAsyncAll(npmClients, returnDefaultOrOptions) {
    const result = [];
    for await (const client of _whichPackageManagerAsyncGenerator(npmClients, returnDefaultOrOptions)) {
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
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
// @ts-ignore
function* _whichPackageManagerSyncGenerator(npmClients, returnDefaultOrOptions) {
    const { clientsToCheck, options } = handleOptionsWhichPackageManager(npmClients, returnDefaultOrOptions);
    yield* _whichSyncGeneratorCore(clientsToCheck, options);
}
/**
 * 同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Sync generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param options - 選項 / Options
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
function* _whichSyncGeneratorCore(clientsToCheck, options) {
    let notFound = true;
    /**
     * 依序檢查每個套件管理器是否可用
     * Check each package manager sequentially for availability
     */
    for (const client of clientsToCheck) {
        const commandPath = (0, which_1.sync)(client, _whichOptions);
        if (commandPath) {
            yield [client, commandPath];
            notFound = false;
        }
    }
    if (options.returnDefault && notFound)
        return [clientsToCheck[0]];
}
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列（同步版本）
 * Sequentially check package managers using which, return all available package managers as array (sync version)
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
function whichPackageManagerSyncAll(npmClients, returnDefaultOrOptions) {
    const result = [];
    for (const client of _whichPackageManagerSyncGenerator(npmClients, returnDefaultOrOptions)) {
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
function whichPackageManagerSync(npmClients, returnDefaultOrOptions) {
    var _a;
    return (_a = _whichPackageManagerSyncGenerator(npmClients, returnDefaultOrOptions).next().value) === null || _a === void 0 ? void 0 : _a[0];
}
exports.default = whichPackageManagerSync;
//# sourceMappingURL=index.js.map