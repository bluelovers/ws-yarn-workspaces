//@noUnusedParameters:false

import { test, type TestContext } from 'node:test'
import path from 'upath2'
import { IgnoreFile } from '../lib/IgnoreFile'
import { EnumLineType, lineType } from '../lib/lines'
import { __TEST_FIXTURES } from './__root'
import { snapshotIgnoreFile } from './lib/test-helper'

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
const __VIRTUAL_GITIGNORE = 'virtual/.gitignore'

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
			collapseBlankLines: false,
		},
	})

	t.assert.strictEqual(overridden.stringify({ optimizations: { collapseBlankLines: true } }), [
		'# note',
		'*.log',
		'',
		'',
		'',
	].join('\n'))

	t.assert.deepStrictEqual(overridden.options.optimizations, { collapseBlankLines: false }, `實例設定不被 stringify() 改動`)

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
	 * 以實例設定關掉空行收合，stringify() 不帶參數時應沿用它
	 * The instance setting disables blank collapsing, which stringify() without
	 * arguments honours
	 */
	const file = new IgnoreFile(__VIRTUAL_GITIGNORE, raw.join('\n'), {
		optimizations: {
			collapseBlankLines: false,
		},
	})

	t.assert.strictEqual(file.stringify(), '*.log\n\n\n')

	/**
	 * 快照記錄實際的行模型與內容：去重已執行、收合依實例設定關閉；
	 * 非 getter 欄位 options 一併驗證——實例設定維持 collapseBlankLines:false，
	 * 建構時記錄的結尾換行數也不會被 stringify() 改寫
	 * The snapshot records the actual line model and content: dedupe ran, while
	 * collapsing is off per the instance settings; the non-getter field options is
	 * verified as well — the instance setting keeps collapseBlankLines:false, and
	 * the recorded end-of-file newline count is not rewritten by stringify()
	 */
	snapshotIgnoreFile(t, file, {
		lines: ['*.log'],
		content: '*.log\n\n\n',
		options: {
			optimizations: { collapseBlankLines: false },
			startCount: 0,
			endCount: 4,
		},
	})

	/**
	 * 傳入的選項優先於實例設定
	 * Options passed at call time take precedence over the instance settings
	 */
	file.finalize({ collapseBlankLines: true })

	t.assert.deepStrictEqual([...file.lines], ['*.log'])
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
