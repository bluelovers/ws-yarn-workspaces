/**
 * Created by user on 2020/4/9.
 */
import runScript from '@npmcli/run-script';
import runScriptPkg from '@npmcli/run-script/lib/run-script-pkg';

import { IRunLifecycleScriptOptions, IResultNotExists, IResult, IError, IPackageJson2 } from './types';

export function formatOutput(result: IResult)
{
	return `> ${result.pkgid} ${result.event}\n> ${result.script}\n${result.stdout}`
}

export function _options(options: IRunLifecycleScriptOptions): IRunLifecycleScriptOptions
{
	return {
		args: [],
		//stdioString: true,
		...options,
		stdio: 'inherit',
	}
}

export function _hook(options: IRunLifecycleScriptOptions, fn = runScript): Promise<IResultNotExists | IResult>
{
	return fn(options)
		.then((result: IResult) =>
		{
			result.stdio = options.stdio;
			return result
		})
		.catch((e: IError) =>
		{
			e.stdio = options.stdio;
			return Promise.reject(e)
		})
		;
}

export function runLifecycleScriptCore(options: IRunLifecycleScriptOptions, fn?)
{
	return _hook(_options(options), fn);
}

export async function runLifecycleScriptList(options: {
	tmpOptions: IRunLifecycleScriptOptions,
	eventList: string[],
	pkg: IPackageJson2,
})
{
	const { tmpOptions, eventList, pkg } = options;

	const results: (IResultNotExists | IResult)[] = [];

	for (const event of eventList)
	{
		if (event in pkg.scripts)
		{
			let result = await _hook({
				...tmpOptions,
				event,
			}, runScriptPkg);

			results.push(result as any)
		}
	}

	return results
}
