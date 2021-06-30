import { AliasResult, FileResult, HostedGitResult, RegistryResult, URLResult } from 'npm-package-arg';
import { IResult } from './types';
export declare function isAliasResult(npaResult: IResult): npaResult is AliasResult;
export declare function isFileResult(npaResult: IResult): npaResult is FileResult;
export declare function isRegistryResult(npaResult: IResult): npaResult is RegistryResult;
export declare function isHostedGitResult(npaResult: IResult): npaResult is HostedGitResult;
export declare function isURLResult(npaResult: IResult): npaResult is URLResult;
export declare function isNpmPackageArgResult<T extends IResult>(npaResult: IResult): npaResult is T;
