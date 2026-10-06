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
export declare function stripDepsName<T = string>(name: string): [T, IVersionValue];
