import { TestContext } from "node:test";
import { IgnoreFile } from "../../lib/IgnoreFile";

/**
 * 只有這三個欄位是 prototype 上的 accessor
 *（`get lines()` / `get patterns()` / `get content()`），並非實例的自有屬性
 * Only these three fields are prototype accessors rather than own properties
 */
const __GETTER_KEYS = ['lines', 'patterns', 'content'] as const;

/**
 * 從「實際值」與「期望值」中取出可對照的欄位，整理成快照與部分比對所需的資料
 *
 * 之所以要刻意切割，是因為 `lines` / `patterns` / `content` 都是 prototype 上的
 * accessor（如 `get content(): string`）而非自有屬性：
 * `t.assert.snapshot` 的序列化與 `partialDeepStrictEqual` 都只看自有屬性，
 * 無法直接從實例讀到這三個欄位，所以必須在呼叫當下手動展開成一般物件。
 * 反過來說，其餘欄位（`path` / `options` / `_lines`…）都是自有屬性，
 * 可以直接與實例本身比對——這正是本 helper 支援驗證
 * `lines` / `patterns` / `content` 以外欄位的原因。
 *
 * The split exists because `lines` / `patterns` / `content` are prototype
 * accessors (e.g. `get content(): string`) rather than own properties: neither
 * the snapshot serializer nor partialDeepStrictEqual can read them from the
 * instance, so they must be expanded into a plain object at call time. All the
 * other fields (`path` / `options` / `_lines`…) are own properties and can be
 * compared against the instance directly — which is how this helper also
 * supports verifying fields beyond the three getters.
 *
 * @param actual - ignore 檔案實例（或其實作物件）/ The instance (or a partial stand-in)
 * @param expected - 期望的欄位子集，可省略（省略時只取快照）；
 * 非公開欄位（如保護屬性 `_lines`）必要時以 `as any` / `// @ts-ignore` 傳入
 * Optional expected subset; omit for snapshot-only. Non-public fields (e.g. the
 * protected `_lines`) may be passed with `as any` / `// @ts-ignore` when needed
 */
export function _snapshotIgnoreFileCore<T extends Partial<IgnoreFile>>(actual: T, expected?: Partial<NoInfer<T>>)
{
	/**
	 * 期望值切成兩組：非 getter 欄位（直接比對實例）與 getter 欄位（比對手動展開的快照）
	 * 未提供期望值時兩組皆為空，代表「只取快照，不做部分比對」
	 * The expected value is split into non-getter fields (compared against the
	 * instance) and getter fields (compared against the expanded snapshot);
	 * with no expected value both groups are empty, meaning snapshot-only
	 */
	let keys: (keyof T)[] = [];
	if (expected)
	{
		keys = Object.keys(expected) as (keyof T)[];
		keys = keys.filter((key) => !__GETTER_KEYS.includes(key as any));
	}

	return {
		/**
		 * 非 getter 欄位：以期望值的欄位為準，從實例反查實際值。
		 * 比對時只帶這些欄位而非整個實例，失訊息的 diff 才不會被無關欄位淹沒
		 * Non-getter fields: looked up on the instance, keyed by the expected
		 * fields; only these fields (not the whole instance) take part in the
		 * comparison, so a failure diff is not drowned in unrelated noise
		 */
		actual: keys.length > 0 ? keys.reduce((acc, key) => {
			acc[key] = actual[key];
			return acc;
		}, {} as Partial<T>) : undefined,
		/**
		 * 寫入快照的內容：三個 getter 欄位在呼叫當下展開（行陣列複製一份），
		 * 之後即使實例被就地修改（如 finalize / stringify），快照仍代表呼叫當下的結果
		 * What goes into the snapshot: the three getter fields, expanded at call
		 * time (the line array is copied), so the snapshot keeps the state as of
		 * this call even if the instance is mutated later (finalize / stringify)
		 */
		snapshot: {
			lines: [...actual.lines],
			patterns: actual.patterns,
			content: actual.content,
		},
	}
}

