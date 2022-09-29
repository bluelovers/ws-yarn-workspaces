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
		'.editorconfig.tpl',
		'jest.config.js.tpl',
		'.yarnrc.yml.tpl',
		'tsc-multi.json.tpl',
		'tsconfig.esm.json.tpl',
		'tsconfig.json.tpl',
		'tsconfig.tsdx.json.tpl',
		'tsdx.config.js.tpl',
		'.nycrc.tpl',
		'.npmrc.tpl',
		'.mocharc.yml.tpl',
		'.nowignore',
		'.browserslistrc',
		'.browserslistrc.tpl',
	] as const)
	{
		fsRemoveFileSync(resolve(cwd, file))
	}
}
