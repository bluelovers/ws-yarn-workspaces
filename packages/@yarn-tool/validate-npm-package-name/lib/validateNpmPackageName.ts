import { validate } from './validateNpmPackageNameCore';
import { scopedPackagePattern, IValidateNpmPackageNameReturnType, IOptions } from './types';

export function validateNpmPackageName(name: string, options?: boolean | IOptions)
{
	if (typeof options !== 'object')
	{
		options = {
			throwErr: options,
		}
	}

	const ret = validate(name, options) as IValidateNpmPackageNameReturnType;

	ret.name = name;

	if (!ret.errors?.length)
	{
		const nameMatch = name.match(scopedPackagePattern);

		if (nameMatch)
		{
			ret.scopedPackagePattern = true;

			ret.user = nameMatch[1];
			ret.subname = nameMatch[2];
		}
		else
		{
			ret.scopedPackagePattern = false;
		}
	}
	else if (options.throwErr)
	{
		throw new RangeError(ret.errors.concat(ret.warnings || []).join(' ; '));
	}

	return ret;
}

export default validateNpmPackageName
