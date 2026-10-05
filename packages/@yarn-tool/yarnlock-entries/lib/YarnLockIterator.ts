import { merge } from 'lodash';
import { IYarnLockIteratorWrap, IYarnLockIteratorWrapValue } from './types';
import { parseYarnLockRowV1, parseYarnLockRowV2 } from '@yarn-tool/yarnlock-util';
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';
import { ITSResolvable } from 'ts-type';
import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import { yarnLockParsedToRawJSON } from '@yarn-tool/yarnlock-parsed-to-json';
import { isYarnLockParsedV1, isYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse-assert';
import {
	IUnpackYarnLockDataRow,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
	IYarnLockSource,
} from '@yarn-tool/yarnlock-types';

/**
 * yarn.lock 條目迭代器：以 Map 風格介面操作解析後的 v1 / v2 資料，
 * 迭代時可取得原始列資料或解析後的統一資訊，並支援還原為 yarn.lock 內容。
 *
 * yarn.lock entry iterator: operates on parsed v1 / v2 data through a Map-like surface,
 * yields raw rows or uniformly parsed info while iterating, and can serialize the data
 * back to yarn.lock content.
 *
 * @typeParam T 解析結果型別，決定迭代項目使用的列型別 / parse result type deciding the row type of yielded entries
 * @typeParam DD 列資料型別預設值，可於各方法個別覆寫 / default row type, overridable per method
 */
export class YarnLockIterator<T extends IYarnLockParsedV1 | IYarnLockParsedV2, DD extends IUnpackYarnLockDataRow<T> = IUnpackYarnLockDataRow<T>>
{

	/**
	 * @param $object 已解析的 yarn.lock 資料 / parsed yarn.lock data
	 * @throws newYarnLockParsedVersionError 同時符合 v1 與 v2 特徵時 / when the object matches both v1 and v2
	 */
	constructor(public $object: T)
	{
		/**
		 * 同時為 v1 與 v2（皆為 true 或皆為 false）代表來源不合法，
		 * 提前拋錯可避免後續版本分支做出矛盾的解析。
		 *
		 * Being both v1 and v2 (both true or both false) means the source is invalid;
		 * failing early prevents contradictory parsing in later version branches.
		 */
		if (this.isV1() === this.isV2())
		{
			throw newYarnLockParsedVersionError()
		}
	}

	/**
	 * 目前的 lockfile 版本，直接取自解析結果的判別欄位。
	 *
	 * Current lockfile version, taken straight from the discriminant of the parse result.
	 */
	get verType()
	{
		return this.$object.verType
	}

	/**
	 * 型別判別函式 (Type Guard)：判斷是否為 v1 並將 `this` 收窄為 v1 迭代器。
	 *
	 * Type guard: checks for v1 and narrows `this` to a v1 iterator.
	 */
	isV1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): this is YarnLockIterator<TT>
	{
		return isYarnLockParsedV1(this.$object)
	}

	/**
	 * 型別判別函式 (Type Guard)：判斷是否為 v2 / v3 並收窄 `this`。
	 *
	 * Type guard: checks for v2 / v3 and narrows `this`.
	 */
	isV2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): this is YarnLockIterator<TT>
	{
		return isYarnLockParsedV2(this.$object)
	}

	/**
	 * 斷言為 v1 後回傳 v1 型別的迭代器，
	 * 讓呼叫端在版本不符時以例外而非錯誤的型別繼續執行。
	 *
	 * Asserts v1 and returns a v1-typed iterator so callers get an exception instead of
	 * continuing with the wrong type on a version mismatch.
	 *
	 * @throws newYarnLockParsedVersionError 非 v1 時 / when not v1
	 */
	v1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): YarnLockIterator<TT>
	{
		if (this.isV1())
		{
			return this as any
		}

		throw newYarnLockParsedVersionError(`current object not v1 yarnlock`)
	}

	/**
	 * 斷言為 v2 / v3 後回傳 v2 型別的迭代器，理由同 `v1()`。
	 *
	 * Asserts v2 / v3 and returns a v2-typed iterator, same rationale as `v1()`.
	 *
	 * @throws newYarnLockParsedVersionError 非 v2 / v3 時 / when not v2 / v3
	 */
	v2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): YarnLockIterator<TT>
	{
		if (this.isV2())
		{
			return this as any
		}

		throw newYarnLockParsedVersionError(`current object not v2 yarnlock`)
	}

	/**
	 * 取得所有條目鍵值（`名稱@版本範圍`）。
	 *
	 * Returns every entry key (`name@version-range`).
	 */
	keys(): string[]
	{
		return Object.keys(this.$object.data);
	}

	/**
	 * 以陣列回傳所有條目；內部展開迭代器是為了讓回傳值可被重複使用，
	 * 不受迭代器一次性 (One-shot) 特性影響。
	 *
	 * Returns all entries as an array; the iterator is spread internally so the result is
	 * reusable regardless of the iterator's one-shot nature.
	 */
	values<D extends IUnpackYarnLockDataRow<T> = DD>()
	{
		return [...this.iterator<D>()];
	}

	/**
	 * 讀取指定鍵值的列資料；不存在時回傳 undefined（以型別斷言表達，供 `has()` 判斷）。
	 *
	 * Reads the row for a key; returns undefined when absent (asserted for typing, which
	 * `has()` then relies on).
	 */
	get<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		return this.$object.data[key] as D
	}

	/**
	 * 寫入或覆蓋指定鍵值的列資料（直接改動底層物件）。
	 *
	 * Writes or overwrites the row for a key (mutates the underlying object directly).
	 */
	set<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: D)
	{
		this.$object.data[key] = raw
	}

	/**
	 * 檢查鍵值是否存在：
	 * 以「非 null 且為物件」而非 truthy 判斷，
	 * 是為了避免未來列資料可能為 falsy 值時誤判。
	 *
	 * Checks key existence: uses "not null and is an object" instead of a truthy check so
	 * a future falsy row value cannot be misjudged as missing.
	 */
	has<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		const row = this.get(key);
		return row !== null && typeof row === 'object'
	}

	/**
	 * 刪除指定鍵值並回傳被刪除的列資料，供呼叫端記錄或回滾。
	 *
	 * Deletes a key and returns the removed row so callers can log or roll it back.
	 */
	del<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		const row = this.get(key) as D;
		delete this.$object.data[key]

		return row
	}

	/**
	 * 深度合併 (Deep Merge) 部分欄位列指定條目。
	 * 先檢查存在性再合併，避免 lodash `merge` 對不存在的鍵建立非預期的空條目。
	 *
	 * Deep-merges a partial row into an entry. Existence is checked before merging so
	 * lodash `merge` cannot create an unexpected empty entry for a missing key.
	 *
	 * @throws TypeError 鍵值不存在時 / when the key does not exist
	 */
	update<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: Partial<D>)
	{
		if (this.has(key))
		{
			return merge(this.$object.data[key], raw) as D
		}

		throw new TypeError(`'${key}' not exists`)
	}

	/**
	 * 組合迭代項目：把鍵值、原始列資料與解析後的 `value` 打包成單一物件，
	 * 讓迭代端一次取得三種視圖而不必重複查表。
	 *
	 * Assembles an iteration item: bundles key, raw row and parsed `value` into one object
	 * so consumers get all three views without repeated lookups.
	 */
	protected _wrap<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: D): IYarnLockIteratorWrap<D>
	{
		return {
			key,
			raw,
			value: this._normalize(raw, key),
		}
	}

	/**
	 * 依 lockfile 版本選擇對應的列解析器，
	 * 讓 v1 / v2 的欄位差異對外呈現實質相同的 `value` 形狀。
	 *
	 * Picks the row parser matching the lockfile version so the v1 / v2 field differences
	 * surface as a practically identical `value` shape.
	 */
	protected _normalize<D extends IUnpackYarnLockDataRow<T> = DD>(raw: D, key: string): IYarnLockIteratorWrapValue<D>
	{
		if (this.isV2())
		{
			return parseYarnLockRowV2(key, raw as any)
		}
		else
		{
			return parseYarnLockRowV1(key, raw)
		}
	}

	/**
	 * 實作迭代協定 (Iteration Protocol)：委由 `iterator()` 逐筆產出，
	 * 讓 `for...of` 與 `values()` 可直接使用。
	 *
	 * Implements the iteration protocol by delegating to `iterator()`, enabling `for...of`
	 * and `values()`.
	 *
	 * @returns 迭代器 / an iterator of wrap items
	 */
	* [Symbol.iterator]<D extends IUnpackYarnLockDataRow<T>>()
	{
		yield* this.iterator<D>()
	}

	/**
	 * 只迭代鍵值與原始列資料，跳過 `_normalize` 解析；
	 * 適合只需要 `raw` 的批次處理，可省下逐筆解析的開銷。
	 *
	 * Yields only key and raw row, skipping `_normalize`; ideal for batch work that only
	 * needs `raw` and saves per-row parsing cost.
	 *
	 * @returns 迭代器 / an iterator of `{ key, raw }`
	 */
	* iteratorRaw<D extends IUnpackYarnLockDataRow<T> = DD>()
	{
		for (const key in this.$object.data)
		{
			const raw = this.$object.data[key] as D;

			yield {
				key,
				raw,
			} as Pick<IYarnLockIteratorWrap<D>, 'key' | 'raw'>
		}
	}

	/**
	 * 逐筆產出完整迭代項目（鍵值 + 原始資料 + 解析後資訊）。
	 *
	 * Yields full iteration items (key + raw data + parsed info) one by one.
	 *
	 * @returns 迭代器 / an iterator of `IYarnLockIteratorWrap`
	 */
	* iterator<D extends IUnpackYarnLockDataRow<T> = DD>()
	{
		for (const row of this.iteratorRaw<D>())
		{
			yield this._wrap<D>(row.key, row.raw)
		}
	}

	/**
	 * 將變更後的資料還原為 yarn.lock 內容字串。
	 *
	 * Serializes the mutated data back into yarn.lock content.
	 *
	 * @returns yarn.lock 內容字串 / yarn.lock content string
	 */
	stringify()
	{
		return yarnLockStringify(this.toJSON())
	}

	/**
	 * 還原為原始來源型別（v1 的 `{ type, object }` 或 v2 的資料 + `__metadata`）。
	 * 以 `throwError: true` 呼叫是為了讓無法還原的狀態直接失敗，避免輸出無效 lockfile。
	 *
	 * Converts back to the raw source type (v1's `{ type, object }` or v2 data with
	 * `__metadata`). Called with `throwError: true` so unrestorable states fail loudly
	 * instead of emitting an invalid lockfile.
	 *
	 * @throws 無法還原時拋錯 / when conversion fails
	 */
	toJSON<T extends IYarnLockSource>(): T
	{
		return yarnLockParsedToRawJSON(this.$object, {
			throwError: true,
		}) as any;
	}

	/**
	 * 逐筆轉換為陣列：回呼可讀取項目、鍵值與迭代器本身。
	 *
	 * Maps every entry into an array; the callback receives the item, its key and the
	 * iterator itself.
	 *
	 * @param fn 轉換回呼 / transform callback
	 * @returns 轉換後的陣列 / the transformed array
	 */
	map<U, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (value: IYarnLockIteratorWrap<D>,
		key: string,
		_this: this,
	) => U)
	{
		const list = [] as U[];

		for (const value of this.iterator<D>())
		{
			list.push(fn(value, value.key, this))
		}

		return list
	}

	/**
	 * `map` 的非同步版本：逐筆 `await` 回呼結果，
	 * 以 `for await` 迭代是為了與 Async API 介面一致（即使目前來源是同步產生器）。
	 *
	 * Asynchronous `map`: awaits each callback result; `for await` keeps the interface
	 * consistent with the async APIs even though the source is currently a sync generator.
	 *
	 * @param fn 可回傳 Promise 的轉換回呼 / transform callback that may return a Promise
	 * @returns 轉換後的陣列 / the transformed array
	 */
	async mapAsync<U, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (value: IYarnLockIteratorWrap<D>,
		key: string,
		_this: this,
	) => ITSResolvable<U>)
	{
		const list = [] as U[];

		for await (const value of this.iterator<D>())
		{
			list.push(await fn(value, value.key, this))
		}

		return list
	}

	/**
	 * 逐筆累加條目；未提供 `initValue` 時以空物件起始，
	 * 讓「彙整成物件」成為預設用法而不必每次手動傳入 `{}`。
	 *
	 * Folds entries one by one; defaults to an empty object when `initValue` is omitted so
	 * "aggregate into an object" works without passing `{}` every time.
	 *
	 * @param fn 累加回呼 / accumulator callback
	 * @param initValue 初始值 / initial value
	 * @returns 累加結果 / the folded result
	 */
	reduce<U = unknown, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (initValue: U,
		value: IYarnLockIteratorWrap<D>,
		key: string,
		_this: this,
	) => U, initValue: U = {} as any)
	{
		for (const value of this.iterator<D>())
		{
			initValue = fn(initValue, value, value.key, this)
		}

		return initValue
	}

	/**
	 * `reduce` 的非同步版本：逐筆 `await` 回呼結果後再累加，
	 * 保證回傳值是回呼完成後的最終狀態。
	 *
	 * Asynchronous `reduce`: awaits each callback before folding, ensuring the returned
	 * value reflects the final state after every callback finished.
	 *
	 * @param fn 可回傳 Promise 的累加回呼 / accumulator callback that may return a Promise
	 * @param initValue 初始值 / initial value
	 * @returns 累加結果 / the folded result
	 */
	async reduceAsync<U = unknown, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (initValue: U,
		value: IYarnLockIteratorWrap<D>,
		key: string,
		_this: this,
	) => ITSResolvable<U>, initValue: U = {} as any)
	{
		for await (const value of this.iterator<D>())
		{
			initValue = await fn(initValue, value, value.key, this)
		}

		return initValue
	}

}

/**
 * 預設匯出迭代器類別，讓 `import YarnLockIterator from` 的用法與類別慣用法一致。
 *
 * Default-exports the iterator class so `import YarnLockIterator from` matches the
 * usual class convention.
 */
export default YarnLockIterator;
