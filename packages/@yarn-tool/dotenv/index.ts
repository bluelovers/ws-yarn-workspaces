import { config, DotenvConfigOutput } from 'dotenv';
import { pathUpToWorkspacesGenerator } from '@yarn-tool/path-parents';
import { resolve, join } from 'upath2';

export interface IDotenvFilesParams
{
	isTest?: boolean;
	dev?: boolean;
}

export function dotEnvFiles(options?: IDotenvFilesParams)
{
	let {
		isTest,
		dev,
	} = options ?? {};

	isTest = isTest ?? process.env.NODE_ENV === 'test'
	const mode = isTest ? 'test' : dev ? 'development' : 'production';

	const dotenvFiles = [
		`.env.${mode}.local`,
		// Don't include `.env.local` for `test` environment
		// since normally you expect tests to produce the same
		// results for everyone
		mode !== 'test' && `.env.local`,
		`.env.${mode}`,
		'.env',
	].filter(Boolean) as string[]

	return {
		isTest,
		dev,
		mode,
		dotenvFiles,
	}
}

export function wsEnvConfig<E = typeof process.env>(cwd?: string, options?: IDotenvFilesParams)
{
	cwd = resolve(cwd ?? process.cwd());
	const files = dotEnvFiles(options).dotenvFiles;

	let ret: DotenvConfigOutput;
	let current: string;
	let path: string;

	for (current of pathUpToWorkspacesGenerator(cwd))
	{

		for (let file of files)
		{
			path = join(current, file);

			ret = config({
				path,
			});

			if (!ret.error)
			{
				return {
					...ret,
					path,
					cwd,
					current,
				}
			}
		}
	}

	return {
		...ret,
		path,
		cwd,
		current,
	}
}

export default wsEnvConfig
