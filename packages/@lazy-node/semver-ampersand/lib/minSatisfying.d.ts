import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
export declare function minSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T;
