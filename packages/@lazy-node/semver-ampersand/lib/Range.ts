import semverRange from 'semver/classes/range';
import { Options } from 'semver';
import { handleVersionRange } from './handleVersionRange';

export class Range extends semverRange
{
	rawRange?: string | Range;

	constructor(rawRange: string | Range | semverRange, optionsOrLoose?: boolean | Options) {
		const range = handleVersionRange(rawRange);

		super(range, optionsOrLoose);

		if (typeof rawRange === 'string' && range !== rawRange)
		{
			this.rawRange = rawRange;
		}
	}
}
