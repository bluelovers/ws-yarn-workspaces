import semverRange from 'semver/classes/range';
import { Options } from 'semver';
export declare class Range extends semverRange {
    rawSource?: string | Range;
    constructor(rawSource: string | Range | semverRange, optionsOrLoose?: boolean | Options);
}
export default Range;
