"use strict";
/**
 * @fileoverview Workspaces Scope Manager - 管理工作區範圍設定的工作區範圍管理器
 *
 * This module provides functionality to manage workspace scope settings across
 * multiple configuration files (package.json, lerna.json, pnpm-workspace.yaml).
 *
 * 此模組提供管理多個設定檔中的工作區範圍設定的功能。
 *
 * @module @yarn-tool/ws-scope
 * @author bluelovers
 * @license ISC
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesScope = void 0;
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const json_1 = require("./format/json");
const yaml_1 = require("./format/yaml");
const array_hyper_unique_1 = require("array-hyper-unique");
const check_scope_1 = require("./util/check-scope");
const sort_lerna_json_1 = require("@yarn-tool/sort-lerna-json");
/**
 * WorkspacesScope class for managing workspace scope configurations
 * 工作區範圍類別，用於管理工作區範圍設定
 *
 * @class WorkspacesScope
 * @description
 * Manages workspace scope settings across package.json, lerna.json, and pnpm-workspace.yaml.
 * Supports adding, removing, and synchronizing workspace paths.
 *
 * 管理跨 package.json、lerna.json 和 pnpm-workspace.yaml 的工作區範圍設定。
 * 支援新增、移除和同步工作區路徑。
 *
 * @example
 * ```typescript
 * const ws = new WorkspacesScope('/path/to/project');
 * ws.add('packages/new-package/*');
 * ws.save();
 * ```
 */
