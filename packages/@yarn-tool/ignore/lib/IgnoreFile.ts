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
import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';
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
	 * 輸出前優化的設定（移除重複規則、收合空行、移除首尾空行）
	 * Optimization settings applied before output (drop duplicate rules, collapse blank lines, strip leading/trailing blank lines)
	 *
	 * 實例上的這份設定是 {@link IgnoreFile.finalize} 的預設值，
	 * `finalize()` 傳入的選項會覆寫它們。
	 */
	optimizations?: IFinalizeIgnoreLinesOptions;

	ignoreOptions?: Parameters<typeof ignore>[0];

	/**
	 * 檔案開頭的換行數，輸出時還原為 LF
	 * Number of newlines at the start of the file, restored as LF on output
	 *
	 * 未指定時由建構子以實際內容記錄（見建構子說明）；
	 * 傳 `false` 表示不還原，數字則會收合到 MAX_BLANK_LINES 上限。
	 * When omitted the constructor records it from the actual content (see the
	 * constructor); pass `false` to restore nothing, and a number is clamped to
	 * the MAX_BLANK_LINES bound
	 */
	startCount?: boolean | number;

	/**
	 * 檔案結尾的換行數，輸出時還原為 LF
	 * Number of newlines at the end of the file, restored as LF on output
	 *
	 * 行為同 {@link startCount}：未指定時由建構子記錄、`false` 不還原、
	 * 數字收合到 MAX_BLANK_LINES 上限。
	 * Behaves like {@link startCount}: recorded by the constructor when omitted,
	 * `false` restores nothing, and a number is clamped to the MAX_BLANK_LINES bound
	 */
	endCount?: boolean | number;

	/**
	 * 這次輸出是否停用優化（只有明確傳入 `false` 才會停用）
	 * Whether to skip the optimization for this output (only an explicit `false` skips)
	 *
	 * `optimizations` 決定「優化哪些項目」，`disableOptimize` 只決定「這次輸出要不要做」；
	 * 省略或傳 `true` 皆會執行優化。
	 * `optimizations` decides which steps run, while `disableOptimize` only decides
	 * whether this output performs them; omitting it or passing `true` optimizes
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

	/**
	 * ignore 比對實例的快取，由 {@link toIgnore} 建立；
	 * 行陣列變動後的處置見各操作方法內部的說明
	 * Cache of the ignore instance built by {@link toIgnore};
	 * see the comment inside each mutating method for how it is handled after the lines change
	 */
	protected _ignore: ReturnType<typeof ignore>;

	/**
	 * 以內容與路徑建立實例
	 *
	 * 建構時會先剝除首尾的空行，
	 * 並把剝除數量記錄到 {@link options} 的 `startCount` / `endCount`，
	 * 之後由 {@link content} / {@link stringify} 依數量還原結尾換行；
	 * 傳入 `false` 的一項表示該側不自動記錄。
	 * Leading/trailing blank lines are stripped at construction and the counts are
	 * recorded as `startCount` / `endCount` in {@link options}, so {@link content} /
	 * {@link stringify} can restore the newlines; passing `false` for one of them
	 * disables the automatic recording on that side.
	 *
	 * @param path - ignore 檔案路徑
	 * @param content - 檔案內容或行陣列，省略時視為空白檔案
	 * @param options - 實例設定，控管 {@link finalize}
	 */
	constructor(path: string, content?: ITSValueOrArrayMaybeReadonly<string>, options?: IIgnoreFileOptions)
	{
		this.path = path
		this.options = options ?? {}
		this._lines = processToLines(content ?? '')

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

		/**
		 * 內部快取：新增只會加入規則，而 ignore 實例只能 add、不能刪除，
		 * 與快取可直接併入，不必像 remove / finalize 那樣清空重建
		 * Internal cache: adding only inserts rules, and an ignore instance can add
		 * but never remove, so it is merged into the cache directly instead of
		 * being cleared and rebuilt as in remove / finalize
		 */
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

		/**
		 * 內部快取：ignore 實例只能 add、不能刪除，
		 * 清空後由 toIgnore() 依新的行陣列重建，確保比對同步
		 * Internal cache: an ignore instance can only add, never remove, so it is
		 * cleared and toIgnore() rebuilds it from the new lines to stay in sync
		 */
		this._ignore = void 0;

		return this
	}

	/**
	 * 輸出前優化（就地更新行陣列）
	 * Optimize before output (updates the lines in place)
	 *
	 * 依序執行：移除重複規則（只保留最後一筆）、收合超過上限的連續空行、
	 * 移除首尾空行；三項皆可個別關閉。
	 * Runs in order: drop duplicate rules (keep the last one), collapse blank runs
	 * beyond the bound, and strip leading/trailing blank lines; each step can be
	 * disabled individually.
	 *
	 * 註解不參與去重，位置與數量都不會被更動。
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

		/**
		 * 內部快取：整理可能移除規則行（去重、收合、裁掉首尾空行），
		 * 而 ignore 實例只能 add、不能刪除，
		 * 故清空後由 toIgnore() 依新的行陣列重建
		 * Internal cache: optimizing may remove rule lines (dedupe, collapse,
		 * stripping) and an ignore instance can only add, so it is cleared and
		 * toIgnore() rebuilds it from the new line array
		 */
		this._ignore = void 0;

		return this
	}

	/**
	 * 取得目前內容（LF 行尾），預設先執行優化再輸出
	 * Get the current content (LF line endings), optimizing before output by default
	 *
	 * 優化會就地更新行陣列（同 {@link finalize}）；
	 * `disableOptimize: false` 可取得未優化的輸出，
	 * `optimizations` 則覆寫實例上的設定（見 {@link IIgnoreFileOptions}）。
	 * Optimizing updates the lines in place (same as {@link finalize}); pass
	 * `disableOptimize: false` for the un-optimized output, and `optimizations`
	 * overrides the instance settings (see {@link IIgnoreFileOptions})
	 *
	 * @param opts - 輸出選項，見 {@link IIgnoreFileOptions}
	 */
	stringify(opts?: IIgnoreFileOptions): string
	{
		const { disableOptimize: optimize = true, optimizations } = opts ?? {}

		if (optimize)
		{
			this.finalize(optimizations)
		}

		return this.content
	}

	/**
	 * 保存到檔案
	 * Save to the file
	 *
	 * 內容來自 {@link stringify}：預設先執行優化再寫入；
	 * `disableOptimize: false` 可寫入未優化的內容。
	 * The content comes from {@link stringify}: it optimizes before writing by
	 * default; pass `disableOptimize: false` to write the un-optimized content
	 *
	 * @param opts - 保存選項，見 {@link IIgnoreFileOptions}
	 */
	save(opts?: IIgnoreFileOptions): this
	{
		outputFileSync(this.path, this.stringify(opts), {
			encoding: ENCODING,
		})

		return this
	}

	/**
	 * 建立比對 (matching) 用的 ignore 實例
	 * Build the ignore instance used for matching
	 *
	 * 預設回傳快取以避免重複建立；`force` 為 `true` 時改以目前行陣列重建。
	 * Returns the cached instance by default to avoid rebuilding; pass `force` as
	 * `true` to rebuild from the current lines.
	 *
	 * @param force - 強制以目前行陣列重建 / Force a rebuild from the current lines
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

	/**
	 * 判斷路徑是否被忽略（`isIgnored` 的別名）
	 * Whether the path is ignored (an alias of isIgnored)
	 *
	 * 刻意沿用 `import ignore from 'ignore'` 的 `ignores()` 名稱：
	 * 如此一來，只要求 `{ ignores(pathname: string): boolean }` 的型別
	 * 可以同時接受 IgnoreFile 與 ignore 套件建立的實例，兩者可互換使用。
	 * The `ignores()` name deliberately matches `import ignore from 'ignore'`:
	 * any type that only requires `{ ignores(pathname: string): boolean }` accepts
	 * both an IgnoreFile and an instance created by the ignore package, so the two
	 * are interchangeable.
	 *
	 * @param pathname - 相對路徑（需為正斜線）/ Relative path (forward slashes required)
	 */
	ignores(pathname: string)
	{
		return this.isIgnored(pathname);
	}

	/**
	 * 回傳路徑的比對結果，同名相容 `ignore` 套件的 `test()`
	 * The matching result of the path, name-compatible with the ignore package's `test()`
	 *
	 * 與 `ignores()` 相同的理由：同名同回傳值，讓接受 ignore 實例的程式碼也能直接傳入 IgnoreFile。
	 * For the same reason as `ignores()`: identical name and return value, so code
	 * accepting an ignore instance also accepts an IgnoreFile directly.
	 */
	test(pathname: string): ICheckIgnoreResult
	{
		return this.toIgnore().test(pathname);
	}

	/**
	 * Debugs gitignore / exclude files, which is equivalent to git check-ignore -v.
	 * Usually this method is used for other packages to implement the function of git check-ignore -v upon node-ignore
	 *
	 * 同名相容 `ignore` 套件的 `checkIgnore()`，回傳值也相同（{@link ICheckIgnoreResult}）。
	 * Name-compatible with the ignore package's `checkIgnore()`, returning the same
	 * {@link ICheckIgnoreResult}.
	 */
	checkIgnore(pathname: string): ICheckIgnoreResult
	{
		return this.toIgnore().checkIgnore(pathname);
	}

	/**
	 * 過濾出被忽略的路徑 / Filter out the ignored paths
	 *
	 * 同名相容 `ignore` 套件的 `filter()`；與 `ignores()` 相同的理由，
	 * 接受 ignore 實例的型別也能直接接受 IgnoreFile。
	 * Name-compatible with the ignore package's `filter()`; for the same reason as
	 * `ignores()`, a type accepting an ignore instance also accepts an IgnoreFile.
	 *
	 * @param paths - 相對路徑列表 / List of relative paths
	 */
	filter(pathnames: ITSArrayListMaybeReadonly<string>): string[]
	{
		return this.toIgnore().filter(pathnames)
	}
}
