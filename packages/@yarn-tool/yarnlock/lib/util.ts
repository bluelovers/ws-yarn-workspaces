/**
 * Created by user on 2020/6/11.
 */

import { IVersionValue } from '@ts-type/package-dts/lib/package-json/types';

/**
 * 拆解 yarn.lock 鍵值為 [模組名稱, 版本範圍]。
 * 使用非貪婪比對是為了讓 scoped 模組（@scope/name@range）開頭的 `@`
 * 不會被誤判成分隔符，名稱裡的 `@` 只會吃到第一個位置。
 *
 * Splits a yarn.lock key into [module name, version range].
 * The non-greedy pattern keeps the leading `@` of a scoped package
 * (@scope/name@range) from being mistaken for the separator, so only the
 * first `@` after the name acts as the delimiter.
 *
 * @param name yarn.lock 的鍵值 / a yarn.lock key
 * @throws TypeError 鍵值不符合 `name@version` 格式 / when the key is not in `name@version` form
 */
export function stripDepsName<T = string>(name: string): [T, IVersionValue]
{
	let m = name.match(/^(@?.+?)@(.+)$/);

	if (!m)
	{
		/**
		 * 找不到分隔用的 `@` 代表不是合法的依賴鍵值；
		 * 提前拋錯可避免下游把整串字串誤當成模組名稱而產生靜默錯誤。
		 *
		 * Missing the separator `@` means the key is not a valid dependency key;
		 * failing fast prevents downstream code from silently treating the whole
		 * string as a module name.
		 */
		throw new TypeError(`name is not dependencies, ${name}`)
	}

	/**
	 * slice(1) 拋棄整體比對結果，只保留捕獲群組 [名稱, 版本] 作為回傳值。
	 *
	 * slice(1) discards the full match and keeps only the captured groups
	 * [name, version] as the return value.
	 */
	let r = m.slice(1);

	//console.dir(r);
	//process.exit()

	return r as any
}
