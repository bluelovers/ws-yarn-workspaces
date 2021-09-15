import { IYarnLockParsedV1, IYarnLockParsedV2, IUnpackYarnLockDataRow, IYarnLockSource } from '@yarn-tool/yarnlock-parse/index';
import { IYarnLockIteratorWrap, IYarnLockIteratorWrapValue } from './types';
import { ITSResolvable } from 'ts-type/index';
export declare class YarnLockIterator<T extends IYarnLockParsedV1 | IYarnLockParsedV2, DD extends IUnpackYarnLockDataRow<T> = IUnpackYarnLockDataRow<T>> {
    object: T;
    constructor(object: T);
    isV1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): this is YarnLockIterator<TT>;
    isV2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): this is YarnLockIterator<TT>;
    v1<TT extends IYarnLockParsedV1 = Extract<T, IYarnLockParsedV1>>(): YarnLockIterator<TT>;
    v2<TT extends IYarnLockParsedV2 = Extract<T, IYarnLockParsedV2>>(): YarnLockIterator<TT>;
    keys(): string[];
    values<D extends IUnpackYarnLockDataRow<T> = DD>(): IYarnLockIteratorWrap<D>[];
    get<D extends IUnpackYarnLockDataRow<T> = DD>(key: string): D;
    set<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: D): void;
    has<D extends IUnpackYarnLockDataRow<T> = DD>(key: string): boolean;
    del<D extends IUnpackYarnLockDataRow<T> = DD>(key: string): D;
    update<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: Partial<D>): D;
    protected _wrap<D extends IUnpackYarnLockDataRow<T> = DD>(key: string, raw: D): IYarnLockIteratorWrap<D>;
    protected _normalize<D extends IUnpackYarnLockDataRow<T> = DD>(raw: D, key: string): IYarnLockIteratorWrapValue<D>;
    [Symbol.iterator]<D extends IUnpackYarnLockDataRow<T>>(): Generator<IYarnLockIteratorWrap<D>, void, unknown>;
    iterator<D extends IUnpackYarnLockDataRow<T> = DD>(): Generator<IYarnLockIteratorWrap<D>, void, unknown>;
    stringify(): string;
    toJSON<T extends IYarnLockSource>(): T;
    map<U, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (value: IYarnLockIteratorWrap<D>, key: string, _this: this) => U): U[];
    mapAsync<U, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (value: IYarnLockIteratorWrap<D>, key: string, _this: this) => ITSResolvable<U>): Promise<U[]>;
    reduce<U = unknown, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (initValue: U, value: IYarnLockIteratorWrap<D>, key: string, _this: this) => U, initValue?: U): U;
    reduceAsync<U = unknown, D extends IUnpackYarnLockDataRow<T> = DD>(fn: (initValue: U, value: IYarnLockIteratorWrap<D>, key: string, _this: this) => ITSResolvable<U>, initValue?: U): Promise<Awaited<U>>;
}
export default YarnLockIterator;
