"use strict";
/**
 * @fileoverview Scope JSON Handler - JSON 檔案範圍處理器
 *
 * Provides functionality for managing workspace scope arrays in JSON configuration files.
 * Handles reading, writing, and modifying JSON files like package.json and lerna.json.
 *
 * @module @yarn-tool/ws-scope/format/json
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeJson = void 0;
const fs_extra_1 = require("fs-extra");
const json_object_1 = require("./json-object");
const fs_json_1 = require("@bluelovers/fs-json");
const write_package_json_1 = require("@yarn-tool/write-package-json");
/**
 * JSON file scope handler for workspace configuration
 * JSON 檔案範圍處理器，用於工作區設定
 *
 * @class ScopeJson
 * @extends ScopeJsonObject<K>
 * @template K - The field name key (e.g., 'workspaces' or 'packages')
 * @description
 * Extends ScopeJsonObject to provide JSON-specific file operations.
 * Supports reading JSON files, modifying scope arrays, and saving changes
 * while preserving JSON formatting.
 *
 * @example
 * ```typescript
 * const handler = new ScopeJson<'workspaces'>('/path/to/package.json', {
 *   field: 'workspaces'
 * });
 * handler.loadFileLazy();
 * handler.add('packages/*');
 * handler.saveFile();
 * ```
 */
class ScopeJson extends json_object_1.ScopeJsonObject {
    /**
     * Checks if the JSON file exists on disk
     * 檢查 JSON 檔案是否存在於磁碟上
     *
     * @returns {boolean} True if file exists / 若檔案存在則為 true
     */
    existsFile() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    /**
     * Loads the JSON file content into memory
     * 將 JSON 檔案內容載入記憶體
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
     * @returns {IJsonObject<K>} The parsed JSON object / 解析後的 JSON 物件
     */
    loadFile(reload) {
        if (reload || !this.opened) {
            this.json = (0, fs_json_1.readJSONSync)(this.file);
        }
        return this.json;
    }
    /**
     * Saves the JSON object back to disk
     * 將 JSON 物件儲存回磁碟
     *
     * @description
     * Only saves if the file has been opened (loaded).
     * Uses writePackageJSONSync for proper JSON formatting.
     *
     * 僅在檔案已開啟（已載入）時儲存。
     * 使用 writePackageJSONSync 進行正確的 JSON 格式化。
     *
     * @returns {boolean|undefined} True if saved, undefined if not opened / 若已儲存則為 true，未開啟則為 undefined
     */
    saveFile() {
        return this.opened && (0, write_package_json_1.writePackageJSONSync)(this.file, this.json);
    }
    /**
     * Loads the JSON file only if it exists
     * 僅在檔案存在時載入 JSON 檔案
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
     * @returns {IJsonObject<K>|false} The parsed JSON object or false if file doesn't exist / 解析後的 JSON 物件，或若檔案不存在則為 false
     */
    loadFileLazy(reload) {
        return this.existsFile() && this.loadFile(reload);
    }
}
exports.ScopeJson = ScopeJson;
//# sourceMappingURL=json.js.map