/**
 * 快照記錄實際結果，並對期望值中指定的欄位做部分比對
 *
 * `expected` 可混合兩類欄位，各自走不同的比對路徑（見
 * {@link _partialDeepStrictEqualIgnoreFileCore}）：
 * - getter 欄位（`lines` / `patterns` / `content`）→ 比對手動展開的快照
 * - 其餘欄位（如 `options`）→ 直接比對實例
 *
 * 快照與部分比對分開是刻意的：快照（living document）記錄「實際行為」供事後對照，
 * 部分比對則是本次測試真正要驗證的「最小斷言」，
 * 未指定的欄位變動不會讓測試失敗，但一定會在快照差異中現形。
 *
 * `expected` may mix both kinds of fields, each taking a different comparison
 * path (see {@link _partialDeepStrictEqualIgnoreFileCore}): getter fields are
 * compared against the expanded snapshot, everything else against the instance.
 * Snapshots and partial comparison are kept apart on purpose: the snapshot (a
 * living document) records the actual behaviour for later reference, while the
 * partial comparison is the minimal assertion this test cares about — unlisted
 * fields never fail the test, but any change to them shows up in the snapshot diff.
 *
 * @param t - 測試內容 / Test context
 * @param actual - ignore 檔案實例 / The ignore file instance
 * @param expected - 期望的欄位子集，省略時只取快照 / Optional expected subset; omit to snapshot only
 */
export function snapshotIgnoreFile<T extends Partial<IgnoreFile>>(t: TestContext, actual: T, expected?: Partial<NoInfer<T>>)
{
	const snapshot = _snapshotIgnoreFileCore(actual);
	t.assert.snapshot({
		actual,
		snapshot: snapshot.snapshot,
	});
	if (expected)
	{
		_partialDeepStrictEqualIgnoreFileCore(t, actual, expected, snapshot);
	}
}

/**
 * 以 {@link _snapshotIgnoreFileCore} 產生的資料執行部分比對
 *
 * 期望值切成兩半、各對照一半的實際值：
 * - 非 getter 欄位 → `actual:` 半邊，與實例上的同名欄位直接比對
 * - getter 欄位 → `snapshot:` 半邊，與手動展開的快照比對
 * 沒有用到的一半直接省略，partialDeepStrictEqual 才不會比到不存在的欄位。
 *
 * Runs the partial comparison using the data produced by
 * {@link _snapshotIgnoreFileCore}. The expected value is split into two halves,
 * each paired with its own actual half: non-getter fields are compared against
 * the same fields on the instance, while getter fields are compared against the
 * expanded snapshot. A half that is not used is omitted, so the partial
 * comparison never checks a field that does not exist there.
 */
export function _partialDeepStrictEqualIgnoreFileCore<T extends Partial<IgnoreFile>>(t: TestContext, actual: T, expected: Partial<NoInfer<T>>, snapshot: ReturnType<typeof _snapshotIgnoreFileCore<T>>)
{
	const __keys = Object.keys(expected) as (keyof T)[];
	const __expected: Partial<Record<'actual' | 'snapshot', unknown>> = {};

	if (snapshot.actual)
	{
		__expected.actual = __keys
			.filter((key) => !__GETTER_KEYS.includes(key as any))
			.reduce((acc, key) => {
				acc[key] = expected[key];
				return acc;
			}, {} as Partial<T>);
	}

	if (__keys.some((key) => __GETTER_KEYS.includes(key as any)))
	{
		__expected.snapshot = __keys
			.reduce((acc, key) => {
				if (__GETTER_KEYS.includes(key as any))
				{
					acc[key] = expected[key];
				}
				return acc;
			}, {} as Partial<T>);
	}

	t.assert.partialDeepStrictEqual({
		actual: snapshot.actual ?? actual,
		snapshot: snapshot.snapshot,
	}, __expected);
}

/**
 * 只做部分比對，不寫入快照
 *
 * 適合「結果會被後續步驟覆寫、不適合作為快照」的中間狀態。
 * Performs only the partial comparison without writing a snapshot; suitable for
 * intermediate states that later steps overwrite and therefore should not be
 * snapshotted.
 */
export function partialDeepStrictEqualIgnoreFile<T extends Partial<IgnoreFile>>(t: TestContext, actual: T, expected: Partial<NoInfer<T>>)
{
	const snapshot = _snapshotIgnoreFileCore(actual);
	_partialDeepStrictEqualIgnoreFileCore(t, actual, expected, snapshot);
}
