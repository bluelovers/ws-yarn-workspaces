import { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
export interface IParsePackageName {
    type: IResult["type"];
    name: string;
    scope: string;
    subname: string;
    semver: string;
    result: IResult;
}
export declare type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;
