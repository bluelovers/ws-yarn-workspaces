//@noUnusedParameters:false

import { test, type TestContext } from 'node:test'
import path from 'upath2'
import { LF } from 'crlf-normalize'
import { IgnoreFile } from '../lib/IgnoreFile'
import { lineType } from '../lib/line-token'
import { __TEST_FIXTURES, __TEST_TEMP } from './__root'
import { snapshotIgnoreFile } from './lib/test-helper'
import { EnumConst, EnumLineType } from '../lib/types';

/**
 * 起點：資料夾內有 nested/.dockerignore，可驗證「指定檔名」的搜尋
 * Start point: the folder holds nested/.dockerignore, used to verify the search by file name
 */
const __NESTED_DIR = path.join(__TEST_FIXTURES, 'ignore-files', 'nested')
const __FIXTURE_DIR = path.join(__TEST_FIXTURES, 'ignore-files')
const __FIXTURE_GITIGNORE = path.join(__FIXTURE_DIR, '.gitignore')

/**
 * 虛擬路徑：內容斷言一律以 stringify() 的回傳值比對，
 * 不建立、不寫入任何檔案，也就沒有清理臨時檔案的必要
 * Virtual path: every content assertion compares the value returned by
 * stringify(); no file is ever created or written, so there is nothing to clean up
 */
const __VIRTUAL_GITIGNORE = path.join(__TEST_TEMP, 'virtual/.gitignore')

/**
 * 與 fixture 內容同步的期望值，作為內容斷言的單一事實來源
 *
 * 建構子會移除首尾空行（結尾換行記入 options.endCount），
 * 因此行模型不含結尾的空字串，fixture 的 `!keep.log\n` 也算一行結尾換行。
 * Expectation kept in sync with the fixture, as the single source of truth for
 * content assertions; the constructor strips leading/trailing blank lines (the
 * end-of-file newline is recorded as options.endCount), so the line model has no
 * trailing empty entry.
 */
const FIXTURE_LINES = [
	'# ignore misc',
	'*.log',
	'',
	'# exception rules',
	'!keep.log',
]

const countType = (lines: readonly string[], type: EnumLineType) =>
	lines.filter(v => lineType(v) === type).length

test(`IgnoreFile.from 讀取後保留註解與空行`, (t: TestContext) =>
{
	const file = IgnoreFile.from(__FIXTURE_GITIGNORE)

	t.assert.strictEqual(file.path, __FIXTURE_GITIGNORE)

	/**
	 * 以快照記錄實際的行模型、規則與輸出內容（不優化時原樣還原含結尾換行），
	 * 並對這三個 getter 欄位做部分比對；
	 * `options` 是自有屬性（非 getter），走「直接比對實例」的另一半，
	 * 用來驗證結尾換行被記入 endCount
	 * The snapshot records the actual line model, rules and output (un-optimized,
	 * with the end-of-file newline restored as-is), and those getter fields are
	 * partially compared. `options` is an own property rather than a getter, so it
	 * takes the other comparison path (against the instance itself) and verifies
	 * that the end-of-file newline was recorded as endCount
	 */
	snapshotIgnoreFile(t, file, {
		lines: FIXTURE_LINES,
		patterns: ['*.log', '!keep.log'],
		content: [
			...FIXTURE_LINES,
			'',
		].join('\n'),
		options: { startCount: 0, endCount: 1 },
	})
})

test(`add/remove 編輯後註解與空行仍在`, (t: TestContext) =>
{
	const file = IgnoreFile.from(__FIXTURE_GITIGNORE)

	file.add('*.tmp', '*.tmp', '*.css')
	file.remove('*.log', '*.css')

	t.assert.strictEqual(file.has('*.tmp'), true)
	t.assert.strictEqual(file.has('*.css'), false, `同批內新增後又移除`)
	t.assert.strictEqual(file.has('*.log'), false)

	/**
	 * 整批只重建一次行陣列，結果與逐條處理一致
	 * The whole batch rebuilds the lines once, with the same result as per-item processing
	 */
	t.assert.strictEqual(countType(file.lines, EnumLineType.Comment), countType(FIXTURE_LINES, EnumLineType.Comment))
	t.assert.strictEqual(countType(file.lines, EnumLineType.Blank), countType(FIXTURE_LINES, EnumLineType.Blank))

	/**
	 * 快照記錄編輯後的實際行模型，只對規則欄位做部分比對
	 * The snapshot records the actual line model after editing; only the rules are partially compared
	 */
	snapshotIgnoreFile(t, file, {
		patterns: ['!keep.log', '*.tmp'],
	})
})

