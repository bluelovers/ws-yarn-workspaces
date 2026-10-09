import { outputFileSync, pathExistsSync } from 'fs-extra';
import { readFileSync } from 'fs-iconv';
import ignore from 'ignore';
import {
	addPatterns,
	IFinalizeIgnoreLinesOptions,
	finalizeIgnoreLines,
	listPatternsOnly,
	processToLines,
	removePatterns,
	serializeLines,
} from './lines';
import { hasPattern } from './filter';
import {
	findIgnoreFilesGenerator,
	ICwdOrFindIgnoreFilesOptions,
	IFindIgnoreFilesOptions,
} from './find';
import { ITSArrayListMaybeReadonly } from 'ts-type';
import { _omitBlankLines, _stringifyEndOfLine } from './normalize';
import { LF } from 'crlf-normalize';

/**
 * ignore 檔案編碼 (Encoding)，預設 utf8
 */
const ENCODING = 'utf8'

/**
 * IgnoreFile 的設定值，以物件形式保留並據此控管 {@link IgnoreFile.finalize}
 *
 * 選項命名為 `optimizations`（優化項目）而非 `finalize`：
 * 它描述「要做哪些優化」，而 `finalize` 是「執行這些優化的時機」。
 */
export interface IIgnoreFileOptions
{
	/**
	 * 輸出前優化的設定（移除重複規則、收合空行）
	 * Optimization settings applied before output (drop duplicate rules, collapse blank lines)
	 *
	 * 實例上的這份設定是 {@link IgnoreFile.finalize} 的預設值，
	 * `finalize()` 傳入的選項會覆寫它們。
	 */
	optimizations?: IFinalizeIgnoreLinesOptions;

	ignoreOptions?: Parameters<typeof ignore>[0];

	startCount?: boolean | number;

	/**
	 * 結尾是否添加換行符
	 * 如果是 number，則添加指定數量的換行符
	 */
	endCount?: boolean | number;

	/**
	 * 寫入前是否停用執行優化
	 * `optimizations` 決定優化的內容，`disableOptimize` 只決定這次保存要不要執行。
	 */
	disableOptimize?: boolean,
}

/**
 * 搜尋並建立 IgnoreFile 時的選項：搜尋選項與實例設定合為一袋
 */
export interface IFindIgnoreFileOptions extends IFindIgnoreFilesOptions, IIgnoreFileOptions
{
}

export type ICheckIgnoreResult = ReturnType<ReturnType<typeof ignore>['checkIgnore']>

/**
 * 單一 ignore 檔案的封裝類別
 *
 * 組合「搜尋 / 讀取 / 編輯 / 保存 / 比對」各項邏輯，但只負責一個檔案。
 * composes find / read / edit / save / match logic, while handling only one file.
 */
export class IgnoreFile
{
	/**
	 * 以檔案路徑建立實例（檔案不存在時視為空白檔案）
	 *
	 * @param path - ignore 檔案路徑
	 * @param options - 實例設定，控管 {@link finalize}
	 */
	static from = (path: string, options?: IIgnoreFileOptions) =>
	{
		const content = pathExistsSync(path) ? readFileSync(path).toString() : ''

		return new this(path, content, options)
	}

	/**
	 * 從目前目錄向上搜尋指定的 ignore 檔案並建立實例
	 * Search upward from the current directory for the given ignore file
	 *
	 * 必須明確指定檔名：ignore 檔案有多種（`.gitignore`、`.npmignore`…），
	 * 若只取搜尋結果的第一筆，會無法確定開的是 git 還是 npm 的 ignore 檔案。
	 *
	 * 找不到時回傳 `undefined`。
	 *
	 * @param fileName - 要搜尋的 ignore 檔名
	 * @param cwd - 目前工作目錄或搜尋選項
	 * @param opts - 搜尋選項與實例設定，見 {@link IFindIgnoreFileOptions}
	 */
	static find(fileName: string,
		cwd?: ICwdOrFindIgnoreFilesOptions,
		opts?: IFindIgnoreFileOptions,
	): IgnoreFile | undefined
	{
		/**
		 * `optimizations` 屬於實例設定而非搜尋選項，先取出，避免混進搜尋選項
		 */
		const { optimizations, ...findOpts } = opts ?? {}

		/**
		 * 逐層產生，找到第一個符合的目錄即可中斷，不必展開全部父層
		 * Produced layer by layer, so the search can stop at the first matching
		 * directory instead of materializing every parent directory
		 */
		for (const { list } of findIgnoreFilesGenerator(cwd, {
			...findOpts,
			fileNames: fileName,
		}))
		{
			const path = list[0]?.path

			if (path)
			{
				return IgnoreFile.from(path, { optimizations })
			}
		}

		return undefined
	}

	/**
	 * ignore 檔案路徑
	 */
	readonly path: string

