//@noUnusedParameters:false

import { test, type TestContext } from 'node:test'
import { LF } from 'crlf-normalize'
import { _stringifyEndOfLine } from '../lib/normalize'
import { EnumConst, IIgnoreFileOptions } from '../lib/types'

test(`_stringifyEndOfLine 依計數還原 LF`, (t: TestContext) =>
{
	const __cases: [
		label: string,
		count?: IIgnoreFileOptions['endCount'],
		defaultCount?: IIgnoreFileOptions['endCount'],
		clamp?: boolean,
	][] = [
		['未指定 → 上限', undefined, undefined],
		['0 → 無換行', 0, undefined],
		['1 → 一行', 1, undefined],
		['false → 無換行', false, undefined],
		['99 → 改採預設上限', 99, undefined],
		['未指定 + 預設 2 → 兩行', undefined, 2],
		['false + 預設 2 → 無換行', false, 2],
		['99 + 預設 0 → 改採預設值 0', 99, 0],
		['clamp：99 → 收合到上限', 99, undefined, true],
		['clamp：-1 → 無換行', -1, undefined, true],
		['clamp：未指定 + 預設 2 → 兩行', undefined, 2, true],
		['clamp：false + 預設 2 → 無換行', false, 2, true],
		['clamp：99 + 預設 0 → 仍收合到上限', 99, 0, true],
	];

	/**
	 * 計數先由 `_normalizeEndCount` 整理成 `0 ~ MAX_BLANK_LINES`，再以 LF 重複成字串；
	 * `output` 記錄實際字串、`length` 記錄換行數，兩者一起快照便能同時看出
	 * 「幾行」與「有沒有字元」；`clamp` 的案例一併入表，
	 * 其中 `99 + 預設 0` 與 `clamp：99 + 預設 0` 是同一組輸入的直接對照，
	 * 保存「改採預設值」與「收合到範圍內」兩種整理方式的結果
	 * The count is first normalized into `0 ~ MAX_BLANK_LINES` by
	 * `_normalizeEndCount` and then repeated as LF; `output` records the actual
	 * string while `length` records how many characters it holds, so the snapshot
	 * shows both the line count and whether anything was produced at all. The
	 * `clamp` cases are recorded alongside, where `99 + 預設 0` and
	 * `clamp：99 + 預設 0` are the same input pair, preserving the results of the
	 * two ways of normalizing: taking the default versus converging into the range
	 */
	t.assert.snapshot(__cases.map(([
		label,
		count,
		defaultCount,
		clamp,
	]) => {
		const output = _stringifyEndOfLine(count, defaultCount, clamp);

		return {
			label,
			output,
			length: output.length,
		}
	}))
})

test(`_stringifyEndOfLine 的輸出等於 LF.repeat(計數)`, (t: TestContext) =>
{
	/**
	 * 快照已記錄各案例的字串長度，這裡固定關鍵行為：
	 * 「未指定」與「超出範圍」都退回 `_normalizeEndCount` 內建的預設上限
	 * `EnumConst.MAX_BLANK_LINES`，而 `2` 是輸入值本身、`false` 走不還原換行的分支
	 * The snapshot already records the length of each case; the key behaviour is
	 * pinned here: both "not given" and "out of range" fall back to the default
	 * bound built into `_normalizeEndCount`, i.e. `EnumConst.MAX_BLANK_LINES`,
	 * while `2` is the input itself and `false` takes the restore-nothing branch
	 */
	t.assert.strictEqual(_stringifyEndOfLine(), LF.repeat(EnumConst.MAX_BLANK_LINES))
	t.assert.strictEqual(_stringifyEndOfLine(99), LF.repeat(EnumConst.MAX_BLANK_LINES))
	t.assert.strictEqual(_stringifyEndOfLine(2), LF.repeat(2))
	t.assert.strictEqual(_stringifyEndOfLine(undefined, 2), LF.repeat(2))
	t.assert.strictEqual(_stringifyEndOfLine(false), '')
	t.assert.strictEqual(_stringifyEndOfLine(false, 2), '')

	/**
	 * `clamp` 只改變「是數字但超出範圍」的輸入：`99` 由改採預設值 0
	 * 變成收合到上限、`-1` 收合到 0；「未指定」與 `false` 照樣走預設值，
	 * 因此兩種模式結果相同
	 * `clamp` only changes an input that *is a number but out of range*: `99`
	 * moves from taking the default (0) to converging on the bound, and `-1`
	 * converges on 0; "not given" and `false` still take the default, so both
	 * modes agree on those
	 */
	t.assert.strictEqual(_stringifyEndOfLine(99, 0), '')
	t.assert.strictEqual(_stringifyEndOfLine(99, 0, true), LF.repeat(EnumConst.MAX_BLANK_LINES))
	t.assert.strictEqual(_stringifyEndOfLine(-1, undefined, true), '')
	t.assert.strictEqual(_stringifyEndOfLine(undefined, 2, true), LF.repeat(2))
	t.assert.strictEqual(_stringifyEndOfLine(false, 2, true), '')
})
