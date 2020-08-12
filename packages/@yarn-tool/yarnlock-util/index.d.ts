export * from './lib/types';
import { parseYarnLockRowV1 } from './lib/v1/parseYarnLockRowV1';
import { parseYarnLockRowV2 } from './lib/v2/parseYarnLockRowV2';
export { parseYarnLockRowV1 };
export { parseYarnLockRowV2 };
declare const _default: typeof import("@yarn-tool/yarnlock-util");
export default _default;
