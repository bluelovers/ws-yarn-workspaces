import semverRange from 'semver/classes/range';
import { Options } from 'semver';
export declare class SemverRange extends semverRange {
    rawSource?: string | Range;
    constructor(rawSource: string | SemverRange | semverRange, optionsOrLoose?: boolean | Options);
}
export { SemverRange as Range };
export default SemverRange;
