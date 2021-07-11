import { IOptions } from './types';
import hashSum from 'hash-sum';

/**
 * normalize cache name
 */
export function normalizeName(name: string, hash?: IOptions["hash"]): string
{
	if (hash)
	{
		if (typeof hash === 'function')
		{
			return hash(name)
		}

		return hashSum(name);
	}

	const normalized = name
		.trim()
		.replace(/[^\w\-\.]/g, '_')
		.replace(/\.+/g, '_')
		.replace(/_+/g, '_')
	;

	if (!/[^_]/.test(normalized))
	{
		throw new Error(`unsafe normalizeName { ${name} => ${normalized} }`)
	}

	return normalized
}
