/**
 * Created by user on 2020/6/11.
 */

import { notEmpty as checkYarnLockFileUnsafeCore } from '@yarn-tool/yarnlock-fs/lib/notEmpty';
import { existsYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/existsYarnLockFile';
import { checkAndReadYarnLockFileSafe } from '@yarn-tool/yarnlock-fs/lib/readYarnLockFile';
import { checkAndParseYarnLockFile, readYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/readParseYarnLockFile';
import { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';
import { IFsYarnLockReturnType } from '@yarn-tool/yarnlock-fs/lib/types';
import { fsYarnLockSafe, fsYarnLock } from '@yarn-tool/yarnlock-fs/lib/read';

export { checkYarnLockFileUnsafeCore }
export { existsYarnLockFile }
export { checkAndReadYarnLockFileSafe }
/**
 * @deprecated
 */
export { checkAndReadYarnLockFileSafe as checkAndReadYarnLockFileUnsafe }

export { checkAndParseYarnLockFile }
export { readYarnLockFile }

export { writeYarnLockFile }

export type { IFsYarnLockReturnType }

export { fsYarnLock }

export { fsYarnLockSafe }

export default fsYarnLockSafe;
