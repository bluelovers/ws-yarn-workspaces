//@noUnusedParameters:false

import { test, type TestContext } from 'node:test'
import {
	_handleOptionsEndCount,
	_handleOptionsEndCountCore,
	_isEndCount,
	_normalizeEndCount,
} from '../lib/options'
import { EnumConst, IHandleOptionsEndCountOptions, IIgnoreFileOptions } from '../lib/types'

test(`_isEndCount 預設檢查範圍，clamp 時只檢查可用數字`, (t: TestContext) =>
{
	/**
	 * 預設（不傳 `clamp`）要求「同時是範圍內的數字」：`typeof number`、非 `NaN`，
	 * 且落在 `0 ~ MAX_BLANK_LINES`（含上限）；`false` 是「不還原換行」的合法輸入
	 * 但不是計數，而範圍外的數字（`-1`、`99`）、`NaN` 與字串一律當成「未指定」，
	 * 交給預設值處理。
	 * `clamp: true` 只檢查「是數字且非 `NaN`」、不檢查範圍，範圍交給呼叫端收合，
	 * 因此 `99`、`-1` 算「可用的數字」，而 `NaN`、`false`、字串仍然不算
	 * By default (no `clamp`) a count must be a number inside the range at the
	 * same time: `typeof number`, not `NaN`, and within `0 ~ MAX_BLANK_LINES`
	 * (bound inclusive); `false` is a legal "restore nothing" input but not a
	 * count, while out-of-range numbers (`-1`, `99`), `NaN` and strings all count
	 * as "not specified" and fall back to the default. `clamp: true` only checks
	 * "is a number and not `NaN`" and leaves the range to the caller to converge,
	 * so `99` and `-1` are usable numbers while `NaN`, `false` and strings still
	 * are not
	 */
	t.assert.snapshot([
		{ input: 'undefined', result: _isEndCount(undefined) },
		{ input: 'false', result: _isEndCount(false) },
		{ input: 'true', result: _isEndCount(true) },
		{ input: '0', result: _isEndCount(0) },
		{ input: '2', result: _isEndCount(2) },
		{ input: '3 = MAX_BLANK_LINES', result: _isEndCount(EnumConst.MAX_BLANK_LINES) },
		{ input: '99', result: _isEndCount(99) },
		{ input: '-1', result: _isEndCount(-1) },
		{ input: 'NaN', result: _isEndCount(NaN) },
		{ input: `'2'`, result: _isEndCount('2' as never) },
		{ input: '99 + clamp', result: _isEndCount(99, true) },
		{ input: '-1 + clamp', result: _isEndCount(-1, true) },
		{ input: 'NaN + clamp', result: _isEndCount(NaN, true) },
		{ input: 'false + clamp', result: _isEndCount(false, true) },
	])

	/**
	 * 快照之外固定範圍邊界：`0` 與上限本身都算計數，
	 * 上限加一、負數、`false`（不還原換行）與 `NaN`（無效數字）都不算；
	 * `clamp` 模式只放行「是數字」這一項，`NaN` 與 `false` 仍然不算
	 * Beyond the snapshot the range boundary is pinned: `0` and the bound itself
	 * are counts, while one past the bound, a negative number, `false` (restore
	 * nothing) and `NaN` (invalid number) are not; `clamp` only relaxes the
	 * range, so `NaN` and `false` are still rejected
	 */
	t.assert.strictEqual(_isEndCount(0), true)
	t.assert.strictEqual(_isEndCount(EnumConst.MAX_BLANK_LINES), true)
	t.assert.strictEqual(_isEndCount(EnumConst.MAX_BLANK_LINES + 1), false)
	t.assert.strictEqual(_isEndCount(-1), false)
	t.assert.strictEqual(_isEndCount(false), false)
	t.assert.strictEqual(_isEndCount(NaN), false)

	t.assert.strictEqual(_isEndCount(EnumConst.MAX_BLANK_LINES + 1, true), true)
	t.assert.strictEqual(_isEndCount(-1, true), true)
	t.assert.strictEqual(_isEndCount(NaN, true), false)
	t.assert.strictEqual(_isEndCount(false, true), false)
})

