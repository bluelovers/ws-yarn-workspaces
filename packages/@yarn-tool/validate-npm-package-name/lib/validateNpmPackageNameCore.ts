
import { IOptions, scopedPackagePattern } from './types';
import { handleResult } from './handleResult';
import { createNewIsBuiltinModule } from '@yarn-tool/is-builtin-module';

const defaultBlacklist: IOptions["blacklist"] = [
	'node_modules',
	'favicon.ico',
];

export function validate(name: string, options?: IOptions)
{
	const warnings: string[] = [];
	const errors: string[] = [];

	if (name === null)
	{
		errors.push('name cannot be null')
		return handleResult(warnings, errors)
	}

	if (name === undefined)
	{
		errors.push('name cannot be undefined')
		return handleResult(warnings, errors)
	}

	if (typeof name !== 'string')
	{
		errors.push('name must be a string')
		return handleResult(warnings, errors)
	}

	if (!name.length)
	{
		errors.push('name length must be greater than zero')
	}

	if (name.match(/^\./))
	{
		errors.push('name cannot start with a period')
	}

	if (name.match(/^_/))
	{
		errors.push('name cannot start with an underscore')
	}

	if (name.trim() !== name)
	{
		errors.push('name cannot contain leading or trailing spaces')
	}

	const name_lc = name.toLowerCase();

	const blacklist = options?.blacklist ?? defaultBlacklist;

	// No funny business
	blacklist.forEach(function (blacklistedName)
	{
		if (typeof blacklistedName !== 'string' && blacklistedName.test(name) || typeof blacklistedName === 'string' && name_lc === blacklistedName)
		{
			errors.push(blacklistedName + ' is a blacklisted name')
		}
	})

	// Generate warnings for stuff that used to be allowed

	// core module names like http, events, util, etc
	if (createNewIsBuiltinModule(options).isBuiltinModule(name_lc))
	{
		warnings.push(name_lc + ' is a core module name')
	}

	// really-long-package-names-------------------------------such--length-----many---wow
	// the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
	if (name.length > 214)
	{
		warnings.push('name can no longer contain more than 214 characters')
	}

	// mIxeD CaSe nAMEs
	if (name_lc !== name)
	{
		warnings.push('name can no longer contain capital letters')
	}

	if (/[~'!()*]/.test(name.split('/').slice(-1)[0]))
	{
		warnings.push('name can no longer contain special characters ("~\'!()*")')
	}

	if (encodeURIComponent(name) !== name)
	{
		// Maybe it's a scoped package name, like @user/package
		const nameMatch = name.match(scopedPackagePattern);
		if (nameMatch)
		{
			const user = nameMatch[1];
			const pkg = nameMatch[2];
			if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg)
			{
				return handleResult(warnings, errors)
			}
		}

		errors.push('name can only contain URL-friendly characters')
	}

	return handleResult(warnings, errors)
}

export default validate
