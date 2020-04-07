import { otherScriptNames, defaultNpmScriptsOrder, omitKey } from './util';
import type { ISortPackageJsonScriptsOptions, ISortPackageJsonScriptsOptionsRequired } from './types';

export function handleOptions(opts?: ISortPackageJsonScriptsOptions): ISortPackageJsonScriptsOptionsRequired
{
	return {
		...(opts ?? {}),
		otherScriptNames: opts?.otherScriptNames ?? otherScriptNames,
		defaultNpmScriptsOrder: opts?.defaultNpmScriptsOrder ?? defaultNpmScriptsOrder,
		omitKeyFn: opts?.omitKeyFn ?? omitKey,
		sortKeyFn: opts?.sortKeyFn,
	}
}

export default handleOptions
