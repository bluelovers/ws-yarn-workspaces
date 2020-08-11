import semverRange from 'semver/classes/range';
import { Options } from 'semver';
export declare class Range extends semverRange {
    rawRange?: string | Range;
    constructor(rawRange: string | Range | semverRange, optionsOrLoose?: boolean | Options);
}
export default Range;
