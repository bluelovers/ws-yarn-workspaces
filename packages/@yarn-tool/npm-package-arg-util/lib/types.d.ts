import { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
export interface IParsePackageName {
    type: IResultType;
    name: string;
    scope: string;
    subname: string;
    semver: string;
    result: IResult;
}
export declare type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;
export declare type IResultType = IResult["type"];
