//@noUnusedParameters:false

import { test, before, type TestContext } from 'node:test'
import {
	addPatterns,
	collapseIgnoreBlankLines,
	dedupeIgnorePatterns,
	finalizeIgnoreLines,
} from '../lib/lines'
import { EnumConst } from '../lib/types'

before(() =>
{

})

test(`addPatterns 只比對插入點前方最近的規則`, (t: TestContext) =>
{
	/**
	 * 插入點前方是 `*.tmp` 而非 `*.log`，因此遠處的 `*.log` 不會被移除，
	 * 「新增」只負責插入，不做全檔去重
	 * The rule right before the insertion point is `*.tmp`, not `*.log`, so the
	 * distant `*.log` stays; adding only inserts and never dedupes the whole file
	 */
	const lines = [
		'# a',
		'*.log',
		'',
		'*.tmp',
		'',
	]

	const next = addPatterns(lines, ['*.log', '*.log'])

	t.assert.deepStrictEqual(next, [
		'# a',
		'*.log',
		'',
		'*.tmp',
		'*.log',
		'',
	])

	/**
	 * 同批次的第二筆與剛插入的第一筆相鄰，前方規則相同即略過
	 * The second entry of the same batch is adjacent to the first inserted one,
	 * so it is skipped when the preceding rule matches
	 */
	t.assert.strictEqual(next.filter(v => v === '*.log').length, 2)
})

test(`addPatterns 插入位置維持在檔案結尾換行之前`, (t: TestContext) =>
{
	const next = addPatterns(['*.log', ''], ['*.tmp'])

	t.assert.deepStrictEqual(next, ['*.log', '*.tmp', ''])

	/**
	 * 內容不以換行結尾時，直接接在最後
	 * When the content does not end with a newline, it is appended at the very end
	 */
	t.assert.deepStrictEqual(addPatterns(['*.log'], ['*.tmp']), ['*.log', '*.tmp'])
})

test(`finalizeIgnoreLines 去重只保留最後一筆，註解不受影響`, (t: TestContext) =>
{
	const lines = [
		'# a',
		'*.log',
		'*.log',
		'',
		'# b',
		'',
		'*.log',
		'',
	]

	const next = finalizeIgnoreLines(lines)

	t.assert.deepStrictEqual(next, [
		'# a',
		'',
		'# b',
		'',
		'*.log',
	])

	/**
	 * 註解與空行的數量、位置完全不變，只有重複的規則行被移除
	 * The count and position of comments and blank lines are untouched; only
	 * duplicated rule lines are dropped
	 */
	t.assert.strictEqual(next.filter(v => v.startsWith('#')).length, 2)
	t.assert.strictEqual(next.filter(v => v === '').length, 3)
	t.assert.deepStrictEqual(next.filter(v => !v.startsWith('#') && v !== ''), ['*.log'])
})

test(`finalizeIgnoreLines 收合超過 ${EnumConst.MAX_BLANK_LINES} 個的連續空行`, (t: TestContext) =>
{
	t.assert.deepStrictEqual(collapseIgnoreBlankLines([
		'# a',
		'',
		'',
		'*.log',
		'',
	]), [
		'# a',
		'',
		'',
		'*.log',
		'',
	])

	t.assert.deepStrictEqual(collapseIgnoreBlankLines([
		'# a',
		'',
		'',
		'',
		'*.log',
		'',
	]), [
		'# a',
		'',
		'',
		'',
		'*.log',
		'',
	])

	t.assert.deepStrictEqual(collapseIgnoreBlankLines([
		'# a',
		'',
		'',
		'',
		'',
		'*.log',
		'',
	]), [
		'# a',
		'',
		'',
		'',
		'*.log',
		'',
	])

	/**
	 * 被註解或規則分隔的空行各自獨立計算，不會跨段收合
	 * Blank runs separated by a comment or a rule are counted independently
	 */
	t.assert.deepStrictEqual(collapseIgnoreBlankLines(['', '', '# a', '', '', '']), [
		'',
		'',
		'# a',
		'',
		'',
		'',
	])
})

test(`finalizeIgnoreLines 可個別關閉整理項目`, (t: TestContext) =>
{
	const lines = [
		'',
		'',
		'*.log',
		'*.log',
		'',
		'',
		'',
		'*.123',
		'',
		'',
		'',
	]

	t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { dedupePatterns: false }), [
		'*.log',
		'*.log',
		'',
		'',
		'',
		'*.123',
	])

	t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { collapseBlankLines: false }), [
		'*.log',
		'',
		'',
		'',
		'',
		'*.123',
	])

	t.assert.deepStrictEqual(dedupeIgnorePatterns(lines), ['*.log', '', '', '', ''])
})