class WorkspacesScope {
    /**
     * Creates a new WorkspacesScope instance
     * 建立新的 WorkspacesScope 實例
     *
     * @constructor
     * @param {string} [cwd] - Current working directory / 當前工作目錄
     * @throws {Error} Throws if workspace root cannot be found / 若找不到工作區根目錄則拋出錯誤
     */
    constructor(cwd) {
        /**
         * 必須先找到真正的工作區根目錄，且要求根目錄確實含 workspaces 設定，
         * 否則後續三種設定檔的路徑解析都會落在錯誤位置
         * Locate the real workspace root first; the root must actually contain
         * workspaces config, otherwise every path resolved below would be wrong
         */
        this.rootData = (0, find_root_1.findRootLazy)({
            cwd,
            throwError: true,
            shouldHasWorkspaces: true,
        });
        /**
         * 三種設定檔格式各由專屬 handler 負責，對外才會有統一的 add/remove/save 行為
         * Each config format gets a dedicated handler so add/remove/save stay uniform outside
         */
        this._root_package_json = new json_1.ScopeJson(this.resolvePath('package.json'), {
            field: 'workspaces',
        });
        this._root_lerna_json = new json_1.ScopeJson(this.resolvePath('lerna.json'), {
            field: 'packages',
        });
        this._root_pnpm_workspace_yaml = new yaml_1.ScopeYaml(this.resolvePath('pnpm-workspace.yaml'), {
            field: 'packages',
        });
        /**
         * 以 lazy 方式載入：三種設定檔皆非必備，缺檔時保持未載入即可，不應因此拋錯
         * Load lazily: none of the three files is mandatory; a missing file simply
         * stays unloaded and must not throw
         */
        this._root_package_json.loadFileLazy();
        this._root_lerna_json.loadFileLazy();
        this._root_pnpm_workspace_yaml.loadFileLazy();
    }
    /**
     * Checks if any configuration file has been modified
     * 檢查是否有任何設定檔已被修改
     *
     * @readonly
     * @type {boolean}
     * @returns {boolean} True if any file has changed / 若任何檔案已變更則為 true
     */
    get changed() {
        return this._root_package_json.changed || this._root_lerna_json.changed || this._root_pnpm_workspace_yaml.changed;
    }
    /**
     * Resolves a path relative to the workspace root
     * 解析相對於工作區根目錄的路徑
     *
     * @param {...[string, ...string[]]} paths - Path segments to resolve / 要解析的路徑區段
     * @returns {string} Resolved absolute path / 解析後的絕對路徑
     * @throws {SyntaxError} Throws if no paths provided / 若未提供路徑則拋出錯誤
     */
    resolvePath(...paths) {
        /**
         * 型別雖要求至少一個參數，但執行期仍可能收到空 arguments，
         * 提前拋錯比讓 resolve 靜默回傳根目錄更安全
         * The type requires at least one argument, but an empty call can still happen
         * at runtime; failing fast is safer than letting resolve silently return the root
         */
        if (!paths.length) {
            throw new SyntaxError(`Invalid arguments: ${paths}`);
        }
        return (0, upath2_1.resolve)(this.rootData.ws, ...paths);
    }
    /**
     * Adds a workspace scope to all configuration files
     * 將工作區範圍新增至所有設定檔
     *
     * @param {string} scope - Scope path to add / 要新增的範圍路徑
     * @returns {string} The normalized scope path / 標準化後的範圍路徑
     * @throws {Error} Throws if scope path is invalid or outside workspace / 若範圍路徑無效或在工作區外則拋出錯誤
     *
     * @example
     * ```typescript
     * ws.add('my-package');        // Becomes 'packages/my-package/*'
     * ws.add('packages/other/*');  // Used as-is
     * ```
     */
    add(scope) {
        /**
         * 只傳入套件名稱（不含路徑）時，自動補成慣用的 packages/<name>/* 形式，
         * 讓呼叫端不必記住 glob 語法
         * When only a bare package name (no path) is given, normalize it to the
         * conventional packages/<name>/* glob so callers need not remember the syntax
         */
        if (scope === (0, upath2_1.basename)(scope)) {
            scope = `packages/${scope}/*`;
        }
        (0, check_scope_1.assertScopePath)(scope, this.rootData.ws);
        this._root_package_json.addLazy(scope);
        this._root_lerna_json.addLazy(scope);
        this._root_pnpm_workspace_yaml.addLazy(scope);
        return scope;
    }
    /**
     * Removes a workspace scope from all configuration files
     * 從所有設定檔移除工作區範圍
     *
     * @param {string} scope - Scope path to remove / 要移除的範圍路徑
     * @returns {string} The normalized scope path / 標準化後的範圍路徑
     * @throws {Error} Throws if scope path is invalid or outside workspace / 若範圍路徑無效或在工作區外則拋出錯誤
     */
    remove(scope) {
        /**
         * 與 add() 相同的正規化：讓新增與移除可用同一種輸入格式，
         * 否則兩邊對同一輸入會解析出不同路徑而無法正確移除
         * Same normalization as add(): both sides must resolve an identical path,
         * otherwise removing with the same input would miss the entry
         */
        if (scope === (0, upath2_1.basename)(scope)) {
            scope = `packages/${scope}/*`;
        }
        (0, check_scope_1.assertScopePath)(scope, this.rootData.ws);
        this._root_package_json.removeLazy(scope);
        this._root_lerna_json.removeLazy(scope);
        this._root_pnpm_workspace_yaml.removeLazy(scope);
        return scope;
    }
    /**
     * Synchronizes workspace values (deprecated, use syncValue instead)
     * 同步工作區值（已棄用，請改用 syncValue）
     *
     * @deprecated Use syncValue() instead / 請改用 syncValue()
     * @alias syncValue
     * @returns {string[]} Synchronized workspace paths / 同步後的工作區路徑
     */
    sync() {
        return this.syncValue();
    }
    /**
     * Saves all modified configuration files
     * 儲存所有已修改的設定檔
     *
     * @description
     * Writes changes to package.json, lerna.json, and pnpm-workspace.yaml.
     * Also sorts lerna.json if it was opened.
     *
     * 將變更寫入 package.json、lerna.json 和 pnpm-workspace.yaml。
     * 如果 lerna.json 已開啟，也會進行排序。
     */
    save() {
        /**
         * 僅在 lerna.json 確實被載入（存在）時才排序：
         * 未載入時排序一個空物件沒有意義，也可能在寫入階段產生非預期檔案
         * Sort only when lerna.json was actually loaded (exists):
         * sorting an empty object is meaningless and could cause an unwanted file on write
         */
        if (this._root_lerna_json.opened) {
            (0, sort_lerna_json_1.sortLernaJson)(this._root_lerna_json.json);
        }
        this._root_package_json.saveFile();
        this._root_lerna_json.saveFile();
        this._root_pnpm_workspace_yaml.saveFile();
    }
    /**
     * Gets all unique workspace scope values from all configuration files
     * 從所有設定檔取得所有唯一的工作區範圍值
     *
     * @readonly
     * @type {string[]}
     * @returns {string[]} Array of unique workspace scope paths / 唯一工作區範圍路徑陣列
     */
    get value() {
        const value = [
            this._root_package_json.value,
            this._root_lerna_json.value,
            this._root_pnpm_workspace_yaml.value,
        ].flat().filter(v => v === null || v === void 0 ? void 0 : v.length);
        return (0, array_hyper_unique_1.array_unique_overwrite)(value);
    }
    /**
     * Synchronizes workspace scope values across all configuration files
     * 跨所有設定檔同步工作區範圍值
     *
     * @description
     * Collects all workspace paths from all config files, filters out
     * exclusion patterns (starting with !), and ensures all paths are
     * present in all configuration files.
     *
     * 從所有設定檔收集所有工作區路徑，過濾掉排除模式（以 ! 開頭），
     * 並確保所有路徑都存在於所有設定檔中。
     *
     * @returns {string[]} Array of synchronized workspace paths / 同步後的工作區路徑陣列
     */
    syncValue() {
        const value = this.value
            .filter(v => (v === null || v === void 0 ? void 0 : v.length) && !v.startsWith('!'));
        (0, array_hyper_unique_1.array_unique_overwrite)(value);
        /**
         * 逐一回寫至三種設定檔，使原本分散的清單收斂成相同內容
         * Re-add each scope into all three config files so previously
         * divergent lists converge to identical content
         */
        value.forEach(scope => this.add(scope));
        return value;
    }
}
exports.WorkspacesScope = WorkspacesScope;
exports.default = WorkspacesScope;
//# sourceMappingURL=index.js.map