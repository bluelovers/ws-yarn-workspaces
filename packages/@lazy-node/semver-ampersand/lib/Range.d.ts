import semverRange from 'semver/classes/range';
import { IOptionsOrLoose } from './types';
import SemVer from 'semver/classes/semver';
export declare class SemverRange extends semverRange {
    rawSource?: string | SemverRange | semverRange | SemVer;
    constructor(rawSource: string | SemverRange | semverRange | SemVer, optionsOrLoose?: IOptionsOrLoose);
    format(): string;
    /**
     * Return '*' instead of '' so that truthiness works.
     */
    toRangeString(): string;
}
export { SemverRange as Range };
export default SemverRange;
