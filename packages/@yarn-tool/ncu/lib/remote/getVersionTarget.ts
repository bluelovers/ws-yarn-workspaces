import { IOptionsNpmCheckUpdates } from '../types';

export function _getVersionTarget(options: Partial<IOptionsNpmCheckUpdates>): IOptionsNpmCheckUpdates['versionTarget']
{
	// @ts-ignore
	return options.semverLevel || (options.newest ? 'newest' :
		options.greatest ? 'greatest' :
			'latest')
}

export function getVersionTarget(options: Partial<IOptionsNpmCheckUpdates> | string | IOptionsNpmCheckUpdates['versionTarget']): IOptionsNpmCheckUpdates['versionTarget']
{
	if (typeof options === 'string')
	{
		// @ts-ignore
		return options
	}
	else if (options.versionTarget)
	{
		return options.versionTarget
	}

	return _getVersionTarget(options)
}
