import { Options, Range } from 'semver';
import semverRange from 'semver/classes/range';
import SemVer from 'semver/classes/semver';
import SemverRange from './Range';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
import Comparator from 'semver/classes/comparator';

export interface IOptions extends Options
{
	noAmpersand?: boolean,
	unsafeOptimize?: boolean,
}

export type IOptionsOrLoose<T extends Options = IOptions> = boolean | T

export type IComparatorSet = Range["set"];

export type IComparatorArrayInput = ITSArrayListMaybeReadonly<Comparator>;

export type IComparatorSetInput = ITSArrayListMaybeReadonly<IComparatorArrayInput>;

export type ISemverRangeInput = string | SemverRange<any> | semverRange | SemVer | Comparator;
