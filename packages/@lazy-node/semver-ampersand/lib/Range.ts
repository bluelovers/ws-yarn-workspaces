import semverRange from 'semver/classes/range';
import { Options } from 'semver';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

export class SemverRange extends semverRange
{
	rawSource?: string | Range;

	constructor(rawSource: string | SemverRange | semverRange, optionsOrLoose?: boolean | Options) {
		const range = handleAmpersandAndSpaces(rawSource);

		super(range, optionsOrLoose);

		if (typeof rawSource === 'string' && range !== rawSource)
		{
			this.rawSource = rawSource;
		}
	}

}

export { SemverRange as Range }

export default SemverRange
