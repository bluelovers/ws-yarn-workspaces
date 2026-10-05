/**
 * @fileoverview Scope JSON Object Base Class - JSON/JSON/YAML
 * 
 * Provides base functionality for managing workspace scope arrays in JSON-like objects.
 * This is the parent class for both JSON and YAML scope handlers.
 * 
 * @module @yarn-tool/ws-scope/format/json-object
 */

import { arrayAdd, arrayRemove } from '../util/arrayAdd';

/**
 * Type definition for JSON object containing workspace scope array
 * 含工作區範圍陣列的 JSON 物件型別
 * 
 * @template K - The field name key (e.g., 'workspaces' or 'packages') / 欄位名稱鍵（例如 'workspaces' 或 'packages'）
 * @description
 * Represents a JSON object structure where the specified field contains
 * an array of workspace scope paths.
 * 代表一種 JSON 物件結構：指定欄位內含工作區範圍路徑陣列。
 * 
 * @example
 * ```typescript
 * // For package.json with workspaces field
 * type PackageJsonWorkspaces = IJsonObject<'workspaces'>;
 * // { workspaces: string[] }
 * 
 * // For lerna.json with packages field
 * type LernaPackages = IJsonObject<'packages'>;
 * // { packages: string[] }
 * ```
 */
export type IJsonObject<K extends string> =
	{
		[p in K]: string[]
	}

/**
 * Base class for managing workspace scope arrays in configuration files
 * 
 * @class ScopeJsonObject
 * @template K - The field name key for the scope array
 * @description
 * Provides common functionality for adding, removing, and tracking changes
 * to workspace scope arrays in JSON-like configuration objects.
 * 
 * This class serves as the foundation for both JSON and YAML scope handlers,
 * offering a unified interface for workspace scope management.
 * 
 * @example
 * ```typescript
 * const scope = new ScopeJsonObject<'workspaces'>('/path/to/package.json', {
 *   field: 'workspaces'
 * });
 * scope.add('packages/*');
 * console.log(scope.changed); // true
 * ```
 */
export class ScopeJsonObject<K extends string = 'workspaces'>
{
	/**
	 * The parsed JSON object containing the scope array
	 * 含範圍陣列的已解析 JSON 物件
	 * 
	 * @type {IJsonObject<K>}
	 */
	json: IJsonObject<K>;

	/**
	 * Flag indicating whether the scope array has been modified
	 * 標示範圍陣列是否已被修改；採累積（不自動歸零），供 save() 決定是否寫檔
	 * Accumulative flag (never auto-reset) indicating whether the scope array
	 * was modified; used by save() to decide whether a write is needed
	 * 
	 * @type {boolean}
	 */
	changed: boolean = false;

	/**
	 * The field name key for the scope array in the JSON object
	 * JSON 物件中範圍陣列所屬的欄位名稱鍵
	 * 
	 * @type {K}
	 */
	field: K;

	/**
	 * Creates a new ScopeJsonObject instance
	 * 建立新的 ScopeJsonObject 實例
	 * 
	 * @constructor
	 * @param {string} file - Path to the configuration file / 設定檔路徑
	 * @param {Object} [options] - Configuration options / 設定選項
	 * @param {K} [options.field] - The field name for scope array / 範圍陣列的欄位名稱
	 */
	constructor(readonly file: string, protected options?: {
		field?: K,
	})
	{
		this._init();
	}

	/**
	 * Initializes the instance with default values
	 * 以預設值初始化實例
	 * 
	 * @protected
	 * @description Sets the field name from options or defaults to 'workspaces' /
	 * 從 options 取得欄位名稱，未提供時預設為 'workspaces'
	 */
	protected _init()
	{
		/**
		 * options 為 protected 可選參數，TS 無法收窄其存在性，故以 @ts-ignore 維持寬鬆賦值
		 * options is an optional protected parameter, so TS cannot narrow its
		 * presence; @ts-ignore keeps the lenient assignment
		 */
		// @ts-ignore
		this.field = this.options?.field ?? 'workspaces';
	}

