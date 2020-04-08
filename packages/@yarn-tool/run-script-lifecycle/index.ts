/**
 * Created by user on 2020/4/8.
 */
import runScriptPkg from '@npmcli/run-script/lib/run-script-pkg';
import { pathExistsSync } from 'fs-extra';
import { join } from 'path';
import { getLifecycle } from '@yarn-tool/script-lifecycle';
import { IRunLifecycleScriptOptions, IError, IResult, IResultNotExists, IPackageJson2 } from './lib/types';
import { runLifecycleScriptCore, _options, runLifecycleScriptList } from './lib/util';
import rpj from 'read-package-json-fast';

export async function runLifecycleScript(options: IRunLifecycleScriptOptions)
{
	const pkg_path = join(options.path, 'package.json');

	if (pathExistsSync(pkg_path))
	{
		return (rpj(pkg_path) as Promise<IPackageJson2>)
			.then(async (pkg: IPackageJson2) =>
			{
				let lifecycle = getLifecycle(options.event);

				let tmpOptions = _options({
					...options,
					args: [],
					event: void 0,
					pkg,
				})

				const resultList: (IResultNotExists | IResult)[] = [];

				if (lifecycle.before?.length)
				{
					const results = await runLifecycleScriptList({
						eventList: lifecycle.before,
						tmpOptions,
						pkg,
					})

//					results.forEach((result) => {
//						stdoutAll.push(result.stdout)
//					})

					resultList.push(...results)
				}

				const result = await runLifecycleScriptCore({
					...options,
					pkg,
				}, runScriptPkg)

				resultList.push(result)

				if (lifecycle.after?.length)
				{
					const results = await runLifecycleScriptList({
						eventList: lifecycle.after,
						tmpOptions,
						pkg,
					})

//					results.forEach((result) => {
//						stdoutAll.push(result.stdout)
//					})
					resultList.push(...results)
				}

				return resultList
			})
	}

	return runLifecycleScriptCore(options)
		.then(result => [result])
}

export default runLifecycleScript
