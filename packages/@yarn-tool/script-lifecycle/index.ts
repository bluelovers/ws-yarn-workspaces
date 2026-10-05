/**
 * npm/yarn script lifecycle utility / npm/yarn 腳本生命週期工具
 *
 * This module provides utilities for handling npm/yarn script lifecycle hooks.
 * It helps determine the correct execution order of pre/post scripts for known lifecycle events.
 *
 * 此模組提供處理 npm/yarn 腳本生命週期鉤子的工具函式。
 * 幫助確定已知生命週期事件的 pre/post 腳本正確執行順序。
 *
 * @module @yarn-tool/script-lifecycle
 *
 * @example
 * ```typescript
 * import { getLifecycleList, isKnownLifecycleKey } from '@yarn-tool/script-lifecycle';
 *
 * // Get lifecycle scripts for 'install'
 * // 獲取 'install' 的生命週期腳本列表
 * const scripts = getLifecycleList('install');
 * // Returns: ['preinstall', 'install', 'postinstall', 'prepublish', 'prepare', ...]
 *
 * // Check if a script is a known lifecycle key
 * // 檢查腳本是否為已知的生命週期鍵
 * if (isKnownLifecycleKey('publish')) {
 *   console.log('publish is a known lifecycle event');
 * }
 * ```
 */

import { ILifecycleMapKeys, ILifecycleMap, ILifecycleEntry, ILifecycleMapEntry, ILifecycleList } from './lib/types';
import { lifecycleMap } from './lib/lifecycle';

/**
 * Get the core lifecycle configuration for a known lifecycle script.
 * 獲取已知生命週期腳本的核心配置。
 *
 * This function only returns data for predefined lifecycle events (install, pack, publish).
 * For unknown scripts, it returns undefined.
 *
 * 此函式僅返回預定義生命週期事件（install, pack, publish）的資料。
 * 對於未知腳本，返回 undefined。
 *
 * @template K - The lifecycle key type / 生命週期鍵類型
 * @param scriptName - The script name to look up / 要查詢的腳本名稱
 * @returns The lifecycle configuration entry or undefined / 生命週期配置項或 undefined
 *
 * @example
 * ```typescript
 * const installConfig = getLifecycleCore('install');
 * // Returns: { name: 'install', ignoreSelf: false, before: ['preinstall'], after: ['postinstall', ...] }
 *
 * const unknownConfig = getLifecycleCore('build');
 * // Returns: undefined (not a known lifecycle event)
 * ```
 */
export function getLifecycleCore<K extends ILifecycleMapKeys>(scriptName: string | K)
{
	/**
	 * 只有已知鍵才存在於 lifecycleMap，
	 * 未知鍵刻意回傳 undefined，交由 getLifecycle() 產生預設的 pre/post 結構。
	 *
	 * Only known keys exist in lifecycleMap; unknown keys intentionally return
	 * undefined so getLifecycle() can build the default pre/post structure.
	 */
	if (isKnownLifecycleKey(scriptName))
	{
		return lifecycleMap[scriptName] as ILifecycleMapEntry<K>
	}

	//return (lifecycleMap as ILifecycleMap)[scriptName]
}

/**
 * Get the lifecycle configuration for any script name.
 * 獲取任意腳本名稱的生命週期配置。
 *
 * For known lifecycle events (install, pack, publish), returns the predefined configuration.
 * For unknown scripts, generates a default configuration with pre/post hooks.
 *
 * 對於已知生命週期事件（install, pack, publish），返回預定義配置。
 * 對於未知腳本，生成帶有 pre/post 鉤子的預設配置。
 *
 * @template K - The script name type / 腳本名稱類型
 * @param scriptName - The script name to look up / 要查詢的腳本名稱
 * @param currentScriptOnly - If true, skip looking up known lifecycle configs / 若為 true，跳過查詢已知生命週期配置
 * @returns The lifecycle configuration entry / 生命週期配置項
 *
 * @example
 * ```typescript
 * // Known lifecycle event
 * const installConfig = getLifecycle('install');
 * // Returns predefined config with specific before/after scripts
 *
 * // Unknown script - generates default config
 * const buildConfig = getLifecycle('build');
 * // Returns: { name: 'build', ignoreSelf: false, before: ['prebuild'], after: ['postbuild'] }
 *
 * // Skip known lifecycle lookup
 * const customConfig = getLifecycle('install', true);
 * // Returns: { name: 'install', ignoreSelf: false, before: ['preinstall'], after: ['postinstall'] }
 * ```
 */
export function getLifecycle<K extends string | ILifecycleMapKeys>(scriptName: K,
	currentScriptOnly?: boolean,
): ILifecycleEntry<K>
{
	let entry: ILifecycleEntry<K>

	/**
	 * currentScriptOnly 為 true 時刻意跳過查表，
	 * 讓呼叫端能取得純粹的 `pre<script>` / `post<script>` 結構，
	 * 不受內建的 install/pack/publish 規則影響。
	 *
	 * When currentScriptOnly is true the lookup is skipped on purpose so the caller
	 * gets a plain `pre<script>` / `post<script>` structure, unaffected by the
	 * built-in install/pack/publish rules.
	 */
	if (!currentScriptOnly)
	{
		entry = getLifecycleCore(scriptName) as any as ILifecycleEntry<K>;
	}

	/**
	 * entry 可能為 undefined（未知生命週期鍵或 currentScriptOnly 為 true），
	 * 此處以 ?? 兜底產生預設配置，確保回傳值永遠是完整的 entry。
	 *
	 * `entry` may be undefined (unknown lifecycle key or currentScriptOnly is true),
	 * so ?? falls back to a default config to guarantee a complete entry is returned.
	 */
	return entry ?? ({
		name: scriptName,
		ignoreSelf: false,
		before: [
			`pre${scriptName}` as const,
		],
		after: [
			`post${scriptName}` as const,
		],
	} as ILifecycleEntry<K>)
}

