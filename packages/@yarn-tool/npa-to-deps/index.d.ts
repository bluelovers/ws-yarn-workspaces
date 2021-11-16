import { IResult } from '@yarn-tool/npm-package-arg-util';
export interface IOptions {
    where?: string;
    /**
     * when input is tag, preserve it
     */
    preserveTag?: boolean;
    /**
     * when input is range, preserve it
     */
    preserveRange?: boolean;
}
export interface IDepsResult<T extends IResult = IResult> {
    name: string;
    semver?: string;
    operator?: string;
    fetchQuery?: boolean;
    result: T;
}
export declare function npaResultToDepsValue<T extends IResult>(result: T, options?: IOptions): IDepsResult<T>;
export declare function npaToDepsValue<T extends IResult = IResult>(arg: string, options?: IOptions): IDepsResult<T>;
export default npaToDepsValue;
