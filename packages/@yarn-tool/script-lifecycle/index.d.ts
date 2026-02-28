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
import { ILifecycleMapKeys, ILifecycleEntry, ILifecycleMapEntry, ILifecycleList } from './lib/types';
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
export declare function getLifecycleCore<K extends ILifecycleMapKeys>(scriptName: string | K): ILifecycleMapEntry<K>;
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
export declare function getLifecycle<K extends string | ILifecycleMapKeys>(scriptName: K, currentScriptOnly?: boolean): ILifecycleEntry<K>;
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
export declare function getLifecycleList<K extends string | ILifecycleMapKeys>(scriptName: K, includeSelf?: boolean, currentScriptOnly?: boolean): ILifecycleList<K>;
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
export declare function entryToList<K extends string | ILifecycleMapKeys>(entry: ILifecycleMapEntry<K> | ILifecycleEntry<K>, includeSelf?: boolean): ILifecycleList<K>;
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
export declare function isKnownLifecycleKey<K extends ILifecycleMapKeys>(scriptName: string | K): scriptName is ILifecycleMapKeys;
