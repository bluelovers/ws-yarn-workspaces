import { IRunLifecycleScriptOptions, IResultNotExists, IResult, IPackageJson2 } from './types';
export declare function formatOutput(result: IResult): string;
export declare function _options(options: IRunLifecycleScriptOptions): IRunLifecycleScriptOptions;
export declare function _hook(options: IRunLifecycleScriptOptions, fn?: any): Promise<IResultNotExists | IResult>;
export declare function runLifecycleScriptCore(options: IRunLifecycleScriptOptions, fn?: any): Promise<IResultNotExists | IResult>;
export declare function runLifecycleScriptList(options: {
    tmpOptions: IRunLifecycleScriptOptions;
    eventList: string[];
    pkg: IPackageJson2;
}): Promise<(IResultNotExists | IResult)[]>;
