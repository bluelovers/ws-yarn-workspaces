import { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
export { getSemverFromNpaResult } from './lib/getSemverFromNpaResult';
export declare type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;
export declare function npa(arg: string, where?: string): IResult;
export default npa;
