/**
 * @yarn-tool/ncu
 *
 * A wrapper tool for npm-check-updates that checks and updates package dependencies.
 * 提供依賴版本檢查與更新的核心功能，封裝 npm-check-updates 並擴展其能力。
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import { npmCheckUpdates } from '@yarn-tool/ncu';
 *
 * const result = await npmCheckUpdates(cache, {
 *   json_old: packageJson,
 *   upgrade: true,
 * });
 * ```
 */
export * from './lib/types';
export * from './lib/store';
export * from './lib/cli';
export * from './lib/remote';
export * from './lib/util';
export * from './lib/options';
export * from './lib/update';
declare const _default: typeof import("./index");
export default _default;
