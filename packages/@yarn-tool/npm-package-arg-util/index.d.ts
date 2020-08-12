import { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
export declare type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;
export declare function npa(arg: string, where?: string): IResult;
export declare function getSemverFromNpaResult(npaResult: IResult): string;
export default npa;
