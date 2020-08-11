import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
export declare function simplifyRange<T extends string | SemVer>(ranges: string[], range: T, options?: Options): T;
export default simplifyRange;
