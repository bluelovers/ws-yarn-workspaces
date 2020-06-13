import { processRunPathCore } from './lib';

type ProcessEnvCore<P> = P & {
	Path: string,
};

export type ProcessEnv = ProcessEnvCore<typeof process.env>;

export interface IOptionsFindBinPath
{
	cwd?: string,
	stopPath?: string | string[] | boolean
}

export interface IOptionsGetRunPathCore<P = ProcessEnv> extends IOptionsFindBinPath
{
	envPath?: string,
	execPath?: string,
	processEnv?: P | ProcessEnv,
}

export interface IOptionsGetRunPath<P = ProcessEnv> extends IOptionsGetRunPathCore<P>
{
	prepend?: boolean;

	appendExecPath?: boolean,

	includeEnvPath?: boolean;
}

export function processRunPath<P = ProcessEnv>(options: IOptionsGetRunPath<P> = {})
{
	let { binPaths, execPath, envPath, pathKey, delimiter, processEnv } = processRunPathCore(options);

	let result: string[] = [];

	if (options.includeEnvPath)
	{
		result.push(envPath);
	}

	let binPathString = binPaths.join(delimiter);

	if (options.prepend)
	{
		result.unshift(binPathString);
	}
	else
	{
		result.push(binPathString);
	}

	if (options.appendExecPath)
	{
		result.push(execPath);
	}

	return {
		result: result.join(delimiter),
		processEnv,
		pathKey,
		delimiter,
	};
}

export interface IOptionsGetRunPathEnv<P = ProcessEnv> extends IOptionsGetRunPath<P>
{
	overwrite?: boolean;
}

export function processRunPathEnv<P = ProcessEnv>(options: IOptionsGetRunPathEnv<P> = {}): ProcessEnvCore<P>
{
	let { processEnv, pathKey, result } = processRunPath({
		...options,
		includeEnvPath: true,
	});

	if (!options.overwrite)
	{
		processEnv = {
			...processEnv,
		}
	}

	processEnv[pathKey] = result;

	return processEnv as any;
}

export default processRunPathEnv