test(`addList 批次新增規則，force 可跳過前方規則比對`, (t: TestContext) =>
{
	const file = IgnoreFile.from(__FIXTURE_GITIGNORE)

	/**
	 * 回傳 `this` 可繼續串接；同批次的重複項先收斂成一條，
	 * 再逐條與「插入位置前方最近的規則」比對，註解與空行維持原位不動
	 */
	t.assert.strictEqual(file.addList(['*.tmp', '*.tmp', 'lib/**/*.ts']), file)

	t.assert.deepStrictEqual([...file.lines], [
		'# ignore misc',
		'*.log',
		'',
		'# exception rules',
		'!keep.log',
		'*.tmp',
		'lib/**/*.ts',
	])

	/**
	 * 不帶 `force`：前方（最後一列）已是同一條規則，重複項被略過，
	 * 行陣列不變、仍是同一列
	 */
	file.addList(['lib/**/*.ts'])

	t.assert.strictEqual([...file.lines].filter(v => v === 'lib/**/*.ts').length, 1)

	/**
	 * `force: true`：跳過前方規則比對直接插入，因此出現重複列
	 */
	file.addList(['lib/**/*.ts'], true)

	t.assert.strictEqual([...file.lines].filter(v => v === 'lib/**/*.ts').length, 2)

	/**
	 * 快照記錄編輯後的實際行模型、規則與內容：
	 * 規則列照實記錄（含重複插入的那一列），內容為未優化的原樣輸出
	 */
	snapshotIgnoreFile(t, file, {
		lines: [
			'# ignore misc',
			'*.log',
			'',
			'# exception rules',
			'!keep.log',
			'*.tmp',
			'lib/**/*.ts',
			'lib/**/*.ts',
		],
		patterns: [
			'*.log',
			'!keep.log',
			'*.tmp',
			'lib/**/*.ts',
			'lib/**/*.ts',
		],
		content: [
			'# ignore misc',
			'*.log',
			'',
			'# exception rules',
			'!keep.log',
			'*.tmp',
			'lib/**/*.ts',
			'lib/**/*.ts',
			'',
		].join('\n'),
	})
})

test(`stringify 輸出後重新載入，內容一致`, (t: TestContext) =>
{
	const file = IgnoreFile.from(__FIXTURE_GITIGNORE)

	file.add('*.tmp')
	file.remove('!keep.log')

	/**
	 * stringify() 預設先優化再輸出；以虛擬路徑重新載入同一份輸出，不寫入磁碟
	 * stringify() optimizes before output by default; the same output is reloaded
	 * through a virtual path, without touching the disk
	 */
	const saved = file.stringify()
	const reloaded = new IgnoreFile(__VIRTUAL_GITIGNORE, saved)

	t.assert.strictEqual(reloaded.stringify({ disableOptimize: false }), saved, `輸出與重新載入一致`)
	t.assert.strictEqual(countType(reloaded.lines, EnumLineType.Comment), countType(FIXTURE_LINES, EnumLineType.Comment), `輸出後仍有註解`)
	t.assert.strictEqual(countType(reloaded.lines, EnumLineType.Blank), countType(FIXTURE_LINES, EnumLineType.Blank), `輸出後仍有空行`)

	/**
	 * 快照記錄重新載入後的實際狀態：行模型與原實例一致，內容即當初的輸出
	 * The snapshot records the actual state after reloading: the line model matches
	 * the original instance and the content is the earlier output
	 */
	snapshotIgnoreFile(t, reloaded, {
		lines: [...file.lines],
		patterns: ['*.log', '*.tmp'],
		content: saved,
	})
})

test(`find 必須指定檔名，回傳對應的 ignore 檔案`, (t: TestContext) =>
{
	const docker = IgnoreFile.find('.dockerignore', __NESTED_DIR)
	const gitignore = IgnoreFile.find('.gitignore', __NESTED_DIR)

	t.assert.ok(docker instanceof IgnoreFile)
	t.assert.strictEqual(docker?.path, path.join(__NESTED_DIR, '.dockerignore'), `最近的 .dockerignore`)
	t.assert.strictEqual(gitignore?.path, path.join(__FIXTURE_DIR, '.gitignore'), `最近的 .gitignore`)
	t.assert.notStrictEqual(docker?.path, gitignore?.path, `指定不同檔名應回傳不同檔案`)

	const missing = IgnoreFile.find('.not-exist-ignore-file', __NESTED_DIR)

	t.assert.strictEqual(missing, undefined, `範圍內沒有該檔案時回傳 undefined`)
})

