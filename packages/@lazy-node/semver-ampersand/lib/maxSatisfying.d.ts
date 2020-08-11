import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
export declare function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T;
export default maxSatisfying;
