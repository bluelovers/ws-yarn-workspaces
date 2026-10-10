//@noUnusedParameters:false

import { test, before, type TestContext } from 'node:test'
import { LF } from 'crlf-normalize'
import {
	addPatterns,
	collapseIgnoreBlankLines,
	finalizeIgnoreLines,
	stringifyLines,
} from '../lib/lines'
import { EnumConst } from '../lib/types'

import { _omitBlankLines, dedupeIgnorePatterns } from '../lib/line-filter';

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

test(`finalizeIgnoreLines 去重只保留最後一筆，未重複的註解不受影響`, (t: TestContext) =>
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
	 * 本組輸入的兩則註解並不重複，因此數量與位置完全不變；
	 * 空行永遠允許重複，也只有重複的規則行被移除
	 * The two comments in this input are not duplicated, so their count and
	 * position stay untouched; blank lines may always repeat, and only the
	 * duplicated rule lines are dropped
	 */
	t.assert.strictEqual(next.filter(v => v.startsWith('#')).length, 2)
	t.assert.strictEqual(next.filter(v => v === '').length, 2)
	t.assert.deepStrictEqual(next.filter(v => !v.startsWith('#') && v !== ''), ['*.log'])
})

test(`finalizeIgnoreLines 預設連同重複註解一起去重，可用選項保留註解`, (t: TestContext) =>
{
	const lines = [
		'# dup',
		'',
		'# dup',
		'',
		'*.log',
		'*.log',
		'',
	]

	/**
	 * 快照保存三種選項組合的整理結果：
	 * 預設連同重複註解一起去重、`disableDedupePatternsComment` 只停用註解去重、
	 * `disableDedupePatterns` 停用整項去重（規則重複也保留）
	 */
	t.assert.snapshot([
		{
			label: '預設：規則與註解一起去重',
			lines: finalizeIgnoreLines(lines),
		},
		{
			label: 'disableDedupePatternsComment: true：只保留重複的註解',
			lines: finalizeIgnoreLines(lines, { disableDedupePatternsComment: true }),
		},
		{
			label: 'disableDedupePatterns: true：整項去重停用',
			lines: finalizeIgnoreLines(lines, { disableDedupePatterns: true }),
		},
	])

	/**
	 * 預設連註解一起去重：重複的 `# dup` 與 `*.log` 都只留下最後一筆，
	 * 空行則永遠允許重複、維持原樣；首尾空行照常被移除
	 */
	t.assert.deepStrictEqual(finalizeIgnoreLines(lines), [
		'# dup',
		'',
		'*.log',
	])

	/**
	 * 對照：傳 `disableDedupePatternsComment: true` 只對規則行去重，
	 * 重複的註解原樣保留，空行仍允許重複
	 */
	t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { disableDedupePatternsComment: true }), [
		'# dup',
		'',
		'# dup',
		'',
		'*.log',
	])

	/**
	 * `disableDedupePatterns: true` 停用整項去重，規則行的重複也一併保留
	 */
	t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { disableDedupePatterns: true }), [
		'# dup',
		'',
		'# dup',
		'',
		'*.log',
		'*.log',
	])
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

	test(`{ disableDedupePatterns: true }`, (t: TestContext) => {

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
		 * 對照：傳 `disableDedupePatterns: true` 停用去重後，兩行 `*.log` 都保留，
		 * 其餘整理（收合空行、移除首尾空行）照常執行
		 * For comparison: with `disableDedupePatterns: true` both `*.log` lines
		 * survive, while the other steps (collapse, strip ends) still run
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { disableDedupePatterns: true }), [
			'*.log',
			'*.log',
			'',
			'',
			'',
			'*.123',
		])
	});

	test(`{ disableCollapseBlankLines: true }`, (t: TestContext) => {

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
		 * 對照：傳 `disableCollapseBlankLines: true` 停用收合後，中段 4 個空行原樣保留，
		 * 但去重與移除首尾空行照常執行
		 * For comparison: with `disableCollapseBlankLines: true` the middle run of 4
		 * blank lines is untouched, while dedupe and stripping still run
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { disableCollapseBlankLines: true }), [
			'*.log',
			'',
			'',
			'',
			'',
			'*.123',
		])
	});

	test(`{ disableOmitBlankLines: true }`, (t: TestContext) => {

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
		 * 對照：傳 `disableOmitBlankLines: true` 停用移除後，去重與收合的結果不再被裁掉首尾空行
		 * For comparison: with `disableOmitBlankLines: true` the result of dedupe
		 * plus collapse keeps its leading and trailing blank lines
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, { disableOmitBlankLines: true }), [
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
		 * 三項個別整理依序套用（規則與註解去重 → 收合 → 移除首尾空行）與預設行為一致；
		 * 本組資料沒有註解，`disableDedupePatternsComment` 不影響結果
		 * Applying the three steps in sequence (rule/comment dedupe → collapse →
		 * strip ends) matches the default behaviour; this input holds no comments,
		 * so `disableDedupePatternsComment` makes no difference here
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines),
			_omitBlankLines(collapseIgnoreBlankLines(dedupeIgnorePatterns([...lines]))).lines)

		/**
		 * 傳入三個步驟各自的 disable 時，行陣列完全不變
		 * With a disable flag for each of the three steps the lines come back unchanged
		 */
		t.assert.deepStrictEqual(finalizeIgnoreLines(lines, {
			disableDedupePatterns: true,
			disableCollapseBlankLines: true,
			disableOmitBlankLines: true,
		}), [...lines])
	});

})

