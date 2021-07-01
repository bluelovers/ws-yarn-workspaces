import semverRange from 'semver/classes/range';
import { IComparatorSet, IComparatorSetInput, IOptions, IOptionsOrLoose, ISemverRangeInput } from './types';
import { Comparator } from 'semver';
declare const SemverRange_base: new () => semverRange;
export declare class SemverRange<RAW extends ISemverRangeInput> extends SemverRange_base {
    readonly rawSource?: RAW;
    readonly range: string;
    readonly raw: string;
    readonly set: IComparatorSet;
    readonly options: IOptions;
    readonly loose: boolean;
    readonly includePrerelease: boolean;
    constructor(rawSource: RAW, optionsOrLoose?: IOptionsOrLoose);
    protected _buildComparatorsSet(range: string, options: IOptions): IComparatorSetInput;
    protected _inherit(range: ISemverRangeInput, options: IOptions): {
        range: string;
        options: IOptions;
        set: readonly (readonly Comparator[])[];
    };
    protected _inheritOptions(options: IOptions): void;
    format(): string;
    /**
     * Return '*' instead of '' so that truthiness works.
     */
    toRangeString(): string;
}
export { SemverRange as Range };
export default SemverRange;
