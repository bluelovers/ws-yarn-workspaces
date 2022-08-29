import {
	valueFromRecord,
	IRecordLike,
	keyFromRecord,
	entriesOfRecord,
	setRecordValue,
} from 'value-from-record';
import { pathEnv, IPathDelimiter } from 'path-env2';
import { delimiter as _delimiter } from 'path';

export type { IPathDelimiter }

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

export function getEnvPathValue(env?: IRecordLike<string, any>,
	key?: string,
): string
{
	env ??= processEnv();
	key ??= envPathKey(env);

	return valueFromRecord(key, env)
}

export function setEnvPathValue(value: string | string[], env?: IRecordLike<string, string>,
	key?: string,
	delim?: IPathDelimiter,
)
{
	env ??= processEnv();
	key ??= envPathKey(env);

	if (typeof value !== 'string')
	{
		value = [...value].join(delim ?? delimiter);
	}

	return setRecordValue(value, key, env)
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
		env = Object.fromEntries(entriesOfRecord(env))
	}

	return pathEnv(env as Record<any, any>, key, delim)
}

export default envPathObject
