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
export * from './lib/wrap';
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

export default exports as typeof import('./index');
