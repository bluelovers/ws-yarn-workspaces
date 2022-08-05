import { queryVersionByNpmPackageArgWithCache } from './lib/queryVersionByNpmPackageArg';
import { queryVersionWithCache } from './lib/queryVersion';
import { getCache } from './lib/cacheAgent';

export type { ICachedVersionResult, IOptionsQueryVersion } from './lib/types';

export { queryVersionByNpmPackageArgWithCache }
export { queryVersionWithCache }

export { getCache }

export default queryVersionWithCache
