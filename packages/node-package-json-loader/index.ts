/**
 * npm-package-json-loader
 *
 * 用於載入、處理和寫入 package.json 的工具類別
 * Utility class for loading, processing, and writing package.json
 *
 * 支援自動修復、排序與驗證功能
 * Supports auto-fix, sorting, and verification features
 */
import { pathExistsSync, writeFileSync } from 'fs-extra';
import { sortPackageJson } from 'sort-package-json3';
import bind from 'bind-decorator';
import path from 'path';
import { IPackageJson } from '@ts-type/package-dts';
import { resolvePackageJsonLocation } from '@yarn-tool/resolve-package';
import { _pkgExportsAddPJsonEntryCore } from '@yarn-tool/pkg-entry-util/lib/field/exports';
import { readJSONSync } from '@bluelovers/fs-json';
import { fixPublishConfig } from '@yarn-tool/pkg-entry-util/lib/field/publishConfig';
import { fixBinPath, fixPkgBinField } from '@yarn-tool/pkg-entry-util/lib/field/bin';
import { outputPackageJSONSync } from '@yarn-tool/write-package-json';
import { fixEmptyFields } from '@yarn-tool/pkg-entry-util/lib/field/fixEmpty';

// 檔案路徑或 JSON 物件的聯合類型 / Union type for file path or JSON object
type IFileOrJson = Buffer | string | object | IPackageJson

// 類似 package.json 的物件類型 / Package.json-like object type
type IPackageJsonLike<T> = Partial<T> | Record<string, any>;

// 單一項目或項目陣列的類型 / Type for single item or array of items
type IItemOrItemArray<T> = T | T[];

/**
 * package.json 載入器類別
 * Package.json loader class
 *
 * 提供載入、修改、排序、驗證和寫入 package.json 的完整功能
 * Provides complete functionality for loading, modifying, sorting, verifying, and writing package.json
 *
 * @template T - package.json 類型參數 / package.json type parameter
 *
 * @example
 * // 從檔案路徑載入 / Load from file path
 * const pkg = new PackageJsonLoader('/path/to/package.json');
 * pkg.read().autofix().sort().write();
 *
 * @example
 * // 從模組名稱載入 / Load from module name
 * const pkg = PackageJsonLoader.loadByModuleName('lodash');
 */
export class PackageJsonLoader<T extends IPackageJsonLike<IPackageJson> = IPackageJson>
{
	/**
	 * package.json 檔案路徑
	 * Path to package.json file
	 */
	readonly file: string;

	/**
	 * 解析後的 JSON 資料
	 * Parsed JSON data
	 */
	protected json: T;

	/**
	 * 是否已載入資料
	 * Whether data has been loaded
	 */
	loaded: boolean;

	/**
	 * 自訂處理函式佇列
	 * Queue of custom processing functions
	 */
	protected _use: ((json: IPackageJsonLike<T>) => void)[] = [];

	/**
	 * 建立 PackageJsonLoader 實例的工廠方法
	 * Factory method to create PackageJsonLoader instance
	 *
	 * @template T - package.json 類型參數 / package.json type parameter
	 * @param {IFileOrJson} file - 檔案路徑或 JSON 物件 / File path or JSON object
	 * @param {any[]} argv - 額外參數 / Additional arguments
	 * @returns {PackageJsonLoader<T>} PackageJsonLoader 實例 / PackageJsonLoader instance
	 */
	@bind
	static create<T = IPackageJson>(file: IFileOrJson, ...argv)
	{
		return new this<T>(file, ...argv)
	}

	/**
	 * 從 JSON 物件建立實例
	 * Create instance from JSON object
	 *
	 * @template T - package.json 類型參數 / package.json type parameter
	 * @param {T} json - JSON 物件 / JSON object
	 * @param {any[]} argv - 額外參數 / Additional arguments
	 * @returns {PackageJsonLoader<T>} PackageJsonLoader 實例 / PackageJsonLoader instance
	 */
	static createByJson<T = IPackageJson>(json: T, ...argv)
	{
		return new this<T>(json as any, ...argv)
	}

	/**
	 * 透過模組名稱尋找 package.json 路徑
	 * Find package.json path by module name
	 *
	 * @param {string} name - 模組名稱 / Module name
	 * @returns {string} package.json 的絕對路徑 / Absolute path to package.json
	 */
	static findPackageJsonPath(name: string): string
	{
		return resolvePackageJsonLocation(name);
	}

