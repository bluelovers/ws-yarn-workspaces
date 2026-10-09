//@noUnusedParameters:false

import { test, after, before, type TestContext } from 'node:test'
import { existsSync, readFileSync, removeSync } from 'fs-extra'
import path from 'upath2'
import { IgnoreFile } from '../lib/IgnoreFile'
import { EnumLineType, lineType, serializeLines } from '../lib/lines'
import { __TEST_FIXTURES, __TEST_TEMP } from './__root'

/**
 * 起點：資料夾內有 nested/.dockerignore，可驗證「指定檔名」的搜尋
 * Start point: the folder holds nested/.dockerignore, used to verify the search by file name
 */
const __NESTED_DIR = path.join(__TEST_FIXTURES, 'ignore-files', 'nested')
const __FIXTURE_DIR = path.join(__TEST_FIXTURES, 'ignore-files')
const __FIXTURE_GITIGNORE = path.join(__FIXTURE_DIR, '.gitignore')

/**
 * 可寫的臨時目錄，每個測試前清空
 * Writable temp directory, cleaned before each run
 */
const __TEMP_DIR = path.join(__TEST_TEMP, 'ignore-file')
const __TEMP_GITIGNORE = path.join(__TEMP_DIR, '.gitignore')

/**
 * 與 fixture 內容同步的期望值，作為內容斷言的單一事實來源
 * Expectation kept in sync with the fixture, as the single source of truth for content assertions
 */
const FIXTURE_LINES = [
	'# ignore misc',
	'*.log',
	'',
	'# exception rules',
	'!keep.log',
	'',
]

const countType = (lines: readonly string[], type: EnumLineType) =>
	lines.filter(v => lineType(v) === type).length

before(() =>
{
	removeSync(__TEMP_DIR)
})

/**
 * 清除測試產生的臨時檔案，避免殘留 / Remove generated temp files so nothing is left behind
 */
after(() =>
{
	removeSync(__TEMP_DIR)
})

test(`IgnoreFile.from 讀取後保留註解與空行`, (t: TestContext) =>
{
	const file = IgnoreFile.from(__FIXTURE_GITIGNORE)

	t.assert.strictEqual(file.path, __FIXTURE_GITIGNORE)
	t.assert.deepStrictEqual([...file.lines], FIXTURE_LINES, `註解與空行原樣保留 / comments and blank lines are kept as-is`)
	t.assert.deepStrictEqual(file.patterns, ['*.log', '!keep.log'], `只列出規則 / only rules are listed`)
	t.assert.strictEqual(file.content, serializeLines(FIXTURE_LINES), `content 與行模型一致 / content matches the line model`)
})

test(`add/remove 編輯後註解與空行仍在`, (t: TestContext) =>
{
	const file = IgnoreFile.from(__FIXTURE_GITIGNORE)

	file.add('*.tmp', '*.tmp', '*.css')
	file.remove('*.log', '*.css')

	t.assert.strictEqual(file.has('*.tmp'), true)
	t.assert.strictEqual(file.has('*.css'), false, `同批內新增後又移除 / removed within the same batch`)
	t.assert.strictEqual(file.has('*.log'), false)

	/**
	 * 整批只重建一次行陣列，結果與逐條處理一致
	 * The whole batch rebuilds the lines once, with the same result as per-item processing
	 */
	t.assert.deepStrictEqual(file.patterns, ['!keep.log', '*.tmp'])
	t.assert.strictEqual(countType(file.lines, EnumLineType.Comment), countType(FIXTURE_LINES, EnumLineType.Comment))
	t.assert.strictEqual(countType(file.lines, EnumLineType.Blank), countType(FIXTURE_LINES, EnumLineType.Blank))
})

test(`save 保存後重新讀取內容一致`, (t: TestContext) =>
{
	const file = new IgnoreFile(__TEMP_GITIGNORE, IgnoreFile.from(__FIXTURE_GITIGNORE).content)

	file.add('*.tmp')
	file.remove('!keep.log')
	file.save()

	t.assert.strictEqual(existsSync(__TEMP_GITIGNORE), true, `檔案已保存 / file is saved`)

	const reloaded = IgnoreFile.from(__TEMP_GITIGNORE)

	t.assert.strictEqual(reloaded.content, file.content, `保存與讀取一致 / saved content round-trips`)
	t.assert.strictEqual(readFileSync(__TEMP_GITIGNORE, 'utf8'), file.content, `磁碟內容與行模型一致 / disk content matches the line model`)
	t.assert.strictEqual(countType(reloaded.lines, EnumLineType.Comment), countType(FIXTURE_LINES, EnumLineType.Comment), `保存後仍有註解 / comments survive the save`)
	t.assert.strictEqual(countType(reloaded.lines, EnumLineType.Blank), 2, `保存後仍有空行 / blank lines survive the save`)
	t.assert.deepStrictEqual(reloaded.patterns, ['*.log', '*.tmp'])
})

