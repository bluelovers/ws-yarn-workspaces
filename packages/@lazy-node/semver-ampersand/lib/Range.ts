import semverRange from 'semver/classes/range';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';
import { IOptionsOrLoose } from './types';
import { stringifyComparators, stringifyComparatorsSet } from './util/stringifyComparators';
import SemVer from 'semver/classes/semver';
import parseOptionsOrLoose from 'semver/internal/parse-options';

export class SemverRange extends semverRange
{
	rawSource?: string | SemverRange | semverRange | SemVer;

	constructor(rawSource: string | SemverRange | semverRange | SemVer, optionsOrLoose?: IOptionsOrLoose)
	{

		optionsOrLoose = parseOptionsOrLoose(optionsOrLoose);

		let range = handleAmpersandAndSpaces(rawSource, optionsOrLoose);

		if (range instanceof SemVer)
		{
			range = range.format();
		}

		super(range, optionsOrLoose);

		if (typeof rawSource === 'string' && range !== rawSource)
		{
			this.rawSource = rawSource;
		}
	}

	override format()
	{
		this.range = stringifyComparatorsSet(this.set);
		return this.range
	}

	/**
	 * Return '*' instead of '' so that truthiness works.
	 */
	toRangeString()
	{
		return this.range || '*'
	}

}

export { SemverRange as Range }

export default SemverRange
