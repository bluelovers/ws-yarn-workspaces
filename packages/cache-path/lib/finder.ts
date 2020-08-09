import { findPkgModuleCachePath, findPkgModulePath } from './finder/findPkgModuleCachePath';
import { findYarnCachePath } from './finder/findYarnCachePath';
import { findNpmCachePath } from './finder/findNpmCachePath';
import { findOSTempPath } from './finder/findOSTempPath';

export { findPkgModuleCachePath }
export { findPkgModulePath }
export { findYarnCachePath }
export { findNpmCachePath }
export { findOSTempPath }

/**
 * fn[] of any function return a string
 * stop when get first return
 */
export const defaultOrder = [
	findPkgModulePath,
	findYarnCachePath,
	findNpmCachePath,
	findOSTempPath,
];