test(`_normalizeEndCount 預設回歸預設值，clamp 時收斂到範圍內`, (t: TestContext) =>
{
	const __cases: [
		label: string,
		count?: IIgnoreFileOptions['endCount'],
		defaultCount?: IIgnoreFileOptions['endCount'],
		clamp?: boolean,
	][] = [
		['未指定 → 上限', undefined, undefined],
		['false → 0', false, undefined],
		['0 → 0', 0, undefined],
		['2 → 2', 2, undefined],
		['3 = 上限 → 3', 3, undefined],
		['99 超出範圍 → 上限', 99, undefined],
		['-1 超出範圍 → 上限', -1, undefined],
		['NaN → 視為未指定', NaN, undefined],
		['未指定 + 預設 2 → 2', undefined, 2],
		['未指定 + 預設 false → 上限', undefined, false],
		['未指定 + 預設 99 也超出範圍 → 上限', undefined, 99],
		['已指定時忽略預設值', 3, 0],
		['false 時不回頭採用預設值', false, 2],
		['clamp：99 → 收斂到上限', 99, undefined, true],
		['clamp：-1 → 收斂到 0', -1, undefined, true],
		['clamp：7 → 收斂到上限、忽略預設 0', 7, 0, true],
		['clamp：未指定 → 仍採用預設 2', undefined, 2, true],
		['clamp：false → 仍歸 0', false, 2, true],
		['clamp：範圍內 → 原值', 2, 9, true],
	];

	/**
	 * 預設（不傳第三參數）把範圍外的計數當成「未指定」、改採預設值；
	 * `clamp: true` 則把「是數字但超出範圍」的輸入收斂到範圍內。
	 * 兩種模式下 `undefined` / `false` / `NaN` 都不是可用的數字，仍走預設值。
	 * 快照一次記錄整張對照表
	 * Without the third argument an out-of-range count counts as "not specified"
	 * and the default is used instead, while `clamp: true` converges an input that
	 * *is a number but out of range* into the range; in both modes `undefined` /
	 * `false` / `NaN` are not usable numbers and still take the default. The
	 * snapshot records the whole table in one go
	 */
	t.assert.snapshot(__cases.map(([
		label,
		count,
		defaultCount,
		clamp,
	]) => ({
		label,
		result: _normalizeEndCount(count, defaultCount, clamp),
	})))

	/**
	 * 以實際值固定邊界：預設模式下未指定與超出範圍的 `99`、`-1` 都改採上限；
	 * `clamp` 模式把 `99` 夾到上限、`-1` 夾到 0，且不影響
	 * 「未指定」「false」「範圍內」三種輸入的結果
	 * The boundaries are pinned with concrete values: without `clamp` an
	 * unspecified count and the out-of-range `99` / `-1` all fall back to the
	 * bound, while `clamp` moves `99` to the bound and `-1` to 0 and leaves
	 * "not given", `false` and in-range inputs unchanged
	 */
	t.assert.strictEqual(_normalizeEndCount(undefined), EnumConst.MAX_BLANK_LINES)
	t.assert.strictEqual(_normalizeEndCount(99), EnumConst.MAX_BLANK_LINES)
	t.assert.strictEqual(_normalizeEndCount(-1), EnumConst.MAX_BLANK_LINES)
	t.assert.strictEqual(_normalizeEndCount(EnumConst.MAX_BLANK_LINES, 0), EnumConst.MAX_BLANK_LINES)
	t.assert.strictEqual(_normalizeEndCount(false), 0)
	t.assert.strictEqual(_normalizeEndCount(undefined, 2), 2)
	t.assert.strictEqual(_normalizeEndCount(false, 2), 0)

	t.assert.strictEqual(_normalizeEndCount(99, 0, true), EnumConst.MAX_BLANK_LINES)
	t.assert.strictEqual(_normalizeEndCount(-1, undefined, true), 0)
	t.assert.strictEqual(_normalizeEndCount(undefined, 2, true), 2)
	t.assert.strictEqual(_normalizeEndCount(2, 9, true), 2)
})

