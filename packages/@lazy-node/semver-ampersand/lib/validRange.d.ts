import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
export declare function validRange<T extends string | SemVer>(range: T | null | undefined, optionsOrLoose?: boolean | Options): string;
