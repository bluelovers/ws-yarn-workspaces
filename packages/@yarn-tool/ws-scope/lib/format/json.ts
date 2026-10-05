/**
 * @fileoverview Scope JSON Handler - JSON 檔案範圍處理器
 * 
 * Provides functionality for managing workspace scope arrays in JSON configuration files.
 * Handles reading, writing, and modifying JSON files like package.json and lerna.json.
 * 
 * @module @yarn-tool/ws-scope/format/json
 */

import { pathExistsSync } from 'fs-extra';
import { ScopeJsonObject } from './json-object';
import { readJSONSync } from '@bluelovers/fs-json';
import { writePackageJSONSync } from '@yarn-tool/write-package-json';

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
export class ScopeJson<K extends string = 'workspaces'> extends ScopeJsonObject<K>
{
	/**
	 * Checks if the JSON file exists on disk
	 * 檢查 JSON 檔案是否存在於磁碟上
	 * 
	 * @returns {boolean} True if file exists / 若檔案存在則為 true
	 */
	existsFile()
	{
		return pathExistsSync(this.file)
	}

	/**
	 * Loads the JSON file content into memory
	 * 將 JSON 檔案內容載入記憶體
	 * 
	 * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
	 * @returns {IJsonObject<K>} The parsed JSON object / 解析後的 JSON 物件
	 */
	loadFile(reload?: boolean)
	{
		/**
		 * 僅在強制重載或尚未載入時讀取：重複 load 會覆寫已變更但未儲存的內容
		 * Read only on forced reload or first load: re-loading would overwrite
		 * content that was modified but not yet saved
		 */
		if (reload || !this.opened)
		{
			this.json = readJSONSync(this.file);
		}

		return this.json
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
	saveFile()
	{
		/**
		 * 以 && 短路：檔案從未載入（不存在）時不建立檔案，
		 * 避免 save() 對不存在的設定檔憑空產生空殼
		 * Short-circuit with &&: never create a file that was never loaded (absent),
		 * so save() cannot fabricate an empty shell config file
		 */
		return this.opened && writePackageJSONSync(this.file, this.json)
	}

	/**
	 * Loads the JSON file only if it exists
	 * 僅在檔案存在時載入 JSON 檔案
	 * 
	 * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
	 * @returns {IJsonObject<K>|false} The parsed JSON object or false if file doesn't exist / 解析後的 JSON 物件，或若檔案不存在則為 false
	 */
	loadFileLazy(reload?: boolean)
	{
		/**
		 * 依賴 existsFile() 先行檢查：readJSONSync 對缺檔會直接拋錯，
		 * 而設定檔缺檔在此情境屬正常情況
		 * Check existence first: readJSONSync throws on a missing file, but a
		 * missing config file is an expected situation here
		 */
		return this.existsFile() && this.loadFile(reload)
	}

}
