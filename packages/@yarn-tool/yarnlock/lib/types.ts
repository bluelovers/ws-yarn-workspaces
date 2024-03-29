/**
 * Created by user on 2020/6/11.
 */

import { ITSArrayListMaybeReadonly, ITSValueOfArray } from 'ts-type';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { Console2 } from 'debug-color2';
import { Argv, Arguments } from 'yargs';

import { IVersionValue } from '@ts-type/package-dts/lib/package-json/types';
import { IYarnLockDataRowBase } from '@yarn-tool/yarnlock-types';
import { IFsYarnLockReturnType } from '@yarn-tool/yarnlock-fs/lib/types';

/**
 * @deprecated
 */
export type IYarnLockfileParseObject<T extends ITSArrayListMaybeReadonly<string> = string[]> = Record<string, IYarnLockfileParseObjectRow<T>>

/**
 * yarn.lock 資料
 * @deprecated
 */
export interface IYarnLockfileParseObjectRow<T extends ITSArrayListMaybeReadonly<string> = string[]> extends IYarnLockDataRowBase
{
	/**
	 * 安裝來源網址
	 */
	resolved: string;
	/**
	 * hash key
	 */
	integrity: string;
}

export interface IFilterResolutions<T extends ITSArrayListMaybeReadonly<string>>
{
	/**
	 * yarn.lock key 列表
	 */
	names: T,
	/**
	 * 過濾後的 yarn lock deps
	 */
	deps: {
		/**
		 * 模組名稱
		 */
		[P in (keyof ITSValueOfArray<T> | string)]: {
			/**
			 * 版本資料
			 */
			[P in IVersionValue]: IYarnLockfileParseObjectRow<T>;
		}
	},
	/**
	 * 實際安裝的版本編號
	 */
	installed?: {
		/**
		 * 實際安裝的版本編號
		 */
		[P in ITSValueOfArray<T>]: IVersionValue[];
	},
	/**
	 * 每個模組最大的安裝版本
	 */
	max?: {
		/**
		 * 每個模組最大的安裝版本
		 */
		[P in ITSValueOfArray<T>]: {
			key: ITSValueOfArray<T>,
			value: IYarnLockfileParseObjectRow<T>
		}
	},
}

export interface IRemoveResolutions<T extends ITSArrayListMaybeReadonly<string>>
{
	/**
	 * 執行前的 yarn.lock
	 */
	yarnlock_old: IYarnLockfileParseObject<T>;
	/**
	 * 執行後的 yarn.lock
	 */
	yarnlock_new: IYarnLockfileParseObject<T>;
	/**
	 * yarn.lock 是否有變動
	 */
	yarnlock_changed: boolean;
	result: IFilterResolutions<T>;
}

export interface IWrapDedupeCache
{
	/**
	 * 如果不存在則等於 argv.cwd
	 */
	readonly cwd?: string,

	readonly rootData?: IFindRootReturnType,

	/**
	 * 目前的 yarn.lock 狀態(隨步驟更動狀態)
	 */
	yarnlock_cache?: IFsYarnLockReturnType

	/**
	 * 執行前的 yarn.lock
	 */
	readonly yarnlock_old?: string,
	yarnlock_old2?: string,
	/**
	 * 執行前的 yarn.lock 是否存在
	 */
	readonly yarnlock_old_exists?: string,
	/**
	 * yarn.lock 是否有變動
	 */
	yarnlock_changed?: boolean,

	/**
	 * 最後一次的 yarn.lock diff 訊息
	 */
	yarnlock_msg?: string,

	/**
	 * 每個步驟的狀態 true 代表中斷所有步驟
	 * null 代表此步驟不存在
	 * void/undefined 代表此步驟未執行
	 */
	readonly ret: {
		readonly init: boolean | void | null,
		readonly before: boolean | void | null,
		readonly main: boolean | void | null,
		readonly after: boolean | void | null,
		readonly end: boolean | void | null,
	},

	readonly consoleDebug?: Console2,
	readonly console?: Console2,
}

export interface IWrapDedupeReturnType<T extends {
	cwd?: string,
	[k: string]: unknown,
}, U extends T | {
	cwd: string,
	[k: string]: unknown,
}, C extends IWrapDedupeCache>
{
	cwd: string;
	rootData: IFindRootReturnType;
	yarg: Argv<T>;
	argv: Arguments<U>;
	cache: C;
}

export type IInfoFromDedupeCacheReturnType = IFindRootReturnType & {
	yarnlock_file: string;
	yarnlock_old_exists: string;
	yarnlock_exists: boolean;
	yarnlock_changed: boolean;
}