test(`stringify 可選擇是否在輸出前執行優化`, (t: TestContext) =>
{
	const raw = [
		'# note',
		'*.log',
		'*.log',
		'',
		'',
		'',
		'',
	]

	const optimized = new IgnoreFile(__VIRTUAL_GITIGNORE, raw.join('\n'))

	/**
	 * 預設輸出前執行優化：重複規則只留最後一筆，
	 * 建構時記錄的 endCount 只負責還原結尾換行，仍會收合成上限
	 * By default the content is optimized before output: the duplicate rule keeps
	 * only its last occurrence; the endCount recorded by the constructor restores
	 * the end-of-file newline, which is still clamped to the upper bound
	 */
	t.assert.strictEqual(optimized.stringify(), [
		'# note',
		'*.log',
		'',
		'',
		'',
	].join('\n'))

	/**
	 * 快照記錄優化後的實際行模型與內容
	 * The snapshot records the actual line model and content after optimizing
	 */
	snapshotIgnoreFile(t, optimized, {
		lines: [
			'# note',
			'*.log',
		],
		content: [
			'# note',
			'*.log',
			'',
			'',
			'',
		].join('\n'),
	})

	const kept = new IgnoreFile(__VIRTUAL_GITIGNORE, raw)
	const keptContent = kept.stringify({ disableOptimize: false })

	t.assert.strictEqual(keptContent, [
		'# note',
		'*.log',
		'*.log',
		'',
		'',
		'',
	].join('\n'), `disableOptimize:false 跳過優化，重複規則原樣保留`)

	/**
	 * 快照記錄未優化的實際行模型：重複規則仍在；
	 * 一併驗證非 getter 欄位 options：跳過優化不影響建構時記錄的結尾換行數
	 * The snapshot records the actual line model without optimization: the
	 * duplicate is still there; the non-getter field options is verified as well:
	 * skipping the optimization leaves the recorded end-of-file newline count intact
	 */
	snapshotIgnoreFile(t, kept, {
		lines: [
			'# note',
			'*.log',
			'*.log',
		],
		options: { startCount: 0, endCount: 4 },
	})

	/**
	 * stringify() 的 optimizations 覆寫實例設定：本次收合空行、但不影響實例上的預設值
	 * The stringify() optimizations override the instance settings for this call only
	 */
	const overridden = new IgnoreFile(__VIRTUAL_GITIGNORE, raw.join('\n'), {
		optimizations: {
			disableCollapseBlankLines: true,
		},
	})

	t.assert.strictEqual(overridden.stringify({ optimizations: { disableCollapseBlankLines: false } }), [
		'# note',
		'*.log',
		'',
		'',
		'',
	].join('\n'))

	t.assert.deepStrictEqual(overridden.options.optimizations, { disableCollapseBlankLines: true }, `實例設定不被 stringify() 改動`)

	/**
	 * 快照記錄覆寫選項後的實際結果：本次照常收合，行陣列已被 finalize() 更新
	 * The snapshot records the actual result after overriding the options: the
	 * call still collapses, and the lines have been updated by finalize()
	 */
	snapshotIgnoreFile(t, overridden, {
		lines: [
			'# note',
			'*.log',
		],
		content: [
			'# note',
			'*.log',
			'',
			'',
			'',
		].join('\n'),
	})
})

test(`options.optimizations 是 stringify() / finalize() 的預設設定`, (t: TestContext) =>
{
	const raw = [
		'*.log',
		'*.log',
		'',
		'',
		'',
		'',
	]

	/**
	 * 以實例設定停用空行收合，stringify() 不帶參數時應沿用它
	 * The instance setting disables blank collapsing, which stringify() without
	 * arguments honours
	 */
	const file = new IgnoreFile(__VIRTUAL_GITIGNORE, raw.join('\n'), {
		optimizations: {
			disableCollapseBlankLines: true,
		},
	})

	t.assert.strictEqual(file.stringify(), '*.log\n\n\n')

	/**
	 * 快照記錄實際的行模型與內容：去重已執行、收合依實例設定停用；
	 * 非 getter 欄位 options 一併驗證——實例設定維持 disableCollapseBlankLines:true，
	 * 建構時記錄的結尾換行數也不會被 stringify() 改寫
	 * The snapshot records the actual line model and content: dedupe ran, while
	 * collapsing is off per the instance settings; the non-getter field options is
	 * verified as well — the instance setting keeps disableCollapseBlankLines:true,
	 * and the recorded end-of-file newline count is not rewritten by stringify()
	 */
	snapshotIgnoreFile(t, file, {
		lines: ['*.log'],
		content: '*.log\n\n\n',
		options: {
			optimizations: { disableCollapseBlankLines: true },
			startCount: 0,
			endCount: 4,
		},
	})

	/**
	 * 傳入的選項優先於實例設定
	 * Options passed at call time take precedence over the instance settings
	 */
	file.finalize({ disableCollapseBlankLines: false })

	t.assert.deepStrictEqual([...file.lines], ['*.log'])
})

