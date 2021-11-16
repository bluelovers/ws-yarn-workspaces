import { IResult, npa } from '@yarn-tool/npm-package-arg-util';
import { parseSimpleSemVerRange } from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange';

export interface IOptions
{
	where?: string,
	/**
	 * when input is tag, preserve it
	 */
	preserveTag?: boolean,

	/**
	 * when input is range, preserve it
	 */
	preserveRange?: boolean,
}

export interface IDepsResult<T extends IResult = IResult>
{
    name: string;
    semver?: string;
    operator?: string;
    fetchQuery?: boolean;
    result: T;
}

export function npaResultToDepsValue<T extends IResult>(result: T, options?: IOptions): IDepsResult<T>
{
	let semver: string;
	let operator: string;
	let fetchQuery: boolean;

	switch (result.type)
	{
		case 'git':
			semver = result.saveSpec
			break;
		case 'tag':
			if (result.fetchSpec?.length && options?.preserveTag)
			{
				semver = result.fetchSpec
			}
			else
			{
				operator = '^';
				fetchQuery = true;
			}
			break;
		case 'range':

			if (result.fetchSpec?.length)
			{
				let ls = parseSimpleSemVerRange(result.fetchSpec);

				if (ls.length > 1)
				{
					semver = result.fetchSpec
				}
				else if (options?.preserveRange)
				{
					semver = result.fetchSpec
				}
				else if (ls.length === 1)
				{
					let entry = ls[0];

					if (!entry.operator)
					{
						semver = result.fetchSpec
						fetchQuery = true;
					}
					else if (entry.operator !== '^')
					{
						semver = result.fetchSpec
					}
					else
					{
						operator = '^';
						fetchQuery = true;
					}

				}
				else
				{
					operator = '^';
					fetchQuery = true;
				}
			}
			else
			{
				operator = '^';
				fetchQuery = true;
			}

			break;
		default:

			if (result.fetchSpec?.length)
			{
				semver = result.fetchSpec
			}

			break;
	}

	return {
		name: result.name,
		semver,
		operator,
		fetchQuery,
		result,
	}
}

export function npaToDepsValue<T extends IResult = IResult>(arg: string, options?: IOptions)
{
	let result = npa(arg, options?.where);

	return npaResultToDepsValue<T>(result as any)
}

export default npaToDepsValue
