import pathDirNormalize from 'path-dir-normalize';

export const enum EnumCheckPaths
{
	root = 1,
	rootPath = 0,
	failed = -1
}

export function checkPaths(input: {
	root,
	rootPath,
}, options?: {
	skipStrictCheck?: boolean
}): EnumCheckPaths
{
	let { root, rootPath } = input

	if (root?.length && rootPath?.length)
	{
		root = pathDirNormalize(root)
		rootPath = pathDirNormalize(rootPath)

		if (root !== rootPath)
		{
			if (rootPath.indexOf(root) === 0)
			{
				return EnumCheckPaths.root
			}
			else if (!options?.skipStrictCheck)
			{
				return EnumCheckPaths.failed
			}
		}

		return EnumCheckPaths.rootPath
	}
	else if (rootPath?.length)
	{
		return EnumCheckPaths.rootPath
	}

	return EnumCheckPaths.failed
}

{}

