import type { ISortPackageJsonScriptsOptions, ISortPackageJsonScriptsOptionsRequired } from './types';
export declare function handleKeyOrdersCore(names: string[], { otherScriptNames, defaultNpmScriptsOrder, omitKeyFn, sortKeyFn, }: ISortPackageJsonScriptsOptions | ISortPackageJsonScriptsOptionsRequired): string[];
export default handleKeyOrdersCore;