test(`stringifyLines 的 startCount 收斂、endCount 回歸預設值`, (t: TestContext) =>
{
	const __cases: [
		label: string,
		startCount: number,
		endCount?: number,
	][] = [
		['startCount/endCount 皆 -1', -1, -1],
		['startCount 超出上限', EnumConst.MAX_BLANK_LINES + 1],
		['兩側皆在範圍內', 2, 1],
	];

	/**
	 * 快照保存三種輸入的實際輸出（`output` 含換行、`length` 為字元數），
	 * 用來留存「收斂」與「回歸預設值」兩種整理方式的結果
	 * The snapshot preserves the actual output of the three inputs (`output`
	 * includes the newlines, `length` is the character count), keeping the results
	 * of both ways of normalizing: converging and falling back to the default
	 */
	t.assert.snapshot(__cases.map(([
		label,
		startCount,
		endCount,
	]) => {
		const output = stringifyLines(['*.log'], { startCount, endCount });

		return {
			label,
			output,
			length: output.length,
		}
	}))

	/**
	 * 兩個都超出範圍的計數走不同規則：`startCount` 收斂到範圍內
	 * （`-1` → 0 行、`99` → 上限），`endCount` 則回歸 `_normalizeEndCount`
	 * 內建的預設上限，因此結尾仍有 ${EnumConst.MAX_BLANK_LINES} 個換行
	 * The two out-of-range counts follow different rules: `startCount` converges
	 * into the range (`-1` → 0 lines, `99` → the bound) while `endCount` falls
	 * back to the default bound built into `_normalizeEndCount`, so the tail still
	 * gets ${EnumConst.MAX_BLANK_LINES} newlines
	 */
	t.assert.strictEqual(
		stringifyLines(['*.log'], { startCount: -1, endCount: -1 }),
		'*.log' + LF.repeat(EnumConst.MAX_BLANK_LINES),
	)
	t.assert.strictEqual(
		stringifyLines(['*.log'], { startCount: EnumConst.MAX_BLANK_LINES + 1 }),
		LF.repeat(EnumConst.MAX_BLANK_LINES) + '*.log' + LF.repeat(EnumConst.MAX_BLANK_LINES),
	)

	/**
	 * 對照：兩側原本就在範圍內時原樣保留，不受收斂影響
	 * For comparison: when both sides are already in range they are kept as given
	 * and are unaffected by the convergence
	 */
	t.assert.strictEqual(
		stringifyLines(['*.log'], { startCount: 2, endCount: 1 }),
		LF.repeat(2) + '*.log' + LF,
	)
})
