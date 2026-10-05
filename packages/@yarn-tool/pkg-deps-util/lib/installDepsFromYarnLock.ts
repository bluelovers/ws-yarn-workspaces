/**
 * 依 yarn.lock 過濾並安裝依賴 (Filter and install dependencies from yarn.lock)
 *
 * yarn.lock 已經記錄了過去實際解析成功的版本，優先採用 lock 內的版本
 * 可以避免 registry 上已不存在的版本被寫入 `package.json`。
 *
 * yarn.lock already records versions that resolved successfully in the past,
 * so preferring them avoids writing versions that no longer exist on the
 * registry into `package.json`.
 */
import { findRootLazy } from '@yarn-tool/find-root';
import { readPackageJson } from '@ts-type/package-dts';
import npa from '@yarn-tool/npm-package-arg-util';
import { yarnLockParse } from '@yarn-tool/yarnlock-parse';
import {
	groupYarnLockParsedEntries,
	IGroupYarnLockParsedEntriesOptions,
} from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IComputedPackageEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries';
import { IParseNameAndVersionWithNpaResult } from '@yarn-tool/yarnlock-util/lib/types';

import { pick } from 'lodash';
import { join } from 'path';
import { addDependenciesIfNotExists, EnumResultAddDependencies } from '@yarn-tool/pkg-deps-add';
import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { array_unique_overwrite } from 'array-hyper-unique';
import { sortDependencies } from './util/sortDependencies';
import { fetchRemoteInfo } from './util/fetchRemoteInfo';
import { IAddedList, IFilteredRecord, IOptionsInstallDepsFromYarnLock, IResultInstallDeps } from './types';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';

/**
 * 自已解析的 yarn.lock 中取出指定套件的條目
 *
 * Pick the entries of the given packages out of a parsed yarn.lock.
 *
 * @param packageNames 要查找的套件名稱 (Package names to look up)
 * @param parsedOldPackage 已解析的 lock 內容，相容 v1 / v2 格式 (Parsed lock, v1 or v2)
 * @param options 分組選項，可用 `names` 覆寫要分組的鍵 (Grouping options, `names` overrides keys)
 *
 * @returns 以套件名稱為鍵的條目集合；查不到的名稱不會出現在回傳值中
 *
 * Entries keyed by package name; names without a match are simply absent.
 */
export function filterDepsFromYarnLock<T extends string>(packageNames: T[],
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2,
	options?: IGroupYarnLockParsedEntriesOptions,
)
{
	let group = groupYarnLockParsedEntries(parsedOldPackage, options);

	/**
	 * `npa().name` 可把 `pkg@1.2.3` 之類的輸入正規化成純名稱，而 lock 的鍵正是純名稱
	 *
	 * npa().name normalises inputs such as `pkg@1.2.3` to the bare name used as
	 * the lock's keys.
	 */
	return pick(group, packageNames.map((name) => npa(name).name)) as IFilteredRecord<IComputedPackageEntries<IParseNameAndVersionWithNpaResult>, T>;
}

/**
 * 依 yarn.lock 的解析結果寫入依賴 (Write dependencies based on yarn.lock)
 *
 * Writes dependencies using the versions resolved in yarn.lock.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param parsedOldPackage 已解析的 yarn.lock 內容 (The parsed yarn.lock)
 * @param options 安裝與查詢選項 (Install and query options)
 *
 * @returns 與其他安裝函式一致的回傳結構；lock 內找不到可用版本的套件會落在 `others`
 *
 * Same result shape as the other install helpers; packages without a usable
 * version in the lock end up in `others`.
 */
