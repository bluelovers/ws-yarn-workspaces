import { outputFileSync, pathExistsSync } from 'fs-extra';
import { readFileSync } from 'fs-iconv';
import ignore from 'ignore';
import {
	addPatterns,
	finalizeIgnoreLines,
	listPatternsOnly,
	processToLines,
	removePatterns,
	serializeLines,
} from './lines';
import { hasPattern } from './filter';
import { findIgnoreFilesGenerator } from './find';
import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';
import { _stringifyEndOfLine } from './normalize';
import { _handleOptionsEndCount } from './options';
import {
	ICheckIgnoreResult,
	ICwdOrFindIgnoreFilesOptions, IFinalizeIgnoreLinesOptions, IFindIgnoreFileOptions, IIgnoreFileOptions,
} from './types';

/**
 * ignore 檔案編碼 (Encoding)，預設 utf8
 */
const ENCODING = 'utf8'

/**
 * 單一 ignore 檔案的封裝類別
 *
 * 組合「搜尋 / 讀取 / 編輯 / 保存 / 比對」各項邏輯，但只負責一個檔案。
 * composes find / read / edit / save / match logic, while handling only one file.
 */
export class IgnoreFile implements ignore.Ignore
{
	/**
	 * 以檔案路徑建立實例（檔案不存在時視為空白檔案）
	 *
	 * @param path - ignore 檔案路徑
	 * @param options - 實例設定，控管 {@link finalize}
	 *
	 * @example
	 * const file = IgnoreFile.from('/path/to/.gitignore')
	 * file.patterns // 只含規則行，例如 ['*.log', '!keep.log']
	 * IgnoreFile.from('/not/exist/.gitignore').lines // [] —— 檔案不存在視為空白檔案
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
	 *
	 * @example
	 * const file = IgnoreFile.find('.gitignore', '/path/to/dir')
	 * file?.path // 由近至遠找到的第一個 .gitignore 路徑
	 * IgnoreFile.find('.no-such-ignore', '/path/to/dir') // undefined —— 範圍內沒有該檔案
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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * file.lines // ['# notes', '*.log', '', '!keep.log'] —— 註解與空行原樣保留
	 * file.patterns // ['*.log', '!keep.log'] —— 只有規則行
	 * file.content // '# notes\n*.log\n\n!keep.log\n' —— 結尾換行由 endCount 還原
	 */
	constructor(path: string, content?: ITSValueOrArrayMaybeReadonly<string>, options?: IIgnoreFileOptions)
	{
		this.path = path
		this.options = options ?? {}
		this._lines = processToLines(content ?? '')

		const { lines, startCount, endCount } = _handleOptionsEndCount(this.options, { lines: this._lines });

		this.options.startCount = startCount;
		this.options.endCount = endCount;
		this._lines = lines;
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
	 *
	 * 兩側刻意不同：`startCount` 收斂（超出範圍的數字夾進範圍），
	 * `endCount` 維持回歸預設值（`_normalizeEndCount` 內建的上限）
	 * The two sides differ on purpose: `startCount` converges (an out-of-range
	 * number is clamped into range) while `endCount` keeps falling back to the
	 * default built into `_normalizeEndCount` (the upper bound)
	 */
	get content(): string
	{
		return _stringifyEndOfLine(this.options.startCount, void 0, true) + serializeLines(this._lines) + _stringifyEndOfLine(this.options.endCount)
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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * file.has('*.log') // true
	 * file.has('# notes') // false —— 註解不算規則
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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * file.add('*.tmp', '!keep.tmp').lines
	 * // ['# notes', '*.log', '', '!keep.log', '*.tmp', '!keep.tmp']
	 * // 註解與空行原位不動，新規則接在最後
	 */
	add(...patterns: string[]): this
	{
		return this.addList(patterns)
	}

	/**
	 * 批次新增規則（{@link add} 的底層實作），回傳 `this` 可繼續串接
	 *
	 * 同批次的重複項先收斂成一條，再逐條與「插入位置前方最近的一條規則」比對：
	 * - 未帶 `force`：前方已是同一條規則、或是空字串時略過，不產生重複列
	 * - `force: true`：跳過該比對直接插入（連空字串也會插入），
	 *   因此可能出現重複列；遠處的重複仍交由 {@link finalize} 在輸出前統一處理
	 *
	 * 註解與空行維持原位不動，新規則一律接在行陣列的最後。
	 *
	 * @param patterns - 一條或多條規則
	 * @param force - 跳過前方規則比對直接插入
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n')
	 * file.addList(['*.tmp', '*.tmp']).lines // 同批次重複項收斂：['# notes', '*.log', '*.tmp']
	 * file.addList(['*.tmp']).lines // 最後一列已是 '*.tmp'，略過 → 維持不變
	 * file.addList(['*.tmp'], true).lines // force 直接插入 → ['# notes', '*.log', '*.tmp', '*.tmp']
	 */
	addList(patterns: string[], force?: boolean): this
	{
		this._lines = addPatterns(this._lines, patterns, force);

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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * file.remove('*.log').lines // ['# notes', '', '!keep.log'] —— 註解與空行保留
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
	 * 依序執行：移除重複的規則與重複的註解（皆只保留最後一筆）、
	 * 收合超過上限的連續空行、移除首尾空行；四項皆可個別關閉。
	 * Runs in order: drop duplicate rules and duplicate comments (both keep only
	 * the last one), collapse blank runs beyond the bound, and strip
	 * leading/trailing blank lines; all four steps can be disabled individually.
	 *
	 * 規則行與註解行預設一起去重，傳 `disableDedupePatternsComment: true`
	 * 可只對規則行去重，讓重複的註解原樣保留；空行永遠允許重複。
	 * Rule and comment lines are deduplicated together by default; passing
	 * `disableDedupePatternsComment: true` keeps duplicated comments as they are,
	 * while blank lines may always repeat.
	 * 以 {@link this.options.optimizations} 為預設值，`options` 參數覆寫之。
	 *
	 * @param options - 優化選項
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n*.log\n\n\n!keep.log\n')
	 * file.finalize().lines // ['# notes', '*.log', '', '', '!keep.log']
	 * // 重複規則只留最後一筆；2 個連續空行未超過上限，原樣保留
	 * file.finalize({ disableCollapseBlankLines: true }) // 傳選項覆寫實例設定
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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n*.log\n\n\n!keep.log\n')
	 * file.stringify({ disableOptimize: false }) // 原樣輸出，重複規則保留
	 * // '# notes\n*.log\n*.log\n\n\n!keep.log\n'
	 * file.stringify() // 預設先優化（就地更新行陣列），重複規則只留最後一筆
	 * // '# notes\n*.log\n\n\n!keep.log\n'
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
	 *
	 * @example
	 * const file = IgnoreFile.from('/path/to/.gitignore')
	 * file.add('*.tmp')
	 * file.save() // 優化後寫回 file.path
	 * file.save({ disableOptimize: false }) // 寫入未優化的內容
	 * // 改寫到其他路徑見 outputFile()
	 */
	save(opts?: IIgnoreFileOptions): this
	{
		return this.outputFile(this.path, opts)
	}

	/**
	 * 將目前內容寫入指定路徑（內容來自 {@link stringify}）
	 *
	 * @param path - 要寫入的 ignore 檔案路徑
	 * @param opts - 輸出選項，見 {@link IIgnoreFileOptions}
	 *
	 * @example
	 * const file = IgnoreFile.from('/path/to/.gitignore')
	 * file.outputFile('/path/to/other/.npmignore') // 優化後寫入指定路徑
	 * file.outputFile('/path/to/other/.gitignore', { disableOptimize: false }) // 寫入未優化的內容
	 */
	outputFile(path: string, opts?: IIgnoreFileOptions): this
	{
		outputFileSync(path, this.stringify(opts), {
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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '*.log\n\n!keep.log\n')
	 * file.toIgnore().ignores('a.log') // true —— 重複呼叫回傳同一份快取
	 * file.toIgnore(true) // 行陣列變動後強制以目前內容重建
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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '*.log\n\n!keep.log\n')
	 * file.isIgnored('a.log') // true
	 * file.isIgnored('keep.log') // false —— 被負規則 `!keep.log` 救回
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
	 * Debugs gitignore / exclude files, which is equivalent to git check-ignore -v.
	 * Usually this method is used for other packages to implement the function of `git check-ignore -v` upon node-ignore
	 *
	 * 與 {@link ignores} 幾乎總是同結果：`checkIgnore(path).ignored` 等於 `ignores(path)`
	 * （被忽略為 `true`、未被忽略為 `false`）。差別在於 `checkIgnore` 除了「是否被忽略」，
	 * 還會回傳「是被哪一條規則命中」的 `rule`，因此比 `ignores()` 更接近模擬
	 * `git check-ignore -v` —— 後者同樣會指出命中的模式與其是否為負規則。
	 *
	 * 一次只接受單一路徑，回傳 `{ ignored, unignored, rule }`：
	 * - 被忽略：`ignored: true`，`rule` 為命中的規則（`pattern` 與 `negative`）
	 * - 被負規則救回：`unignored: true`，沒有 `rule`
	 * - 未命中任何規則：兩者皆為 `false`
	 *
	 * @param pathname - 相對路徑（需為正斜線）
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * file.checkIgnore('a.log').ignored // true —— 同 file.ignores('a.log') 的結果
	 * file.checkIgnore('a.log') // { ignored: true, unignored: false, rule: { pattern: '*.log', negative: false } }
	 * // 比 ignores() 多出 rule，即「命中的規則」，因此較接近模擬 git check-ignore -v
	 * file.checkIgnore('keep.log') // { ignored: false, unignored: true } —— 被負規則救回，沒有 rule
	 */
	checkIgnore(pathname: string): ICheckIgnoreResult
	{
		return this.toIgnore().checkIgnore(pathname);
	}

	/**
	 * 回傳路徑的比對結果，同名相容 `ignore` 套件的 `test()`
	 * The matching result of the path, name-compatible with the ignore package's `test()`
	 *
	 * 與 `ignores()` 相同的理由：同名同回傳值，讓接受 ignore 實例的程式碼也能直接傳入 IgnoreFile。
	 * For the same reason as `ignores()`: identical name and return value, so code
	 * accepting an ignore instance also accepts an IgnoreFile directly.
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * file.test('a.log') // { ignored: true, unignored: false, rule: { pattern: '*.log', negative: false } }
	 * file.test('a.js') // { ignored: false, unignored: false } —— 未命中任何規則
	 */
	test(pathname: string): ICheckIgnoreResult
	{
		return this.toIgnore().test(pathname);
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
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * file.filter(['a.log', 'keep.log', 'a.js']) // ['keep.log', 'a.js'] —— 回傳未被忽略的路徑
	 */
	filter(pathnames: ITSArrayListMaybeReadonly<string>): string[]
	{
		return this.toIgnore().filter(pathnames)
	}

	/**
	 * 產生可直接交給 `Array.filter()` 使用的判斷函式
	 *
	 * 回傳的函式對「未被忽略」的路徑回傳 `true`，
	 * 因此 `paths.filter(file.createFilter())` 與 {@link filter} 結果一致。
	 *
	 * 同名相容 `ignore` 套件的 `createFilter()`；與 {@link ignores} 相同的理由，
	 * 接受 ignore 實例的型別也能直接接受 IgnoreFile。
	 *
	 * @example
	 * const file = new IgnoreFile('/path/to/.gitignore', '# notes\n*.log\n\n!keep.log\n')
	 * const keep = file.createFilter()
	 * ['a.log', 'keep.log', 'a.js'].filter(keep) // ['keep.log', 'a.js'] —— 同 file.filter()
	 */
	createFilter()
	{
		return this.toIgnore().createFilter()
	}
}