test(`find 必須指定檔名，回傳對應的 ignore 檔案`, (t: TestContext) =>
{
	const docker = IgnoreFile.find('.dockerignore', __NESTED_DIR)
	const gitignore = IgnoreFile.find('.gitignore', __NESTED_DIR)

	t.assert.ok(docker instanceof IgnoreFile)
	t.assert.strictEqual(docker?.path, path.join(__NESTED_DIR, '.dockerignore'), `最近的 .dockerignore / the nearest .dockerignore`)
	t.assert.strictEqual(gitignore?.path, path.join(__FIXTURE_DIR, '.gitignore'), `最近的 .gitignore / the nearest .gitignore`)
	t.assert.notStrictEqual(docker?.path, gitignore?.path, `指定不同檔名應回傳不同檔案 / different file names must resolve to different files`)

	const missing = IgnoreFile.find('.not-exist-ignore-file', __NESTED_DIR)

	t.assert.strictEqual(missing, undefined, `範圍內沒有該檔案時回傳 undefined / undefined when nothing is found`)
})

test(`save 可選擇是否在寫入前執行優化`, (t: TestContext) =>
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

	const optimized = new IgnoreFile(path.join(__TEMP_DIR, 'finalized.gitignore'), raw.join('\n'))
	optimized.save()

	/**
	 * 預設寫入前執行優化：重複規則只留最後一筆、連續空行收合到 2 個
	 * By default the content is optimized before writing: the duplicate rule
	 * keeps only its last occurrence and the blank run shrinks to 2
	 */
	t.assert.deepStrictEqual(readFileSync(optimized.path, 'utf8'), [
		'# note',
		'*.log',
		'',
		'',
		'',
	].join('\n'))

	const kept = new IgnoreFile(path.join(__TEMP_DIR, 'kept.gitignore'), raw.join('\n'))
	kept.save({ disableOptimize: false })

	t.assert.deepStrictEqual(readFileSync(kept.path, 'utf8'), raw.join('\n'), `optimize:false 寫入未優化的內容 / optimize:false writes the un-optimized content`)

	/**
	 * save() 的 optimizations 覆寫實例設定：本次收合空行、但不影響實例上的預設值
	 * The save() optimizations override the instance settings for this call only
	 */
	const overridden = new IgnoreFile(path.join(__TEMP_DIR, 'overridden.gitignore'), raw.join('\n'), {
		optimizations: {
			collapseBlankLines: false,
		},
	})

	overridden.save({ optimizations: { collapseBlankLines: true } })

	t.assert.deepStrictEqual(readFileSync(overridden.path, 'utf8'), [
		'# note',
		'*.log',
		'',
		'',
		'',
	].join('\n'))

	t.assert.deepStrictEqual(overridden.options.optimizations, { collapseBlankLines: false }, `實例設定不被 save() 改動 / instance settings are not mutated by save()`)
	t.assert.deepStrictEqual([...overridden.lines], [
		'# note',
		'*.log',
		'',
		'',
		'',
	])
})

test(`options.optimizations 是 finalize() 的預設設定`, (t: TestContext) =>
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
	 * 以實例設定關掉空行收合，finalize() 不帶參數時應沿用它
	 * The instance setting disables blank collapsing, which finalize() without
	 * arguments honours
	 */
	const file = new IgnoreFile(path.join(__TEMP_DIR, 'opts.gitignore'), raw.join('\n'), {
		optimizations: {
			collapseBlankLines: false,
		},
	})

	t.assert.deepStrictEqual(file.options.optimizations, { collapseBlankLines: false })

	file.finalize()

	t.assert.deepStrictEqual([...file.lines], [
		'*.log',
		'',
		'',
		'',
		'',
	])

	/**
	 * 傳入的選項優先於實例設定
	 * Options passed at call time take precedence over the instance settings
	 */
	file.finalize({ collapseBlankLines: true })

	t.assert.deepStrictEqual([...file.lines], ['*.log', '', '', ''])
})

test(`isIgnored / filter 依規則比對路徑`, (t: TestContext) =>
{
	const file = new IgnoreFile('virtual/.gitignore', [
		'*.log',
		'',
		'# 只保留 keep.log / keep keep.log only',
		'!keep.log',
		'',
	].join('\n'))

	t.assert.strictEqual(file.isIgnored('a.log'), true)
	t.assert.strictEqual(file.isIgnored('keep.log'), false)
	t.assert.strictEqual(file.isIgnored('a.js'), false)
	t.assert.strictEqual(file.ignores('a.log'), true, `ignores 為 isIgnored 的別名 / ignores is an alias of isIgnored`)
	t.assert.deepStrictEqual(file.filter(['a.log', 'keep.log', 'a.js']), ['keep.log', 'a.js'])
})

test(`檔案不存在時視為空白檔案`, (t: TestContext) =>
{
	const missing = path.join(__TEMP_DIR, 'not-exist.gitignore')
	const file = IgnoreFile.from(missing)

	t.assert.strictEqual(existsSync(missing), false)
	t.assert.deepStrictEqual([...file.lines], [''])
	t.assert.deepStrictEqual(file.patterns, [])
	t.assert.strictEqual(file.content, '')
})
