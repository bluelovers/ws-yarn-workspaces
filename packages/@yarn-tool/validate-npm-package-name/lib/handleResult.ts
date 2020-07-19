import { IResult } from './types';

export function handleResult(warnings: string[], errors: string[])
{
	const result: IResult = {
		validForNewPackages: errors.length === 0 && warnings.length === 0,
		validForOldPackages: errors.length === 0,
		warnings: warnings,
		errors: errors,
	};
	if (!result.warnings.length) delete result.warnings
	if (!result.errors.length) delete result.errors
	return result
}
