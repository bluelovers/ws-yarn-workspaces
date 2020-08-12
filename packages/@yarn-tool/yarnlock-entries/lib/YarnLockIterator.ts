import { IYarnLockParsedV1, IYarnLockParsedV2, IUnpackYarnLockDataRow } from '@yarn-tool/yarnlock-parse/index';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/index';
import { merge } from 'lodash';
import { IYarnLockIteratorWrap, IYarnLockIteratorWrapValue } from './types';
import { parseYarnLockRowV2, parseYarnLockRowV1 } from '@yarn-tool/yarnlock-util/index';
import yarnLockStringify from '@yarn-tool/yarnlock-stringify/index';
import { ITSResolvable } from 'ts-type/index';

export class YarnLockIterator<T extends IYarnLockParsedV1 | IYarnLockParsedV2, DD extends IUnpackYarnLockDataRow<T> = IUnpackYarnLockDataRow<T>>
{

	constructor(public object: T)
	{
		if (!this.isV1() && !this.isV2())
		{
			throw new TypeError(`unknown object`)
		}
	}

	isV1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): this is YarnLockIterator<TT>
	{
		return (this.object.verType === EnumDetectYarnLock.v1)
	}

	isV2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): this is YarnLockIterator<TT>
	{
		return (this.object.verType === EnumDetectYarnLock.berry)
	}

	v1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): YarnLockIterator<TT>
	{
		if (this.isV1())
		{
			return this as any
		}

		throw new TypeError(`current object not v1 yarnlock`)
	}

	v2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): YarnLockIterator<TT>
	{
		if (this.isV2())
		{
			return this as any
		}

		throw new TypeError(`current object not v2 yarnlock`)
	}

	keys(): string[]
	{
		return Object.keys(this.object.data);
	}

	values<D extends IUnpackYarnLockDataRow<T> = DD>()
	{
		return [...this.iterator<D>()];
	}

	get<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		return this.object.data[key] as D
	}

	set<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: D)
	{
		this.object.data[key] = raw
	}

	has<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		const row = this.get(key);
		return row !== null && typeof row === 'object'
	}

	del<D extends IUnpackYarnLockDataRow<T> = DD>(key: string)
	{
		const row = this.get(key) as D;
		delete this.object.data[key]

		return row
	}

	update<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: Partial<D>)
	{
		if (this.has(key))
		{
			return merge(this.object.data[key], raw) as D
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

	* iterator<D extends IUnpackYarnLockDataRow<T> = DD>()
	{
		for (const key in this.object.data)
		{
			let row = this.object.data[key] as D;

			yield this._wrap<D>(key, row)
		}
	}

	stringify()
	{
		return yarnLockStringify(this.object)
	}

	toJSON()
	{
		return this.object
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
