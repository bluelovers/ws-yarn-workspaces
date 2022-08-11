import { Options, Range, RangeOptions } from 'semver';
import semverRange from 'semver/classes/range';
import SemVer from 'semver/classes/semver';
import SemverRange from './Range';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
import Comparator from 'semver/classes/comparator';
export interface IOptions extends Options, RangeOptions {
    noAmpersand?: boolean;
    unsafeOptimize?: boolean;
}
export declare type IOptionsOrLoose<T extends Options = IOptions> = boolean | T;
export declare type IComparatorSet = Range["set"];
export declare type IComparatorArrayInput = ITSArrayListMaybeReadonly<Comparator>;
export declare type IComparatorSetInput = ITSArrayListMaybeReadonly<IComparatorArrayInput>;
export declare type ISemverRangeInput = string | SemverRange<any> | semverRange | SemVer | Comparator;