	/**
	 * 透過模組名稱載入 package.json
	 * Load package.json by module name
	 *
	 * @template T - package.json 類型參數 / package.json type parameter
	 * @param {string} name - 模組名稱 / Module name
	 * @returns {PackageJsonLoader<T>} PackageJsonLoader 實例 / PackageJsonLoader instance
	 * @throws {TypeError} 當套件名稱不符時拋出錯誤 / Throws when package name doesn't match
	 */
	@bind
	static loadByModuleName<T = IPackageJson>(name: string)
	{
		let file = this.findPackageJsonPath(name);

		let pkg = this.create<T>(file);

		// 驗證載入的套件名稱是否與請求的名稱相符
		// Verify loaded package name matches requested name
		if ((pkg.data as any).name !== name)
		{
			throw new TypeError(`package name not match, '${(pkg.data as any).name}' != '${name}'`);
		}

		return pkg;
	}

	/**
	 * 建構子
	 * Constructor
	 *
	 * @param {IFileOrJson} fileOrJson - 檔案路徑、Buffer 或 JSON 物件 / File path, Buffer, or JSON object
	 * @param {any[]} argv - 額外參數 / Additional arguments
	 */
	constructor(fileOrJson: IFileOrJson, ...argv)
	{
		// 根據輸入類型初始化實例 / Initialize instance based on input type
		if (typeof fileOrJson === 'string')
		{
			this.setFilename(fileOrJson)
		}
		else if (Buffer.isBuffer(fileOrJson))
		{
			this.setJson(JSON.parse(fileOrJson.toString()))
		}
		else if (typeof fileOrJson === 'object')
		{
			this.setJson(JSON.parse(fileOrJson.toString()))
		}
		else if (fileOrJson != null)
		{
			throw new TypeError(`fileOrJson is not valid`)
		}
	}

	/**
	 * 註冊自訂處理函式
	 * Register custom processing function
	 *
	 * @param {IItemOrItemArray<(json: IPackageJsonLike<T>) => void>} ls - 處理函式或函式陣列 / Processing function or array of functions
	 */
	use(ls: IItemOrItemArray<(json: IPackageJsonLike<T>) => void>)
	{
		if (Array.isArray(ls))
		{
			this._use.push(...ls);
		}
		else
		{
			this._use.push(ls);
		}
	}

	/**
	 * 設定檔案名稱
	 * Set filename
	 *
	 * @param {string} file - 檔案路徑 / File path
	 * @returns {this} 当前實例 / Current instance
	 */
	setFilename(file: string)
	{
		// @ts-ignore
		this.file = file;

		return this;
	}

	/**
	 * 設定 JSON 資料
	 * Set JSON data
	 *
	 * @param {object | T} json - JSON 物件 / JSON object
	 * @returns {this} 当前實例 / Current instance
	 */
	setJson(json: object | T)
	{
		this.loaded = true;
		this.json = json as T;

		return this;
	}

	/**
	 * 讀取 package.json 檔案
	 * Read package.json file
	 *
	 * @param {boolean} reload - 是否強制重新載入 / Whether to force reload
	 * @returns {this} 当前實例 / Current instance
	 */
	read(reload?: boolean)
	{
		if (!this.loaded || reload)
		{
			this.json = readJSONSync(this.file);
		}

		this.loaded = true;

		return this;
	}

	/**
	 * 重新載入 package.json
	 * Reload package.json
	 *
	 * @returns {this} 当前實例 / Current instance
	 */
	reload()
	{
		return this.read(true);
	}

	/**
	 * 取得 package.json 所在目錄
	 * Get directory of package.json
	 *
	 * @returns {string} 目錄路徑 / Directory path
	 */
	get dir()
	{
		return path.dirname(this.file)
	}

	/**
	 * 取得跳過 TypeScript 類型檢查的資料
	 * Get data without TypeScript type checking
	 *
	 * 用於需要靈活操作 JSON 資料的場景
	 * Use when flexible JSON data manipulation is needed
	 */
	get unsafeTypeData(): IPackageJsonLike<T>
	{
		return this.data as any;
	}

	/**
	 * 設定跳過 TypeScript 類型檢查的資料
	 * Set data without TypeScript type checking
	 */
	set unsafeTypeData(json)
	{
		this.data = json as any;
	}

	/**
	 * 設定 package.json 資料
	 * Set package.json data
	 */
	set data(json: T)
	{
		this.overwrite(json);
	}

