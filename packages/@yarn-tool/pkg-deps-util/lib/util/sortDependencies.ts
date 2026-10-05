/**
 * 依賴欄位排序 (Sort dependency fields)
 *
 * 寫入依賴後排序鍵名，可讓 git diff 保持乾淨、避免同一份 `package.json`
 * 在不同機器上產生不同順序。
 *
 * Sorting keys after a write keeps git diffs clean and stops the same
 * package.json from having different orders on different machines.
 */
import { IPackageJson, readPackageJson } from '@ts-type/package-dts';
import sortObjectKeys from 'sort-object-keys2/core';

/**
 * 對四個依賴欄位依鍵名排序 (Sort the four dependency fields by key)
 *
 * Sort the four dependency fields of a package.json by key.
 *
 * @param pkg 要排序的 package.json 物件 (The package.json object to sort)
 *
 * @returns 回傳同一個 `pkg` 物件（就地修改），方便鏈式呼叫
 *
 * Returns the same `pkg` object (mutated in place) for convenient chaining.
 */
export function sortDependencies(pkg: IPackageJson)
{
	/**
	 * `useSource`：直接在原物件上排序，避免回傳副本導致呼叫端拿到未排序的舊物件
	 *
	 * `useSource` sorts in place so callers are not left holding an unsorted copy.
	 */
	let opts = {
		useSource: true,
	};

	/**
	 * 逐一處理四種依賴欄位；欄位不存在時傳入空物件，讓排序行為一致且不拋錯
	 *
	 * Each of the four fields is sorted; a missing field gets an empty object so
	 * behaviour stays uniform without throwing.
	 */
	sortObjectKeys(pkg.dependencies ?? {}, opts);
	sortObjectKeys(pkg.devDependencies ?? {}, opts);
	sortObjectKeys(pkg.peerDependencies ?? {}, opts);
	sortObjectKeys(pkg.optionalDependencies ?? {}, opts);

	return pkg
}
