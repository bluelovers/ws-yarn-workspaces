import { Options } from 'semver';
export interface IOptions extends Options {
    noAmpersand?: boolean;
}
export declare type IOptionsOrLoose<T extends Options = IOptions> = boolean | T;
