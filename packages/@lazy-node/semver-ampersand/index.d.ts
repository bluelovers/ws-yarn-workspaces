import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
export declare function handleVersionRange<T>(versionRange: T): T;
export declare function satisfies(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options): boolean;
export declare function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T;
export declare function minSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T;
export declare function validRange<T extends string | SemVer>(range: T | null | undefined, optionsOrLoose?: boolean | Options): string;
export declare function simplifyRange<T extends string | SemVer>(ranges: string[], range: T, options?: Options): T;
declare const _default: {
    satisfies: typeof satisfies;
    maxSatisfying: typeof maxSatisfying;
    minSatisfying: typeof minSatisfying;
    validRange: typeof validRange;
    simplifyRange: typeof simplifyRange;
    handleVersionRange: typeof handleVersionRange;
};
export default _default;
