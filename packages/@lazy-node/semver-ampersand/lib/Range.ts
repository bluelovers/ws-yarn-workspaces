import semverRange from 'semver/classes/range';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';
import {
	IComparatorSet,
	IComparatorSetInput,
	IOptions,
	IOptionsOrLoose,
	ISemverRangeInput,
} from './types';
import { stringifyComparatorsSet } from './util/stringifyComparators';
import SemVer from 'semver/classes/semver';
import { classWithoutCallParentConstructor } from 'class-without-call-parent-constructor';
import { Comparator } from 'semver';
import { _copyOptions, _isSameOptions, _normalizeOptions } from './range/options';
import { toRangeString } from './range/toRangeString';
import { assertInvalidComparatorSet } from './util/assert';
import { fixComparatorSet } from './range/fixComparatorSet';
import { parseOptionsOrLoose } from './internal/parseOptionsOrLoose';
import { splitDoubleVerticalBar } from './util/split';
import { parseRange } from './range/parseRange';

export class SemverRange<RAW extends ISemverRangeInput> extends classWithoutCallParentConstructor(semverRange)
{
	readonly rawSource?: RAW;

	override readonly raw: string;
	override readonly set: IComparatorSet;

	override readonly options: IOptions;
	override readonly loose: boolean;
	override readonly includePrerelease: boolean;

	protected readonly formatted: string;

	constructor(rawSource: RAW, optionsOrLoose?: IOptionsOrLoose<IOptions>)
	{
		// skip original semverRange constructor
		super();

		optionsOrLoose = parseOptionsOrLoose(optionsOrLoose);

		let { range, options, set } = this._inherit(rawSource, optionsOrLoose);

		if (typeof rawSource === 'string' && range !== rawSource)
		{
			this.rawSource = rawSource;
		}

		this._inheritOptions(options);

		if (!set)
		{

			set = this._buildComparatorsSet(range, options);
		}

		assertInvalidComparatorSet(set, `Invalid SemVer Range: ${range}`);

		set = fixComparatorSet(set, options.unsafeOptimize);

		assertInvalidComparatorSet(set);

		this.raw = range;
		this.set = set;

		this.format()
	}

	protected _buildComparatorsSet(range: string, options: IOptions): IComparatorSetInput
	{
		let comparatorsSet = splitDoubleVerticalBar(range)
			// map the range to a 2d array of comparators
			.map(range => this.parseRange(range))
			// throw out any comparator lists that are empty
			// this generally means that it was not a valid range, which is allowed
			// in loose mode, but will still throw if the WHOLE range is invalid.
			.filter(c => c.length)
		;

		return comparatorsSet
	}

	override parseRange(range: string)
	{
		return parseRange(range, this.options)
	}

	protected _inherit(range: ISemverRangeInput, options: IOptions)
	{
		let set: IComparatorSet;

		if (range instanceof semverRange)
		{
			options = {
				loose: range.loose,
				includePrerelease: range.includePrerelease,
				...range.options,
				...options,
			}

			options = _normalizeOptions(options);

			if (_isSameOptions(range, options))
			{
				set = range.set;
			}

			range = range.raw;
		}

		if (range instanceof Comparator)
		{
			set = [[range]];
			range = range.value
		}
		else if (range instanceof SemVer)
		{
			range = range.format();
		}

		if (set?.length === 0)
		{
			assertInvalidComparatorSet(set);
		}

		options = _normalizeOptions(options);

		range = handleAmpersandAndSpaces(range, options);

		return {
			range,
			options,
			set,
		}
	}

	protected _inheritOptions(options: IOptions)
	{
		(this as any as semverRange).options = options;
		_copyOptions(this, options);
	}

	// @ts-ignore
	override get range()
	{
		// @ts-ignore
		this.formatted = stringifyComparatorsSet(this.set);
		return this.formatted
	}

//	override format()
//	{
//		return this.range
//	}

	/**
	 * Return '*' instead of '' so that truthiness works.
	 */
	toRangeString()
	{
		return toRangeString(this.range)
	}

}

export { SemverRange as Range }

export default SemverRange
