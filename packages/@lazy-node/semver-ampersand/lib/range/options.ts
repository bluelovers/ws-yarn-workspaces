import semverRange from 'semver/classes/range';
import { IOptions } from '../types';
import { fixBooleanProperty, opts } from '../util/fixBooleanProperty';

export function _isSameOptions(oldOptions: IOptions, newOptions: IOptions)
{
	return oldOptions.loose === newOptions.loose &&
		oldOptions.includePrerelease === newOptions.includePrerelease
}

export function _copyOptions(oldOptions: IOptions, newOptions: IOptions)
{
	oldOptions.loose = !!newOptions.loose
	oldOptions.includePrerelease = !!newOptions.includePrerelease

	return oldOptions
}

export function _normalizeOptions(options: IOptions)
{
	options = fixBooleanProperty(options, [
		'loose',
		'includePrerelease',
	], true)

	return options
}
