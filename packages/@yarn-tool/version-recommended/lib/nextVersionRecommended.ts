import { inc as semverIncrement, ReleaseType } from 'semver';
import { INextVersionRecommended, INextVersionRecommendedOptions } from './types';
import { handleOptions } from './handleOptions';

export function nextVersionRecommended(oldVersion: string,
	options?: INextVersionRecommendedOptions,
): INextVersionRecommended
{
	options = handleOptions(options, oldVersion);

	let bump = options.bump ?? 'patch';

	const newVersion = semverIncrement(oldVersion, bump, options.preid, options.identifierBase as any);

	return {
		bump,
		oldVersion,
		newVersion,
	}
}