test(`optimizations.disableDedupePatternsComment 保留重複的註解`, (t: TestContext) =>
{
	const raw = [
		'# note',
		'*.log',
		'*.log',
		'# note',
		'',
	]

	/**
	 * 以實例設定停用「對註解也去重」：stringify() 優化後，
	 * 重複的 `# note` 兩列都在，重複的 `*.log` 仍只留最後一筆
	 */
	const commented = new IgnoreFile(__VIRTUAL_GITIGNORE, raw.join('\n'), {
		optimizations: {
			disableDedupePatternsComment: true,
		},
	})

	t.assert.strictEqual(commented.stringify(), [
		'# note',
		'*.log',
		'# note',
		'',
	].join('\n'))

	/**
	 * 快照記錄選項生效後的實際行模型與內容：
	 * 規則行照常去重，註解則保留兩列
	 */
	snapshotIgnoreFile(t, commented, {
		lines: [
			'# note',
			'*.log',
			'# note',
		],
		patterns: ['*.log'],
		content: [
			'# note',
			'*.log',
			'# note',
			'',
		].join('\n'),
	})

	/**
	 * 對照：未指定該選項時，預設連同重複註解一起去重，
	 * 先出現的 `# note` 被移除，只留下最後一筆
	 */
	const optimized = new IgnoreFile(__VIRTUAL_GITIGNORE, raw.join('\n'))

	t.assert.strictEqual(optimized.stringify(), [
		'*.log',
		'# note',
		'',
	].join('\n'))

	/**
	 * 快照記錄預設行為的實際行模型與內容，與上一份對照
	 */
	snapshotIgnoreFile(t, optimized, {
		lines: [
			'*.log',
			'# note',
		],
		patterns: ['*.log'],
		content: [
			'*.log',
			'# note',
			'',
		].join('\n'),
	})
})

test(`isIgnored / filter 依規則比對路徑`, (t: TestContext) =>
{
	const file = new IgnoreFile(__VIRTUAL_GITIGNORE, [
		'*.log',
		'',
		'# 只保留 keep.log / keep keep.log only',
		'!keep.log',
		'',
	].join('\n'))

	t.assert.strictEqual(file.isIgnored('a.log'), true)
	t.assert.strictEqual(file.isIgnored('keep.log'), false)
	t.assert.strictEqual(file.isIgnored('a.js'), false)
	t.assert.strictEqual(file.ignores('a.log'), true, `ignores 為 isIgnored 的別名`)
	t.assert.deepStrictEqual(file.filter(['a.log', 'keep.log', 'a.js']), ['keep.log', 'a.js'])
})

test(`createFilter 產生可用於 array.filter() 的函式`, (t: TestContext) =>
{
	const file = new IgnoreFile(__VIRTUAL_GITIGNORE, [
		'*.log',
		'',
		'# 只保留 keep.log / keep keep.log only',
		'!keep.log',
		'',
	].join('\n'))

	const filter = file.createFilter()

	const paths = ['a.log', 'keep.log', 'a.js', 'docs/readme.md']

	/**
	 * 回傳的函式直接交給 Array.filter：
	 * 被忽略的路徑（`a.log`）被濾掉，其餘原樣保留，結果同 `file.filter()`
	 */
	t.assert.deepStrictEqual(paths.filter(filter), ['keep.log', 'a.js', 'docs/readme.md'])
	t.assert.deepStrictEqual(paths.filter(filter), file.filter(paths))

	/**
	 * 快照保存逐筆判斷（`true` 保留、`false` 被忽略），
	 * 藉此看出 `!keep.log` 讓 `keep.log` 得以保留
	 */
	t.assert.snapshot(paths.map(pathname => ({
		pathname,
		keep: filter(pathname),
	})))
})

