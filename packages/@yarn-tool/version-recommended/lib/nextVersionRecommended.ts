import { inc as semverIncrement, ReleaseType } from 'semver';
import { INextVersionRecommended } from './types';

export function nextVersionRecommended(oldVersion: string, options?: {
	bump?: ReleaseType
}): INextVersionRecommended
{
	let bump = options?.bump ?? 'patch';

	const newVersion = semverIncrement(oldVersion, bump)

	return {
		bump,
		oldVersion,
		newVersion,
	}
}

