/**
 * Type definitions for npm/yarn script lifecycle / npm/yarn 腳本生命週期類型定義
 *
 * @module @yarn-tool/script-lifecycle/lib/types
 */

import lifecycleMap from "./lifecycle";
import { ITSValueOfArray } from 'ts-type';

/**
 * Lifecycle entry configuration interface.
 * 生命週期配置項介面。
 *
 * Defines the structure of a lifecycle event, including its name,
 * whether to ignore the main script, and the before/after hook scripts.
 *
 * 定義生命週期事件的結構，包括名稱、是否忽略主腳本，以及前置/後置鉤子腳本。
 *
 * @template K - The script name type / 腳本名稱類型
 *
 * @example
 * ```typescript
 * const entry: ILifecycleEntry<'build'> = {
 *   name: 'build',
 *   ignoreSelf: false,
 *   before: ['prebuild'],
 *   after: ['postbuild']
 * };
 * ```
 */
export interface ILifecycleEntry<K extends string = string>
{
	/** Script name / 腳本名稱 */
	name: K;
	/**
	 * Whether to exclude the main script from the lifecycle list.
	 * 是否在生命週期列表中排除主腳本。
	 *
	 * When true, the main script won't be included in the execution list.
	 * 當為 true 時，主腳本不會被包含在執行列表中。
	 */
	ignoreSelf?: boolean;
	/**
	 * Scripts to run before the main script.
	 * 在主腳本之前執行的腳本列表。
	 */
	before: (string | `pre${K}`)[];
	/**
	 * Scripts to run after the main script.
	 * 在主腳本之後執行的腳本列表。
	 */
	after: (string | `post${K}`)[];
}

/**
 * Keys of known lifecycle events.
 * 已知生命週期事件的鍵類型。
 *
 * Currently supported: 'install', 'pack', 'publish'
 *
 * 目前支援：'install', 'pack', 'publish'
 */
export type ILifecycleMapKeys = keyof typeof lifecycleMap;

/**
 * Lifecycle map entry type - returns the specific entry type for known keys.
 * 生命週期映射項類型 - 對已知鍵返回特定的項類型。
 *
 * @template K - The script name type / 腳本名稱類型
 */
export type ILifecycleMapEntry<K extends string = string | ILifecycleMapKeys> = K extends ILifecycleMapKeys
	? (typeof lifecycleMap)[K]
	: ILifecycleEntry<K>

/**
 * Lifecycle map type - extends the base map with custom entries.
 * 生命週期映射類型 - 擴展基礎映射以支援自定義項。
 *
 * @template K - The custom script name type / 自定義腳本名稱類型
 */
export type ILifecycleMap<K extends string = string> = typeof lifecycleMap & Record<K, ILifecycleEntry<K>>;

/**
 * Lifecycle script list type - ordered array of script names.
 * 生命週期腳本列表類型 - 腳本名稱的有序陣列。
 *
 * Represents the execution order of lifecycle scripts.
 * 表示生命週期腳本的執行順序。
 *
 * @template K - The script name type / 腳本名稱類型
 */
export type ILifecycleList<K extends string = string | ILifecycleMapKeys> = (string | `pre${K}` | `post${K}` | K | ITSValueOfArray<ILifecycleEntry<K>["before"]> | ITSValueOfArray<ILifecycleEntry<K>["after"]>)[]