	/**
	 * Checks if the JSON object has been loaded
	 * 檢查 JSON 物件是否已載入
	 * 
	 * @readonly
	 * @type {boolean}
	 * @returns {boolean} True if JSON object is loaded / 若 JSON 物件已載入則為 true
	 */
	get opened()
	{
		return !!this.json
	}

	/**
	 * Adds a scope path to the array
	 * 將範圍路徑新增至陣列
	 * 
	 * @param {string} scope - Scope path to add / 要新增的範圍路徑
	 * @returns {boolean} True if the array was modified / 若陣列已被修改則為 true
	 */
	add(scope: string)
	{
		let { changed, value } = arrayAdd(scope, this.value);

		this.value = value;
		/**
		 * 以 ||= 累積變更狀態：一旦任何一次新增生效，就必須保留「已變更」結果，
		 * 不能被後續無變動的呼叫覆寫回 false
		 * Accumulate with ||= : once any add took effect, the "changed" result must
		 * persist and must not be overwritten back to false by later no-op calls
		 */
		this.changed ||= changed;

		return this.changed
	}

	/**
	 * Adds a scope path only if the file has been opened
	 * 僅在檔案已載入時新增範圍路徑
	 * 
	 * @param {string} scope - Scope path to add / 要新增的範圍路徑
	 * @returns {boolean|undefined} True if modified, undefined if not opened /
	 * 若已修改則為 true，未載入則為 undefined
	 */
	addLazy(scope: string)
	{
		/**
		 * 設定檔可能不存在（lazy 語意）；對未載入的空殼寫入會憑空建立無效資料，
		 * 因此以 opened 短路略過
		 * The config file may be absent (lazy semantics); writing into an unloaded
		 * shell would fabricate invalid data, so short-circuit on `opened`
		 */
		return this.opened && this.add(scope)
	}

	/**
	 * Removes a scope path from the array
	 * 從陣列移除範圍路徑
	 * 
	 * @param {string} scope - Scope path to remove / 要移除的範圍路徑
	 * @returns {boolean} True if the array was modified / 若陣列已被修改則為 true
	 */
	remove(scope: string)
	{
		/**
		 * 與 addLazy 相同理由：未載入的檔案不做任何修改
		 * Same rationale as addLazy: never modify an unloaded file
		 */
		if (this.opened)
		{
			let { changed, value } = arrayRemove(scope, this.value);

			this.value = value;
			this.changed ||= changed;
		}

		return this.changed
	}

	/**
	 * Removes a scope path only if the file has been opened
	 * 僅在檔案已載入時移除範圍路徑
	 * 
	 * @param {string} scope - Scope path to remove / 要移除的範圍路徑
	 * @returns {boolean|undefined} True if modified, undefined if not opened /
	 * 若已修改則為 true，未載入則為 undefined
	 */
	removeLazy(scope: string)
	{
		return this.opened && this.remove(scope)
	}

	/**
	 * Gets the scope array from the JSON object
	 * 從 JSON 物件取得範圍陣列
	 * 
	 * @readonly
	 * @type {string[] | undefined}
	 * @returns {string[] | undefined} The scope array or undefined if not loaded /
	 * 範圍陣列，未載入時為 undefined
	 */
	get value()
	{
		return this.json?.[this.field]
	}

	/**
	 * Sets the scope array in the JSON object
	 * 設定 JSON 物件中的範圍陣列
	 * 
	 * @param {string[]} value - New scope array value / 新的範圍陣列值
	 */
	set value(value: string[])
	{
		/**
		 * 直接指派而非替換整個 json：讓子類別（如 YAML 的 YAWN parser）
		 * 可在 setter 中攔截變更並保留原有格式
		 * Assign in place instead of replacing the whole json: lets subclasses
		 * (e.g. YAWN parser for YAML) intercept changes in the setter and preserve formatting
		 */
		this.json[this.field] = value;
	}

}
