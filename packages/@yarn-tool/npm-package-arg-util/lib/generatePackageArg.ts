import { IParsePackageName, IResult } from './types';

export function generatePackageArg(input: Pick<IParsePackageName, 'name' | 'semver' | 'type'>, includeVersion?: boolean)
{
	if (includeVersion && input.semver?.length > 0)
	{
		return input.name + '@' + input.semver
	}

	return input.name
}

export function _allowedResultType(type: IResult["type"])
{
	return ["tag", "version", "range"].includes(type)
}
