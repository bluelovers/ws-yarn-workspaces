import { IRunLifecycleScriptOptions, IResult, IResultNotExists } from './lib/types';
export declare function runLifecycleScript(options: IRunLifecycleScriptOptions): Promise<(IResultNotExists | IResult)[]>;
export default runLifecycleScript;
