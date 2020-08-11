import semverRange from 'semver/classes/range';
import { Options } from 'semver';
import { handleVersionRange } from './handleVersionRange';

export class Range extends semverRange
{
	rawSource?: string | Range;

	constructor(rawSource: string | Range | semverRange, optionsOrLoose?: boolean | Options) {
		const range = handleVersionRange(rawSource);

		super(range, optionsOrLoose);

		if (typeof rawSource === 'string' && range !== rawSource)
		{
			this.rawSource = rawSource;
		}
	}

}

export default Range