export async function installDepsFromYarnLockCore<T extends string>(packageNames: T[],
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2,
	options: IOptionsInstallDepsFromYarnLock = {},
)
{
	let names = packageNames.map((name) => npa(name).name) as T[];

	/**
	 * 先查遠端版本，才能知道 lock 中哪一個條目對應到使用者想要的 range
	 *
	 * The remote version is queried first so we know which lock entry matches
	 * the range the user asked for.
	 */
	let listRemoteInfo = await fetchRemoteInfo(packageNames, options);

	let filteredYarnLock = filterDepsFromYarnLock(names, parsedOldPackage, {
		...options,
		names,
	});

	const cwd = options.cwd ??= process.cwd();

	/**
	 * 惰性尋找根目錄：即使找不到也不會中斷，因為此處只是要讀取 `package.json`
	 *
	 * Lazy root lookup: a missing root must not abort the flow, since we only
	 * need it to read package.json.
	 */
	const rootData = findRootLazy(options);

	const pkg = options.pkg ?? readPackageJson(join(rootData.pkg, 'package.json'));

	const added = [] as IAddedList;
	const exists = [] as string[];

	let others: T[] = packageNames.filter((packageName) =>
	{
		const result = npa(packageName);
		const { name } = result;

		let target = listRemoteInfo[name];

		/**
		 * 以遠端解析出的 `versionQuery` 去 lock 裡找完全相符的條目；
		 * 用 `find` 而非索引，是因為同一套件可能有多個條目（對應不同 range）。
		 *
		 * Matches the remote `versionQuery` against exact lock entries; `find`
		 * is used because one package may appear under several ranges.
		 */
		let version = filteredYarnLock[name]?.find?.((value) => value[0] === target.versionQuery)?.[0];

		if (version?.length)
		{
			const semver = `^${version}`;
			let bool = addDependenciesIfNotExists(pkg, name, semver, options).bool;

			if (bool === EnumResultAddDependencies.changed)
			{
				added.push([name, semver]);

				return false;
			}
			/**
			 * `null` 代表已存在且版本相同，刻意與 changed 分開記錄以便正確回報
			 *
			 * null means it already exists with the same version; tracked separately
			 * from `changed` so the caller can report it accurately.
			 */
			else if (bool === null)
			{
				exists.push(name);
				return false;
			}
		}

		/**
		 * lock 內沒有可用版本或寫入失敗，交還給呼叫端處理
		 *
		 * No usable version in the lock (or the write failed): hand it back.
		 */
		return true
	});

	const updated = others.length !== packageNames.length;

	if (updated)
	{
		sortDependencies(pkg)
	}

	const result = {
		cwd,
		rootData,
		added,
		exists,
		others,
		pkg,
		updated,
	};

	/**
	 * 型別斷言，執行期無作用 (Type-only assertion, no runtime effect)
	 */
	<IResultInstallDeps>result;

	return result
}

/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 *
 * Check and filter whether the versions to install already exist in yarn.lock.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param options 安裝選項，可指定 `cwd` 與 `pkg` (Install options, `cwd` and `pkg`)
 *
 * @returns 若有 lock 條目可比對則回傳安裝結果；無 lock 或清單為空時回傳 `undefined`，
 * 呼叫端需自行處理此情況。
 *
 * Returns the install result when there are lock entries to compare against;
 * returns `undefined` when there is no lock or the list is empty, which callers
 * must handle.
 */
export async function installDepsFromYarnLock<T extends string>(packageNames: T[],
	options: IOptionsInstallDepsFromYarnLock = {},
)
{
	/**
	 * 先去空字串再去重：空白項目會讓 `npa` 解析出意外結果，
	 * 重複項目則會造成同一個套件被寫入兩次。
	 *
	 * Drops empty strings before deduplicating: blanks confuse npa and duplicates
	 * would write the same package twice.
	 */
	packageNames = array_unique_overwrite(packageNames.filter(v => v?.length));

	if (packageNames.length)
	{
		options.cwd ??= process.cwd();

		const rootData = findRootLazy(options);

		/**
		 * 以 Safe 讀取，鎖檔不存在時回傳空值而非拋例外
		 *
		 * Safe read: a missing lock yields an empty value instead of throwing.
		 */
		let yarnlock_cache = fsYarnLockSafe(rootData.root);

		if (yarnlock_cache.yarnlock_old?.length)
		{
			let parsedOldPackage = yarnLockParse(yarnlock_cache.yarnlock_old);

			return installDepsFromYarnLockCore(packageNames, parsedOldPackage, options)
		}
	}
}
