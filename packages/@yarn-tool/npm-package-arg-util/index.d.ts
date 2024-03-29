import { AliasResult, FileResult, HostedGitResult, RegistryResult, URLResult } from 'npm-package-arg';
import { IResult, IResultType } from './lib/types';
export type { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult };
export type { IResult, IResultType };
export { getSemverFromNpaResult } from './lib/getSemverFromNpaResult';
export declare function npa<T extends IResult>(arg: string, where?: string): T;
export declare function npaTry<T extends IResult>(arg: string, where?: string): T;
export default npa;
