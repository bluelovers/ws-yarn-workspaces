/**
 * Created by user on 2020/6/11.
 */
/**
 * 公眾 API 匯出層：把 lib/ 內的型別、核心運算、檔案讀寫、差異比較與去重集中匯出，
 * 讓使用端從單一入口即可取得完整能力，不必記住各子模組的路徑。
 *
 * Public API barrel: re-exports types, core algorithms, fs helpers, diff and dedupe
 * from lib/ so consumers get the full surface from a single entry point instead of
 * memorising sub-module paths.
 */
export * from './lib/types';
export * from './lib/core';
export * from './lib/fs';
export * from './lib/util';
export * from './lib/diff';
export * from './lib/dedupe';
/**
 * wrapDedupe 管線刻意只挑選具名匯出，
 * 讓 handleWrapDedupeOptions 等內部實作細節不會隨 barrel 外洩成公眾 API。
 *
 * The wrapDedupe pipeline is exported by name only, so internal helpers such as
 * handleWrapDedupeOptions do not leak into the public API through the barrel.
 */
export { wrapDedupe } from './lib/wrapDedupe/wrapDedupe';
export { IWrapDedupeCacheRuntime } from './lib/wrapDedupe/types';
export { infoFromDedupeCache } from './lib/wrapDedupe/infoFromDedupeCache';
/**
 * 轉 re-export 相依套件的常用入口，
 * 讓使用端不必直接依賴 @yarn-tool/yarnlock-dedupe、@yarn-tool/yarnlock-fs
 * 等套件的深層內部路徑，日後重構內部路徑也不會破壞使用端。
 *
 * Convenience re-exports of dependency entry points so consumers avoid deep imports
 * into @yarn-tool/yarnlock-dedupe / @yarn-tool/yarnlock-fs; internal path refactors
 * then stay non-breaking for consumers.
 */
export { IOptionsDedupe } from '@yarn-tool/yarnlock-dedupe/lib/types';
export { checkAndReadYarnLockFileSafe } from '@yarn-tool/yarnlock-fs/lib/readYarnLockFile';
export { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';
export { IFsYarnLockReturnType } from '@yarn-tool/yarnlock-fs/lib/types';
/**
 * 以 `exports` 物件本身作為預設匯出，
 * 讓 CJS 使用端既能取得命名匯出，也能在預設匯出上保留完整型別資訊。
 *
 * Default-exports the `exports` object itself so CJS consumers get both the named
 * exports and full type information on the default export.
 */
declare const _default: typeof import("./index");
export default _default;
