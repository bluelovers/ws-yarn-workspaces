//@noUnusedParameters:false

import { test, before, type TestContext } from 'node:test'
import {
	addPatterns,
	collapseIgnoreBlankLines,
	dedupeIgnorePatterns,
	finalizeIgnoreLines,
} from '../lib/lines'
import { EnumConst } from '../lib/types'
import { _omitBlankLines } from '../lib/normalize'

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
		'',
		'*.log',
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

	t.assert.deepStrictEqual(next, ['*.log', '', '*.tmp'])

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
	t.assert.strictEqual(next.filter(v => v === '').length, 2)
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

test(`finalizeIgnoreLines 可個別關閉整理項目`, () =>
{
	const lines = [
		'',
		'',
		'*.log',
		'*.log',
		'',
		'',
		'',
		'',
		'*.123',
		'',
		'',
		'',
	]

	test(`{ dedupePatterns: false }`, (t: TestContext) => {

		/**
		 * 個別執行 dedupeIgnorePatterns：重複的 `*.log` 只保留最後一筆，
		 * 前導與結尾的空行維持原樣，不做任何收合
		 * Running dedupeIgnorePatterns on its own keeps only the last `*.log`;
		 * leading and trailing blank lines stay exactly as they were
		 */
		t.assert.deepStrictEqual(dedupeIgnorePatterns(lines), [
			'',
			'',
			'*.log',
			'',
			'',
			'',
			'',
			'*.123',
			'',
			'',
			'',
		])

		/**
		 * 對照：關掉 `dedupePatterns` 後，兩行 `*.log` 都保留，
		 * 其餘整理（收合空行、移除首尾空行）照常執行
		 * For comparison: with `dedupePatterns` off both `*.log` lines survive,
		 * while the other steps (collapse, strip ends) still run
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { dedupePatterns: false }), [
			'*.log',
			'*.log',
			'',
			'',
			'',
			'*.123',
		])
	});

	test(`{ collapseBlankLines: false }`, (t: TestContext) => {

		/**
		 * 個別執行 collapseIgnoreBlankLines：中段 4 個空行收合成上限
		 * ${EnumConst.MAX_BLANK_LINES} 個，前導與結尾的空行維持原樣
		 * Running collapseIgnoreBlankLines on its own shrinks the middle run of
		 * 4 blank lines to the ${EnumConst.MAX_BLANK_LINES}-line bound; the leading
		 * and trailing blanks stay exactly as they were
		 */
		t.assert.deepStrictEqual(collapseIgnoreBlankLines(lines), [
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
		])

		/**
		 * 對照：關掉 `collapseBlankLines` 後，中段 4 個空行原樣保留，
		 * 但去重與移除首尾空行照常執行
		 * For comparison: with `collapseBlankLines` off the middle run of 4 blank
		 * lines is untouched, while dedupe and stripping still run
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { collapseBlankLines: false }), [
			'*.log',
			'',
			'',
			'',
			'',
			'*.123',
		])
	});

	test(`{ omitBlankLines: false }`, (t: TestContext) => {

		/**
		 * 個別執行 _omitBlankLines：只移除開頭與結尾的空行，
		 * 並回報 startCount / endCount 供還原用；會直接修改傳入的陣列，故傳入副本
		 * Running _omitBlankLines on its own only strips the leading and trailing
		 * blanks and reports startCount / endCount for restoration; it mutates the
		 * input array, so a copy is passed in
		 */
		t.assert.deepStrictEqual(_omitBlankLines([...lines]), {
			lines: [
				'*.log',
				'*.log',
				'',
				'',
				'',
				'',
				'*.123',
			],
			startCount: 2,
			endCount: 3,
		})

		/**
		 * 對照：關掉 `omitBlankLines` 後，去重與收合的結果不再被裁掉首尾空行
		 * For comparison: with `omitBlankLines` off the result of dedupe plus
		 * collapse keeps its leading and trailing blank lines
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { omitBlankLines: false }), [
			'',
			'',
			'*.log',
			'',
			'',
			'',
			'*.123',
			'',
			'',
			'',
		])
	});

	test(`預設行為`, (t: TestContext) => {

		t.assert.deepStrictEqual(finalizeIgnoreLines(lines), [
			'*.log',
			'',
			'',
			'',
			'*.123',
		])

		/**
		 * 三項個別整理依序套用（去重 → 收合 → 移除首尾空行）與預設行為一致
		 * Applying the three steps in sequence (dedupe → collapse → strip ends)
		 * matches the default behaviour
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines),
			_omitBlankLines(collapseIgnoreBlankLines(dedupeIgnorePatterns([...lines]))).lines)

		/**
		 * 關掉全部三項整理時，行陣列完全不變
		 * With all three steps disabled the lines come back unchanged
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, {
			dedupePatterns: false,
			collapseBlankLines: false,
			omitBlankLines: false,
		}), [...lines])
	});

})
