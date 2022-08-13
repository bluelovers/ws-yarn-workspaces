import { omitKey, defaultNpmScriptsOrder, otherScriptNames } from './util';
export interface ISortPackageJsonScriptsOptions {
    /**
     * avoid omitKey wrong parse script name (e.g. prettier
     */
    otherScriptNames?: typeof otherScriptNames;
    /**
     * group / sore scripts order, by default is follow npm lifecycle scripts
     */
    defaultNpmScriptsOrder?: typeof defaultNpmScriptsOrder;
    /**
     * change omit key logic
     */
    omitKeyFn?: typeof omitKey;
    sortKeyFn?: (a: string, b: string) => number;
}
export type ISortPackageJsonScriptsOptionsRequired = Required<Omit<ISortPackageJsonScriptsOptions, 'sortKeyFn'>> & Pick<ISortPackageJsonScriptsOptions, 'sortKeyFn'>;
