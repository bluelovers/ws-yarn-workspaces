/**
 * Created by user on 2020/6/11.
 */
export * from './lib/types';
export * from './lib/core';
export * from './lib/fs';
export * from './lib/util';
export * from './lib/diff';
export * from './lib/dedupe';
export { wrapDedupe } from './lib/wrapDedupe/wrapDedupe';
export { IWrapDedupeCacheRuntime } from './lib/wrapDedupe/types';
export { infoFromDedupeCache } from './lib/wrapDedupe/infoFromDedupeCache';
export { IOptionsDedupe } from '@yarn-tool/yarnlock-dedupe/lib/types';
export { checkAndReadYarnLockFileSafe } from '@yarn-tool/yarnlock-fs/lib/readYarnLockFile';
export { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';
export { IFsYarnLockReturnType } from '@yarn-tool/yarnlock-fs/lib/types';
declare const _default: typeof import("./index");
export default _default;