	/**
	 * 實例設定，控管 {@link finalize}
	 */
	readonly options: IIgnoreFileOptions

	/**
	 * 行陣列內容
	 */
	protected _lines: string[]

	protected _ignore: ReturnType<typeof ignore>;

	constructor(path: string, content = '', options?: IIgnoreFileOptions)
	{
		this.path = path
		this.options = options ?? {}
		this._lines = processToLines(content)

		if (typeof this.options.endCount !== 'number' || typeof this.options.startCount !== 'number')
		{
			const { lines, startCount, endCount } = _omitBlankLines(this._lines)

			this._lines = lines
			if (this.options.startCount !== false) this.options.startCount = startCount
			if (this.options.endCount !== false) this.options.endCount = endCount
		}
	}

	/**
	 * 目前的行陣列
	 */
	get lines(): readonly string[]
	{
		return this._lines
	}

	/**
	 * 目前的內容（LF 行尾）
	 */
	get content(): string
	{
		return _stringifyEndOfLine(this.options.startCount) + serializeLines(this._lines) + _stringifyEndOfLine(this.options.endCount)
	}

	/**
	 * 目前所有規則
	 */
	get patterns(): string[]
	{
		return listPatternsOnly(this._lines)
	}

	/**
	 * 是否已存在指定規則
	 *
	 * @param pattern - 規則
	 */
	has(pattern: string): boolean
	{
		return hasPattern(this._lines, pattern)
	}

	/**
	 * 新增規則（保留註解與空行）
	 * Add rules (comments and blank lines are kept)
	 *
	 * 只與插入位置前方最近的一條規則比對，相同即略過；
	 * 遠處的重複交由 {@link finalize} 在輸出前統一處理。
	 *
	 * @param patterns - 一條或多條規則
	 */
	add(...patterns: string[]): this
	{
		this._lines = addPatterns(this._lines, patterns);
		this._ignore?.add(patterns);

		return this
	}

	/**
	 * 移除規則（保留註解與空行）
	 * Remove rules (comments and blank lines are kept)
	 *
	 * @param patterns - 一條或多條規則
	 */
	remove(...patterns: string[]): this
	{
		this._lines = removePatterns(this._lines, patterns);
		this._ignore = void 0;

		return this
	}

	/**
	 * 輸出前優化：移除重複規則（只保留最後一筆）並收合超過上限的空行
	 *
	 * 註解不參與去重，位置與數量都不會被更動。
	 *
	 * 以 {@link this.options.optimizations} 為預設值，`options` 參數覆寫之。
	 *
	 * @param options - 優化選項
	 */
	finalize(options?: IFinalizeIgnoreLinesOptions): this
	{
		this._lines = finalizeIgnoreLines(this._lines, {
			...this.options.optimizations,
			...options,
		});

		this._ignore = void 0;

		return this
	}

	/**
	 * 保存到檔案
	 *
	 * 預設先執行優化再寫入；`optimize: false` 可保留未優化的行陣列。
	 *
	 * @param opts - 保存選項，見 {@link IIgnoreFileOptions}
	 */
	save(opts?: IIgnoreFileOptions): this
	{
		const { disableOptimize: optimize = true, optimizations } = opts ?? {}

		if (optimize)
		{
			this.finalize(optimizations)
		}

		outputFileSync(this.path, this.content, {
			encoding: ENCODING,
		})

		return this
	}

	/**
	 * 建立比對 (matching) 用的 ignore 實例
	 */
	toIgnore(force?: boolean): ReturnType<typeof ignore>
	{
		if (!this._ignore || force)
		{
			this._ignore = ignore(this.options.ignoreOptions).add(this.lines)
		}

		return this._ignore
	}

	/**
	 * 判斷路徑是否被忽略
	 *
	 * @param pathname - 相對路徑（需為正斜線）/ Relative path (forward slashes required)
	 */
	isIgnored(pathname: string): boolean
	{
		return this.toIgnore().ignores(pathname)
	}

	ignores(pathname: string)
	{
		return this.isIgnored(pathname);
	}

	test(pathname: string): ICheckIgnoreResult
	{
		return this.toIgnore().test(pathname);
	}

	/**
	 * Debugs gitignore / exclude files, which is equivalent to git check-ignore -v.
	 * Usually this method is used for other packages to implement the function of git check-ignore -v upon node-ignore
	 */
	checkIgnore(pathname: string): ICheckIgnoreResult
	{
		return this.toIgnore().checkIgnore(pathname);
	}

	/**
	 * 過濾出被忽略的路徑 / Filter out the ignored paths
	 *
	 * @param paths - 相對路徑列表 / List of relative paths
	 */
	filter(pathnames: ITSArrayListMaybeReadonly<string>): string[]
	{
		return this.toIgnore().filter(pathnames)
	}
}