/**
 * Get the ordered list of lifecycle scripts for a given script name.
 * 獲取指定腳本名稱的生命週期腳本有序列表。
 *
 * Returns an array of script names in the correct execution order:
 * [before scripts, main script (optional), after scripts]
 *
 * 返回按正確執行順序排列的腳本名稱陣列：
 * [前置腳本, 主腳本 (可選), 後置腳本]
 *
 * @template K - The script name type / 腳本名稱類型
 * @param scriptName - The script name to look up / 要查詢的腳本名稱
 * @param includeSelf - Whether to include the main script in the list / 是否在列表中包含主腳本
 * @param currentScriptOnly - If true, skip looking up known lifecycle configs / 若為 true，跳過查詢已知生命週期配置
 * @returns Ordered array of lifecycle script names / 生命週期腳本名稱的有序陣列
 *
 * @example
 * ```typescript
 * // Get all scripts for install lifecycle
 * const scripts = getLifecycleList('install');
 * // Returns: ['preinstall', 'install', 'postinstall', 'prepublish', 'prepare', ...]
 *
 * // Exclude the main script
 * const scriptsOnly = getLifecycleList('install', false);
 * // Returns: ['preinstall', 'postinstall', 'prepublish', 'prepare', ...]
 * ```
 */
export function getLifecycleList<K extends string | ILifecycleMapKeys>(scriptName: K,
	includeSelf?: boolean,
	currentScriptOnly?: boolean,
): ILifecycleList<K>
{
	return entryToList(getLifecycle(scriptName, currentScriptOnly), includeSelf)
}

/**
 * Convert a lifecycle entry to an ordered list of script names.
 * 將生命週期配置項轉換為腳本名稱的有序列表。
 *
 * @template K - The script name type / 腳本名稱類型
 * @param entry - The lifecycle configuration entry / 生命週期配置項
 * @param includeSelf - Whether to include the main script (overrides ignoreSelf) / 是否包含主腳本（覆蓋 ignoreSelf）
 * @returns Ordered array of lifecycle script names / 生命週期腳本名稱的有序陣列
 *
 * @example
 * ```typescript
 * const entry = {
 *   name: 'build',
 *   ignoreSelf: false,
 *   before: ['prebuild'],
 *   after: ['postbuild']
 * };
 *
 * const list = entryToList(entry);
 * // Returns: ['prebuild', 'build', 'postbuild']
 *
 * const listNoSelf = entryToList(entry, false);
 * // Returns: ['prebuild', 'postbuild']
 * ```
 */
export function entryToList<K extends string | ILifecycleMapKeys>(entry: ILifecycleMapEntry<K> | ILifecycleEntry<K>,
	includeSelf?: boolean,
): ILifecycleList<K>
{
	let result = [] as ILifecycleList<K>

	/**
	 * before 可能未定義（可選欄位），先檢查長度再展開，
	 * 避免把 undefined 或空陣列推入結果。
	 *
	 * `before` may be undefined (optional field); check length before spreading
	 * to avoid pushing undefined or an empty array into the result.
	 */
	if (entry.before?.length)
	{
		result.push(...entry.before)
	}

	/**
	 * includeSelf 明確傳入 true 時強制納入主腳本，
	 * 否則以 ignoreSelf 決定；這讓 pack（ignoreSelf: true）
	 * 仍可依需求以 includeSelf=true 取回包含 'pack' 的完整清單。
	 *
	 * An explicit includeSelf === true forces the main script in; otherwise
	 * ignoreSelf decides. This lets `pack` (ignoreSelf: true) still return a full
	 * list containing 'pack' when includeSelf=true is passed.
	 */
	if (includeSelf === true || entry.ignoreSelf !== true)
	{
		result.push(entry.name)
	}

	/**
	 * 同 before，after 也是可選欄位，需先確認有內容才展開，
	 * 以保持 before → 主腳本 → after 的執行順序。
	 *
	 * Like `before`, `after` is optional; only spread when non-empty so the
	 * before → main script → after execution order is preserved.
	 */
	if (entry.after?.length)
	{
		result.push(...entry.after)
	}

	return result
}

/**
 * Check if a script name is a known lifecycle key.
 * 檢查腳本名稱是否為已知的生命週期鍵。
 *
 * Known lifecycle keys are: 'install', 'pack', 'publish'
 *
 * 已知的生命週期鍵為：'install', 'pack', 'publish'
 *
 * @template K - The lifecycle key type / 生命週期鍵類型
 * @param scriptName - The script name to check / 要檢查的腳本名稱
 * @returns True if the script is a known lifecycle key / 若腳本為已知的生命週期鍵則返回 true
 *
 * @example
 * ```typescript
 * isKnownLifecycleKey('install');  // true
 * isKnownLifecycleKey('publish');  // true
 * isKnownLifecycleKey('build');    // false
 * ```
 */
export function isKnownLifecycleKey<K extends ILifecycleMapKeys>(scriptName: string | K): scriptName is ILifecycleMapKeys
{
	return scriptName in lifecycleMap
}
