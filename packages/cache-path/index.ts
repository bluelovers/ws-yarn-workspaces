import { findNpmCachePath } from './lib/finder/findNpmCachePath';
import { findOSTempPath } from './lib/finder/findOSTempPath';
import { findPkgModuleCachePath, findPkgModulePath } from './lib/finder/findPkgModuleCachePath';
import { findYarnCachePath } from './lib/finder/findYarnCachePath';
import { getCachePath } from './lib/getCachePath';
export { getCachePath, getCachePathAsync } from './lib/getCachePath';
export { getCacheRoot, getCacheRootAsync } from './lib/getCacheRoot';
export { normalizeName } from './lib/normalizeName';

export { findPkgModuleCachePath }
export { findPkgModulePath }
export { findYarnCachePath }
export { findNpmCachePath }
export { findOSTempPath }

export * from './lib/types';

export default getCachePath;
