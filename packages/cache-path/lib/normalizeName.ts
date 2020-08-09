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

	return name
		.trim()
		.replace(/[^\w\-\.]/g, '_')
		.replace(/\.+/g, '_')
		.replace(/_+/g, '_')
		;
}
