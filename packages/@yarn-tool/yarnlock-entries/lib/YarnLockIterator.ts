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

export class YarnLockIterator<T extends IYarnLockParsedV1 | IYarnLockParsedV2, DD extends IUnpackYarnLockDataRow<T> = IUnpackYarnLockDataRow<T>>
{

	constructor(public $object: T)
	{
		if (this.isV1() === this.isV2())
		{
			throw newYarnLockParsedVersionError()
		}
	}

	get verType()
	{
		return this.$object.verType
	}

	isV1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): this is YarnLockIterator<TT>
	{
		return isYarnLockParsedV1(this.$object)
	}

	isV2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): this is YarnLockIterator<TT>
	{
		return isYarnLockParsedV2(this.$object)
	}

	v1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): YarnLockIterator<TT>
	{
		if (this.isV1())
		{
			return this as any
		}

		throw newYarnLockParsedVersionError(`current object not v1 yarnlock`)
	}

	v2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): YarnLockIterator<TT>
	{
		if (this.isV2())
		{
			return this as any
		}

		throw newYarnLockParsedVersionError(`current object not v2 yarnlock`)
	}

	keys(): string[]
	{
		return Object.keys(this.$object.data);
	}

	values<D extends IUnpackYarnLockDataRow<T> = DD>()
	{
		return [...this.iterator<D>()];
	}

	get<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		return this.$object.data[key] as D
	}

	set<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: D)
	{
		this.$object.data[key] = raw
	}

	has<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		const row = this.get(key);
		return row !== null && typeof row === 'object'
	}

	del<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		const row = this.get(key) as D;
		delete this.$object.data[key]

		return row
	}

	update<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: Partial<D>)
	{
		if (this.has(key))
		{
			return merge(this.$object.data[key], raw) as D
		}

		throw new TypeError(`'${key}' not exists`)
	}

	protected _wrap<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: D): IYarnLockIteratorWrap<D>
	{
		return {
			key,
			raw,
			value: this._normalize(raw, key),
		}
	}

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

	* [Symbol.iterator]<D extends IUnpackYarnLockDataRow<T>>()
	{
		yield* this.iterator<D>()
	}

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

	* iterator<D extends IUnpackYarnLockDataRow<T> = DD>()
	{
		for (const row of this.iteratorRaw<D>())
		{
			yield this._wrap<D>(row.key, row.raw)
		}
	}

	stringify()
	{
		return yarnLockStringify(this.toJSON())
	}

	toJSON<T extends IYarnLockSource>(): T
	{
		return yarnLockParsedToRawJSON(this.$object, {
			throwError: true,
		}) as any;
	}

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

export default YarnLockIterator;
