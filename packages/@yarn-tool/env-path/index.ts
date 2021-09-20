
import { valueFromRecord, IRecordLike, keyFromRecord } from 'value-from-record';
import { pathEnv, pathString } from 'path-env'
import { delimiter as _delimiter } from 'path'

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

export function envPathKey(env: IRecordLike<string, any> = processEnv()): string
{
	return keyFromRecord('PATH', env)
}

export function envPathObject(env: IRecordLike<string, any> = processEnv(),
	key?: string,
	delim: IPathDelimiter = delimiter,
)
{
	key ??= envPathKey(env);

	return pathString(valueFromRecord(key, env), delim)
}

export default envPathObject