test(`_handleOptionsEndCountCore start 收斂、end 回歸預設值`, (t: TestContext) =>
{
	const __cases: [
		label: string,
		options?: IIgnoreFileOptions,
		optionsEndCount?: Partial<IHandleOptionsEndCountOptions>,
	][] = [
		['無參數', undefined, undefined],
		['空物件', {}, undefined],
		['兩側皆已指定', { startCount: 1, endCount: 2 }, undefined],
		['endCount:false → 0', { startCount: 1, endCount: false }, undefined],
		['兩側皆等於上限 → 原樣保留', { startCount: 3, endCount: 3 }, undefined],
		['兩側皆超出範圍 → start 收斂、end 回歸上限', { startCount: 9, endCount: 9 }, undefined],
		['只缺 endCount 時採用 optionsEndCount', { startCount: 1 }, { startCount: 5, endCount: 2, lines: [] }],
		['兩側皆已指定時忽略 optionsEndCount', { startCount: 2, endCount: 2 }, { startCount: 9, endCount: 9, lines: [] }],
	];

	/**
	 * 兩側都落在 `0 ~ MAX_BLANK_LINES` 時整段整理被跳過，原值原樣保留；
	 * 任一側超出範圍（例如 `9`）就進入整理分支，兩側刻意走不同規則：
	 * `startCount` 以 `clamp: true` 把數字收斂到範圍內、不採用預設值，
	 * `endCount` 則回歸預設值（`optionsEndCount.endCount`，未給即上限）；
	 * 「未指定」的一側兩種模式都一樣走 `optionsEndCount.startCount ?? EnumConst.DEFAULT_START_COUNT`
	 * When both sides are within `0 ~ MAX_BLANK_LINES` the whole branch is
	 * skipped and the values survive untouched; as soon as one side is out of
	 * range (like `9`) the branch runs and the two sides deliberately take
	 * different rules: `startCount` uses `clamp: true` so a number converges into
	 * the range without taking the default, while `endCount` falls back to its
	 * default (`optionsEndCount.endCount`, the bound when not given); a side that
	 * was merely not given takes `optionsEndCount.startCount ?? EnumConst.DEFAULT_START_COUNT` in both modes
	 */
	t.assert.snapshot(__cases.map(([
		label,
		options,
		optionsEndCount,
	]) => ({
		label,
		result: _handleOptionsEndCountCore(options, optionsEndCount),
	})))

	/**
	 * 以實際值固定六種關鍵路徑；期望值的寫法依來源區分：
	 * 「回歸預設值」與「收斂到上限」都寫 `EnumConst`
	 * （`EnumConst.DEFAULT_START_COUNT` / `EnumConst.MAX_BLANK_LINES`），
	 * 「原樣保留的輸入」則保持字面值：`1`/`3`/`2` 是輸入的計數、
	 * `false` 走不還原換行的分支歸零
	 * Six key paths are pinned with concrete values; an expectation is written
	 * according to where the value comes from: both "falls back to the default"
	 * and "converges to the upper bound" are written as `EnumConst`
	 * (`EnumConst.DEFAULT_START_COUNT` / `EnumConst.MAX_BLANK_LINES`), while a
	 * kept input stays literal: `1`/`3`/`2` are the given counts and `false`
	 * takes the restore-nothing branch and becomes 0
	 */
	t.assert.deepStrictEqual(_handleOptionsEndCountCore(), {
		startCount: EnumConst.DEFAULT_START_COUNT,
		endCount: EnumConst.MAX_BLANK_LINES,
	})
	t.assert.deepStrictEqual(_handleOptionsEndCountCore({ startCount: 1, endCount: false }), {
		startCount: 1,
		endCount: 0,
	})
	t.assert.deepStrictEqual(_handleOptionsEndCountCore({ startCount: 3, endCount: 3 }), {
		startCount: 3,
		endCount: 3,
	})
	/**
	 * `startCount: 9` 收斂到上限、`endCount: 9` 回歸預設上限，
	 * 兩側結果同為上限，但走的是不同規則
	 * `startCount: 9` converges to the bound while `endCount: 9` falls back to
	 * the default bound; both sides end up at the bound by different rules
	 */
	t.assert.deepStrictEqual(_handleOptionsEndCountCore({ startCount: 9, endCount: 9 }), {
		startCount: EnumConst.MAX_BLANK_LINES,
		endCount: EnumConst.MAX_BLANK_LINES,
	})
	t.assert.deepStrictEqual(_handleOptionsEndCountCore({ startCount: 1 }, { startCount: 5, endCount: 2, lines: [] }), {
		startCount: 1,
		endCount: 2,
	})
	t.assert.deepStrictEqual(_handleOptionsEndCountCore({ startCount: 2, endCount: 2 }, { startCount: 9, endCount: 9, lines: [] }), {
		startCount: 2,
		endCount: 2,
	})
})