	/**
	 * 取得 package.json 資料
	 * Get package.json data
	 *
	 * 若尚未載入會自動讀取檔案
	 * Automatically reads file if not loaded yet
	 *
	 * @returns {T} package.json 資料 / package.json data
	 */
	get data(): T
	{
		if (!this.loaded && this.file)
		{
			this.read();
		}

		return this.json;
	}

	/**
	 * 覆寫 JSON 資料
	 * Overwrite JSON data
	 *
	 * @param {object | T} json - 新的 JSON 資料 / New JSON data
	 * @returns {this} 当前實例 / Current instance
	 */
	overwrite(json: object | T)
	{
		this.loaded = true;
		this.json = json as T;

		return this;
	}

	/**
	 * 自動修復 package.json 欄位
	 * Auto-fix package.json fields
	 *
	 * 執行以下修復操作：
	 * 1. 修復 bin 欄位路徑
	 * 2. 修復 publishConfig 欄位
	 * 3. 添加 exports 中的 package.json entry
	 * 4. 清理空欄位
	 *
	 * Performs the following fix operations:
	 * 1. Fix bin field paths
	 * 2. Fix publishConfig field
	 * 3. Add package.json entry in exports
	 * 4. Clean empty fields
	 */
	autofix()
	{
		let self = this;
		let dir: string;

		// 檢查檔案和目錄是否存在
		// Check if file and directory exist
		if (self.file && pathExistsSync(dir = self.dir))
		{
			if (self.data)
			{
				// 修復 bin 欄位路徑 / Fix bin field paths
				fixPkgBinField(self.data, dir);
				// 修復 publishConfig 欄位 / Fix publishConfig field
				fixPublishConfig(self.data);
			}
		}

		// 在 exports 中添加 package.json entry / Add package.json entry in exports
		_pkgExportsAddPJsonEntryCore(self.data?.exports);

		// 清理空欄位 / Clean empty fields
		fixEmptyFields(self.data, dir);
	}

	/**
	 * 執行處理流程
	 * Run processing pipeline
	 *
	 * @param {object} options - 選項 / Options
	 * @param {boolean} options.autofix - 是否執行自動修復 / Whether to run auto-fix
	 * @returns {this} 当前實例 / Current instance
	 */
	run(options: {
		autofix?: boolean
	} = {})
	{
		// 預設執行自動修復 / Default to run auto-fix
		if (options.autofix == null || options.autofix)
		{
			this.autofix();
		}

		// 執行所有註冊的處理函式 / Execute all registered processing functions
		this._use.forEach(fn => fn.call(this, this.data));

		return this;
	}

	/**
	 * 檢查檔案是否存在
	 * Check if file exists
	 *
	 * @returns {boolean} 檔案是否存在 / Whether file exists
	 */
	exists()
	{
		return pathExistsSync(this.file)
	}

	/**
	 * 將 JSON 資料轉換為字串
	 * Convert JSON data to string
	 *
	 * @returns {string} 格式化的 JSON 字串 / Formatted JSON string
	 */
	stringify()
	{
		return JSON.stringify(this.json, null, 2)
	}

	/**
	 * 排序 package.json 欄位
	 * Sort package.json fields
	 *
	 * 使用 sort-package-json3 套件進行標準化排序
	 * Use sort-package-json3 package for standardized sorting
	 *
	 * @returns {this} 当前實例 / Current instance
	 * @throws {Error} 當資料為 undefined 或 null 時拋出錯誤 / Throws when data is undefined or null
	 */
	sort()
	{
		if (typeof this.data === 'undefined' || this.data === null)
		{
			throw new Error(`data is undefined`)
		}

		this.data = sortPackageJson(this.data);

		return this;
	}

	/**
	 * 寫入 package.json 檔案
	 * Write package.json file
	 *
	 * @returns {this} 当前實例 / Current instance
	 * @throws {Error} 當檔案路徑未設定時拋出錯誤 / Throws when file path is not set
	 */
	write()
	{
		if (!this.file)
		{
			throw new Error(`file is undefined`)
		}

		outputPackageJSONSync(this.file, this.json);

		return this;
	}

	/**
	 * 僅在已載入時寫入
	 * Write only when loaded
	 *
	 * @returns {boolean} 是否已寫入 / Whether written
	 */
	writeOnlyWhenLoaded()
	{
		if (this.loaded)
		{
			this.write();
		}

		return this.loaded;
	}
}

export default PackageJsonLoader
