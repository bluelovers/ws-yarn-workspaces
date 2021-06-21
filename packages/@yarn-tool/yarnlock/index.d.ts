/**
 * Created by user on 2020/6/11.
 */
export * from './lib/types';
export * from './lib/core';
export * from './lib/fs';
export * from './lib/parse';
export * from './lib/util';
export * from './lib/diff';
export * from './lib/dedupe';
export { wrapDedupe } from './lib/wrapDedupe/wrapDedupe';
export { IWrapDedupeCacheRuntime } from './lib/wrapDedupe/types';
export { infoFromDedupeCache } from './lib/wrapDedupe/infoFromDedupeCache';
export { IOptionsDedupe } from '@yarn-tool/yarnlock-dedupe/lib/types';
export { existsYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/existsYarnLockFile';
export { checkAndReadYarnLockFileSafe } from '@yarn-tool/yarnlock-fs/lib/readYarnLockFile';
/**
 * @deprecated
 */
export { checkAndReadYarnLockFileSafe as checkAndReadYarnLockFileUnsafe } from '@yarn-tool/yarnlock-fs/lib/readYarnLockFile';
export { checkAndParseYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/readParseYarnLockFile';
export { readYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/readParseYarnLockFile';
export { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';
export { IFsYarnLockReturnType } from '@yarn-tool/yarnlock-fs/lib/types';
export { fsYarnLock } from '@yarn-tool/yarnlock-fs/lib/read';
declare const _default: typeof import("./index");
export default _default;
