import { valueFromRecord, IRecordLike, keyFromRecord } from 'value-from-record';
import { pathEnv } from 'path-env';
import { delimiter as _delimiter } from 'path';

export type IPathDelimiter = ':' | ';'

const delimiter: IPathDelimiter = _delimiter as any;

export { delimiter }

export function processEnv(ignoreErrors?: boolean)
{
	try
	{
		return process.env
	}
	catch (e)
	{
		if (!ignoreErrors)
		{
			throw e
		}
	}
}

export function envPathKey(env?: IRecordLike<string, any>): string
{
	return keyFromRecord('PATH', env ?? processEnv())
}

export function envPathObject(env?: IRecordLike<string, any>,
	key?: string,
	delim?: IPathDelimiter,
)
{
	return envObject(env, key, delim).path
}

export function envObject(env?: IRecordLike<string, any>,
	key?: string,
	delim?: IPathDelimiter,
)
{
	env ??= processEnv();
	key ??= envPathKey(env);
	delim ??= delimiter;

	if (typeof (env as Map<any, any>).entries === 'function')
	{
		env = (env as Map<any, any>).entries()
	}

	return pathEnv(env as Record<any, any>, key, delim)
}

export default envPathObject
