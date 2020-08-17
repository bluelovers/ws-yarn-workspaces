/// <reference types="npm-package-arg" />
import { IParsePackageName } from './types';
/**
 * @deprecated
 */
export declare function parseArgvPkgName(input: string): {
    input: string;
    namespace: string;
    name: string;
    version: string;
    result: import("npm-package-arg").FileResult | import("npm-package-arg").HostedGitResult | import("npm-package-arg").URLResult | import("npm-package-arg").AliasResult | import("npm-package-arg").RegistryResult;
};
export declare function parsePackageName(packageName: string): IParsePackageName;
