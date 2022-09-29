import { IFindRootReturnType } from '@yarn-tool/find-root';
import { resolve } from 'upath2';
import { fsRemoveFileSync } from 'fs-remove-extra';

export function _resetStaticFiles(cwd: string, options: {
	rootData: IFindRootReturnType
})
{
	for (const file of [
		'.gitignore',
		'.npmignore',
		'jest.config.js',
		'jest-preset.js',
		'.nowignore',
	])
	{
		fsRemoveFileSync(resolve(cwd, file))
	}
}
