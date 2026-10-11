import { test, type TestContext } from 'node:test'
import ignore from 'ignore'
import { _extractRules, _isLibIgnore, KEY_IGNORE, KEY_IGNORE_LEGACY } from '../lib/core'

test(`_isLibIgnore 判斷是否為 ignore 套件實例`, (t: TestContext) =>
{
	const lib = ignore().add([
		'*.log',
		'!keep.log',
	])

	const __cases: { label: string, value: unknown, expected: boolean }[] = [
		{ label: 'ignore 實例', value: lib, expected: true },
		{ label: '自帶 KEY_IGNORE 標記的物件', value: { [KEY_IGNORE]: true }, expected: true },
		{ label: '一般物件', value: {}, expected: false },
		{ label: 'ignore 工廠函式', value: ignore, expected: false },
		{ label: '字串 node-ignore', value: KEY_IGNORE_LEGACY, expected: false },
		{ label: 'null', value: null, expected: false },
		{ label: 'undefined', value: undefined, expected: false },
	]

	/**
	 * 快照保存每個輸入的判斷結果（一律為布林），
	 * 可看出只有 ignore 實例與自帶 `KEY_IGNORE` 標記的物件會被認定為 ignore 套件
	 */
	t.assert.snapshot(__cases.map(({ label, value }) => ({
		label,
		result: _isLibIgnore(value),
	})))

	/**
	 * 最小斷言：逐案比對預期的布林結果
	 */
	for (const { label, value, expected } of __cases)
	{
		t.assert.strictEqual(_isLibIgnore(value), expected, label)
	}
})

test(`_extractRules 只在 _isLibIgnore 為 true 時才驗證後續邏輯`, (t: TestContext) =>
{
	const lib = ignore().add([
		'*.log',
		'!keep.log',
		'node_modules/',
	])

	const __cases: { label: string, value: unknown }[] = [
		{ label: 'ignore 實例', value: lib },
		{ label: '一般物件', value: {} },
	]

	/**
	 * 快照保存「守衛 → 抽取」的走訪結果：
	 * 守衛通過才取出規則，未通過一律標記為略過，完全不碰規則邏輯
	 */
	t.assert.snapshot(__cases.map(({ label, value }) =>
	{
		/**
		 * 前置守衛：不是 ignore 套件實例就跳過後續規則邏輯
		 */
		if (!_isLibIgnore(value))
		{
			return {
				label,
				isLibIgnore: false,
				rules: '(skipped)',
			}
		}

		return {
			label,
			isLibIgnore: true,
			rules: _extractRules(value),
		}
	}))

	/**
	 * 前置守衛通過才做最小斷言
	 */
	if (!_isLibIgnore(lib))
	{
		return
	}

	const rules = _extractRules(lib)

	t.assert.ok(Array.isArray(rules), `回傳規則陣列`)
	t.assert.strictEqual(rules?.length, 3)
	t.assert.deepStrictEqual(rules?.map(({ pattern, negative }) => ({ pattern, negative })), [
		{ pattern: '*.log', negative: false },
		{ pattern: '!keep.log', negative: true },
		{ pattern: 'node_modules/', negative: false },
	])
})

test(`_extractRules 的規則不含空白行與註解`, (t: TestContext) =>
{
	const lib = ignore().add([
		'# 只是註解',
		'',
		'*.log',
		'   ',
		'!keep.log',
		'node_modules/',
	])

	/**
	 * 前置守衛：不是 ignore 套件實例就跳過後續規則邏輯
	 */
	if (!_isLibIgnore(lib))
	{
		return
	}

	const rules = _extractRules(lib)

	/**
	 * 快照保存抽出的規則：註解與純空白行在加入時就被略過，
	 * 只有真正的規則會出現在內部規則陣列
	 */
	t.assert.snapshot(rules?.map(({ pattern, negative }) => ({ pattern, negative })))

	t.assert.deepStrictEqual(rules?.map(({ pattern }) => pattern), [
		'*.log',
		'!keep.log',
		'node_modules/',
	])

	/**
	 * 最小斷言：規則陣列裡沒有註解、也沒有空白行
	 */
	t.assert.strictEqual(rules?.some(({ pattern }) => pattern.startsWith('#')), false, `不含註解`)
	t.assert.strictEqual(rules?.some(({ pattern }) => pattern.trim() === ''), false, `不含空白行`)

	/**
	 * 只有註解與空白行時，內部規則陣列為空（一樣先過守衛再驗證）
	 */
	const onlyBlank = ignore().add(['', '# only comment', '   '])

	if (!_isLibIgnore(onlyBlank))
	{
		return
	}

	t.assert.deepStrictEqual(_extractRules(onlyBlank), [])
})

test(`ignore 套件對空白與註解的認定邊界`, (t: TestContext) =>
{
	const lib = ignore().add([
		'\t',
		' #c',
		'  a  ',
	])

	/**
	 * ignore 套件只把「純空格」當空白行、只把「行首緊接 #」當註解，
	 * 其餘一律視為規則原樣保留：僅含 tab 的行、`#` 前有空白、規則前後有空白
	 */
	t.assert.snapshot(_extractRules(lib)?.map(({ pattern, negative }) => ({ pattern, negative })))

	t.assert.deepStrictEqual(_extractRules(lib)?.map(({ pattern }) => pattern), [
		'\t',
		' #c',
		'  a  ',
	])
})
