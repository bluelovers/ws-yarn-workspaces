import { inc as semverIncrement, ReleaseType } from 'semver';
import { INextVersionRecommended, INextVersionRecommendedOptions } from './types';
import { handleOptions } from './handleOptions';
import WorkspacesProject from '@yarn-tool/workspaces-project';

export function nextVersionRecommended(oldVersion: string,
	options?: INextVersionRecommendedOptions,
	wsProject?: WorkspacesProject,
): INextVersionRecommended
{
	options = handleOptions(options, oldVersion, wsProject);

	let bump = options.bump ?? 'patch';

	const newVersion = semverIncrement(oldVersion, bump, options.preid, options.identifierBase as any);

	return {
		bump,
		oldVersion,
		newVersion,
	}
}

