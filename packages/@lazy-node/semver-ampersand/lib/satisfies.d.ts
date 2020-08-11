import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
export declare function satisfies(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options): boolean;
