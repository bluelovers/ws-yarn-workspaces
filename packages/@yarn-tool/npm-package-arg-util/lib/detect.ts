import { AliasResult, FileResult, HostedGit, HostedGitResult, RegistryResult, URLResult } from 'npm-package-arg';
import { IResult } from './types';

export function isAliasResult(npaResult: IResult): npaResult is AliasResult
{
	return npaResult.type === 'alias';
}

export function isFileResult(npaResult: IResult): npaResult is FileResult
{
	return npaResult.type === 'file' || npaResult.type === 'directory';
}

export function isRegistryResult(npaResult: IResult): npaResult is RegistryResult
{
	return npaResult.type === 'version' || npaResult.type === 'range' || npaResult.type === 'tag';
}

export function isHostedGitResult(npaResult: IResult): npaResult is HostedGitResult
{
	return npaResult.type === 'git' && npaResult.hosted?.domain?.length > 0;
}

export function isURLResult(npaResult: IResult): npaResult is URLResult
{
	return npaResult.type === 'git' && !isHostedGitResult(npaResult) || npaResult.type === 'remote';
}

export function isNpmPackageArgResult<T extends IResult>(npaResult: IResult): npaResult is T
{
	return isAliasResult(npaResult) || isFileResult(npaResult) || isRegistryResult(npaResult) || isHostedGitResult(npaResult) || isURLResult(npaResult)
}