test(`_handleOptionsEndCount 由行陣列推算首尾空行`, (t: TestContext) =>
{
	const __cases: [
		label: string,
		options?: IIgnoreFileOptions,
		lines?: string[],
	][] = [
		['前後空行 → startCount/endCount', undefined, ['', '', '*.log', '', '']],
		['沒有空行 → 兩側皆 0', undefined, ['*.log']],
		['超出範圍的 startCount 收斂到上限', { startCount: 9, endCount: false }, ['*.log', '', '']],
	];

	/**
	 * `optionsEndCount.lines` 先由 `_omitBlankLines` 裁掉首尾空行，
	 * 回傳的 startCount / endCount 即為還原換行所需的計數；
	 * 這裡一律傳入副本，避免行陣列在案例間被共用
	 * `_omitBlankLines` first strips the leading/trailing blanks off
	 * `optionsEndCount.lines`, and the counts it returns are exactly what is
	 * needed to restore the newlines; a copy is passed in so the line array is
	 * never shared between cases
	 */
	t.assert.snapshot(__cases.map(([
		label,
		options,
		lines,
	]) => ({
		label,
		..._handleOptionsEndCount(options, { lines: [...(lines ?? [])] }),
	})))

	/**
	 * 以實際值固定三個案例：兩側空行數各自獨立計算；
	 * 超出範圍的 `9` 以 `clamp: true` 收斂到上限，
	 * 因此忽略 `_omitBlankLines` 由行陣列量到的 `startCount`（本例為 0），
	 * `false` 則走不還原換行的分支歸零
	 * The three cases are pinned with concrete values: the two blank counts are
	 * computed independently; the out-of-range `9` converges to the bound through
	 * `clamp: true`, so the `startCount` measured by `_omitBlankLines` (0 in this
	 * case) is ignored, while `false` takes the restore-nothing branch and
	 * becomes 0
	 */
	t.assert.deepStrictEqual(_handleOptionsEndCount(undefined, { lines: ['', '', '*.log', '', ''] }), {
		startCount: 2,
		endCount: 2,
		lines: ['*.log'],
	})
	t.assert.deepStrictEqual(_handleOptionsEndCount(undefined, { lines: ['*.log'] }), {
		startCount: 0,
		endCount: 0,
		lines: ['*.log'],
	})
	t.assert.deepStrictEqual(_handleOptionsEndCount({ startCount: 9, endCount: false }, { lines: ['*.log', '', ''] }), {
		startCount: EnumConst.MAX_BLANK_LINES,
		endCount: 0,
		lines: ['*.log'],
	})
})
