import { basename, join, normalize, resolve, sep } from 'upath2';
import { pathInsideDirectory } from 'path-in-dir';

export function assertScopePath(scope: string, __root: string): asserts scope is string
{
	if (!scope?.length)
	{
		throw new Error(`Invalid scope: ${scope}`)
	}

	const __dir = resolve(__root, scope);

	if (pathInsideDirectory(__dir, __root))
	{
		throw new Error(`Invalid path: ${__dir}`)
	}
}

