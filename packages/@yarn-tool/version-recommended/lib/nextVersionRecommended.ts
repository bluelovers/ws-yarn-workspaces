import { inc as semverIncrement, ReleaseType } from 'semver';
import { INextVersionRecommended, INextVersionRecommendedOptions } from './types';
import { handleOptions } from './handleOptions';

export function nextVersionRecommended(oldVersion: string,
	options?: INextVersionRecommendedOptions,
): INextVersionRecommended
{
	let bump = handleOptions(options)?.bump ?? 'patch';

	const newVersion = semverIncrement(oldVersion, bump);

	return {
		bump,
		oldVersion,
		newVersion,
	}
}

