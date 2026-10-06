/**
 * @fileoverview Scope YAML Handler - YAML 範圍處理器
 *
 * Provides functionality for managing workspace scope arrays in YAML configuration files.
 * Handles reading, writing, and modifying YAML files like pnpm-workspace.yaml
 * while preserving original formatting and comments.
 * 提供管理 YAML 設定檔中工作區範圍陣列的功能；
 * 讀取、寫入與修改 pnpm-workspace.yaml 等 YAML 檔時保留原有格式與註解。
 *
 * @module @yarn-tool/ws-scope/format/yaml
 */
import { IJsonObject, ScopeJsonObject } from './json-object';
import YAWN from 'yawn-yaml';
/**
 * Symbol for storing the raw YAWN instance
 *
 * @constant {symbol}
 * @description Used to store the YAWN YAML parser instance privately
 */
declare const SymRaw: unique symbol;
export { SymRaw };
/**
 * YAML file scope handler for workspace configuration
 * 工作區設定的 YAML 檔案範圍處理器
 *
 * @class ScopeYaml
 * @extends ScopeJsonObject<K>
 * @template K - The field name key (default: 'packages') / 欄位名稱鍵（預設：'packages'）
 * @description
 * Extends ScopeJsonObject to provide YAML-specific file operations.
 * Uses YAWN (YAML AST) to preserve original formatting, comments,
 * and structure when modifying YAML files.
 * 繼承 ScopeJsonObject 以提供 YAML 專屬的檔案操作；
 * 透過 YAWN（YAML AST）在修改時保留原有格式、註解與結構。
 *
 * This is particularly useful for pnpm-workspace.yaml files where
 * preserving the original format is important.
 * 這對 pnpm-workspace.yaml 尤其重要，因為保留原始格式是必要需求。
 *
 * @example
 * ```typescript
 * const handler = new ScopeYaml<'packages'>('/path/to/pnpm-workspace.yaml', {
 *   field: 'packages'
 * });
 * handler.loadFileLazy();
 * handler.add('packages/*');
 * handler.saveFile();
 * ```
 */
export declare class ScopeYaml<K extends string = 'packages'> extends ScopeJsonObject<K> {
    /**
     * Internal YAWN instance for YAML parsing and stringification
     * 內部 YAWN 實例，負責 YAML 的解析與字串化
     *
     * @type {YAWN}
     */
    [SymRaw]: YAWN;
    /**
     * Initializes the instance with YAML-specific defaults
     * 以 YAML 專屬預設值初始化實例
     *
     * @protected
     * @override
     * @description Sets the default field name to 'packages' for YAML files /
     * 將 YAML 檔案的預設欄位名稱設為 'packages'
     */
    protected _init(): void;
    /**
     * Gets the JSON representation of the YAML content
     * 取得 YAML 內容的 JSON 表示
     *
     * @override
     * @type {IJsonObject<K>}
     * @returns {IJsonObject<K>} The parsed YAML as JSON object / 解析後作為 JSON 物件的 YAML
     */
    get json(): IJsonObject<K>;
    /**
     * Sets the JSON content and updates the YAML representation
     * 設定 JSON 內容並更新 YAML 表示
     *
     * @override
     * @param {IJsonObject<K>} json - The JSON object to set / 要設定的 JSON 物件
     */
    set json(json: IJsonObject<K>);
    /**
     * Gets the scope array from the YAML content
     * 從 YAML 內容取得範圍陣列
     *
     * @override
     * @type {string[] | undefined}
     * @returns {string[] | undefined} The scope array or undefined / 範圍陣列或 undefined
     */
    get value(): string[];
    /**
     * Sets the scope array in the YAML content
     * 設定 YAML 內容中的範圍陣列
     *
     * @override
     * @param {string[]} value - New scope array value / 新的範圍陣列值
     */
    set value(value: string[]);
    /**
     * Checks if the YAML file exists on disk
     * 檢查 YAML 檔案是否存在於磁碟上
     *
     * @returns {boolean} True if file exists / 若檔案存在則為 true
     */
    existsFile(): boolean;
    /**
     * Checks if the YAML file has been loaded
     * 檢查 YAML 檔案是否已載入
     *
     * @override
     * @readonly
     * @type {boolean}
     * @returns {boolean} True if YAWN instance exists / 若 YAWN 實例存在則為 true
     */
    get opened(): boolean;
    /**
     * Loads the YAML file content into memory
     * 將 YAML 檔案內容載入記憶體
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
     * @returns {IJsonObject<K>} The parsed YAML as JSON object / 解析後作為 JSON 物件的 YAML
     */
    loadFile(reload?: boolean): IJsonObject<K>;
    /**
     * Saves the YAML content back to disk
     * 將 YAML 內容存回磁碟
     *
     * @description
     * Uses YAWN's yaml property to maintain original formatting
     * and comments when writing back to the file.
     * 寫回檔案時使用 YAWN 的 yaml 屬性，以保留原有格式與註解。
     */
    saveFile(): void;
    /**
     * Loads the YAML file only if it exists
     * 僅在檔案存在時載入 YAML 檔案
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
     * @returns {IJsonObject<K>|false} The parsed YAML or false if file doesn't exist / 解析後的 YAML，或若檔案不存在則為 false
     */
    loadFileLazy(reload?: boolean): IJsonObject<K>;
}
