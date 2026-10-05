import type { IParseNameAndVersionWithNpaResult } from '@yarn-tool/yarnlock-util';
import { IUnpackYarnLockDataRow, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';

/**
 * 迭代器逐筆產出的項目：同時保留原始鍵值、未處理的列資料與解析後資訊，
 * 讓使用端既能直接存取原始資料，也能使用解析結果而不必再解析一次。
 *
 * Item yielded by the iterator: keeps the original key, the untouched row and the
 * parsed info, so consumers can read raw data or use the parsed result without
 * re-parsing.
 */
export interface IYarnLockIteratorWrap<D extends IUnpackYarnLockDataRow<IYarnLockParsedV1 | IYarnLockParsedV2>>
{
	/**
	 * yarn.lock 的鍵值（`名稱@版本範圍`）
	 */
	key: string;
	/**
	 * 原始列資料，型別隨 v1 / v2 而異
	 */
	raw: D;
	/**
	 * 由列資料解析出的統一資訊（名稱與版本等）
	 */
	value: IYarnLockIteratorWrapValue<D>;
}

/**
 * `IYarnLockIteratorWrap.value` 的型別：
 * 直接沿用 yarnlock-util 的解析結果，確保各套件對條目資訊的解讀一致（SSoT）。
 *
 * Type of `IYarnLockIteratorWrap.value`: reuses the parse result of yarnlock-util so
 * every package interprets entry info identically (SSoT).
 */
export interface IYarnLockIteratorWrapValue<D extends IUnpackYarnLockDataRow<IYarnLockParsedV1 | IYarnLockParsedV2>> extends IParseNameAndVersionWithNpaResult
{

}
