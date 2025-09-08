import { INextVersionRecommendedOptions, IPreReleaseType, IResultDetectPreid, releaseTypes } from './types';
import { parse, ReleaseType } from 'semver';
import { IdentifierBase } from 'semver/functions/inc';
import WorkspacesProject from '@yarn-tool/workspaces-project';

export function handleOptions(options?: INextVersionRecommendedOptions, oldVersion?: string, wsProject?: WorkspacesProject)
{
	options = {
		...options,
	}

	let bump = options.bump?.length ? options.bump : void 0;

	if (!bump)
	{
		for (let type of releaseTypes)
		{
			if (options[type] === true)
			{
				bump = type
				break;
			}
		}
	}

	if (oldVersion?.length && (!bump || releaseTypesIsPre(bump)))
	{
		options.bump = bump;

		const dt = detectPreidByVersion(oldVersion, options);

		if (dt)
		{
			bump = dt.bump;
			options.preid ??= dt.preid;
			options.identifierBase ??= dt.identifierBase;
		}
		else
		{
			bump ??= wsProject?.bump;
		}
	}

	options.bump = bump;

	/*
	for (let type of releaseTypes)
	{
		delete options[type]
	}
	 */

	return options
}

export function releaseTypesIsPre<T extends ReleaseType>(bump: T): bump is IPreReleaseType<T>
{
	return bump.startsWith('pre')
}

export function detectPreidByVersion(oldVersion: string, options?: INextVersionRecommendedOptions): IResultDetectPreid | null
{
	if (oldVersion.length)
	{
		const sv = parse(oldVersion);

		if (sv.prerelease?.length)
		{
			options ??= {};

			let preid: INextVersionRecommendedOptions["preid"] = options.preid;
			let identifierBase: IdentifierBase | false = options.identifierBase as any;

			let prerelease = sv.prerelease[0].toString();

			if (sv.prerelease.length > 1)
			{
				preid ??= prerelease
			}
			else if (/^\d+$/.test(prerelease))
			{
				identifierBase ??= false;
			}
			else
			{
				preid ??= options.defaultPreid;
			}

			let bump: INextVersionRecommendedOptions["bump"] = options.bump;

			if (!bump?.length)
			{
				bump = void 0;
			}
			else if (!releaseTypesIsPre(bump))
			{
				bump = 'pre' + bump;
			}

			return {
				bump: (bump ?? 'prerelease') as IPreReleaseType,
				preid,
				identifierBase,
			} satisfies IResultDetectPreid
		}
	}

	return null as null
}