test(`checkIgnore 回傳比對命中的規則`, (t: TestContext) =>
{
	const file = new IgnoreFile(__VIRTUAL_GITIGNORE, [
		'*.log',
		'',
		'# 只保留 keep.log / keep keep.log only',
		'!keep.log',
		'',
	].join('\n'))

	const ignored = file.checkIgnore('a.log')
	const kept = file.checkIgnore('keep.log')

	/**
	 * 被忽略的路徑回傳命中的規則（`rule.pattern` 即命中的模式）；
	 * 被負規則救回的路徑只回傳判斷結果、沒有 `rule`
	 */
	t.assert.strictEqual(ignored.ignored, true)
	t.assert.strictEqual(ignored.rule?.pattern, '*.log')
	t.assert.strictEqual(ignored.rule?.negative, false)
	t.assert.strictEqual(kept.ignored, false)
	t.assert.strictEqual(kept.unignored, true)
	t.assert.strictEqual('rule' in kept, false)

	/**
	 * 快照保存三種路徑的實際回傳結構，供事後對照 `ignore` 套件的回傳格式
	 */
	t.assert.snapshot({
		'a.log': ignored,
		'keep.log': kept,
		'a.js': file.checkIgnore('a.js'),
	})
})

test(`檔案不存在時視為空白檔案`, (t: TestContext) =>
{
	const missing = path.join(__FIXTURE_DIR, '.not-exist-ignore-file')
	const file = IgnoreFile.from(missing)

	/**
	 * 三個 getter 欄位皆為空；非 getter 欄位 options 驗證空白檔案的 startCount / endCount 為 0
	 * All three getter fields are empty; the non-getter field options verifies that
	 * an empty file yields a zero startCount / endCount
	 */
	snapshotIgnoreFile(t, file, {
		lines: [],
		patterns: [],
		content: '',
		options: { startCount: 0, endCount: 0 },
	})
})

test(`content 的 startCount 超出範圍時收斂`, (t: TestContext) =>
{
	const file = new IgnoreFile(__VIRTUAL_GITIGNORE, '\n\n*.log')

	const __constructed = { options: { ...file.options }, content: file.content }

	file.options.startCount = -1

	const __negative = { options: { ...file.options }, content: file.content }

	file.options.startCount = EnumConst.MAX_BLANK_LINES + 1

	const __aboveBound = { options: { ...file.options }, content: file.content }

	/**
	 * 快照保存三個階段的 `options` 與實際輸出：建構後原樣還原、
	 * 以及 `startCount` 被改成 `-1` 與上限 + 1 時輸出如何收斂；
	 * `options` 保留原值（收斂只發生在輸出階段）
	 * The snapshot preserves `options` and the actual output of three stages:
	 * restored as-is after construction, then how the output converges once
	 * `startCount` is written out of range as `-1` and one past the bound; note
	 * that `options` keeps the raw value and the convergence only happens on
	 * output
	 */
	t.assert.snapshot([
		{ label: '建構後原樣還原', ...__constructed },
		{ label: 'startCount = -1 → 收斂到 0', ...__negative },
		{ label: 'startCount = 上限 + 1 → 收斂到上限', ...__aboveBound },
	])

	/**
	 * 建構時剝除的 2 個前導空行記入 startCount 並原樣還原，
	 * 結尾沒有換行因此 endCount 為 0
	 * The 2 leading blanks stripped at construction are recorded as startCount and
	 * restored as-is; there is no trailing newline, so endCount is 0
	 */
	t.assert.deepStrictEqual(__constructed.options, { startCount: 2, endCount: 0 })
	t.assert.strictEqual(__constructed.content, LF.repeat(2) + '*.log')

	/**
	 * 事後被改寫成範圍外的 startCount 在輸出時收斂：
	 * `-1` → 0 行（沒有前導換行）、上限 + 1 → 上限，
	 * 而不是回歸預設上限（兩者皆 3 行）；endCount 維持回歸預設值的規則
	 * A startCount written out of range after construction converges on output:
	 * `-1` → 0 lines (no leading newlines) and one past the bound → the bound,
	 * instead of falling back to the default bound (3 lines in both cases);
	 * endCount keeps its fall-back rule
	 */
	t.assert.strictEqual(__negative.content, '*.log')
	t.assert.strictEqual(__aboveBound.content, LF.repeat(EnumConst.MAX_BLANK_LINES) + '*.log')
})
