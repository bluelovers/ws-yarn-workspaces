import { IOptions } from '@yarn-tool/npa-to-deps-query';
import { ITSResolvable } from 'ts-type';
import { IDepsResult } from '@yarn-tool/npa-to-deps';
import Bluebird from 'bluebird';
import { IResult } from '@yarn-tool/npm-package-arg-util';
export declare const enum EnumIsPublishedState {
    VersionPublished = 0,
    VersionNotFound = 1,
    PackageNotFound = 2
}
export interface IPublishedResultBase {
    depsResult: IDepsResult<IResult>;
    exists: boolean;
    isPublished: null | boolean;
    state: EnumIsPublishedState;
}
export interface IPublishedResultVersionPublished extends IPublishedResultBase {
    queryResult: {
        name: string;
        value: string;
    };
    exists: true;
    isPublished: true;
    state: EnumIsPublishedState.VersionPublished;
}
export interface IPublishedResultVersionNotFound extends IPublishedResultBase {
    queryResult?: {
        name: string;
        value: string;
    };
    exists: true;
    isPublished: false;
    state: EnumIsPublishedState.VersionNotFound;
}
export interface IPublishedResultPackageNotFound extends IPublishedResultBase {
    exists: false;
    isPublished: null;
    state: EnumIsPublishedState.PackageNotFound;
}
export type IPublishedResult = IPublishedResultVersionPublished | IPublishedResultVersionNotFound | IPublishedResultPackageNotFound;
export declare function _isPublishedCoreByNpaResult(depsResult: ITSResolvable<IDepsResult<IResult>>, options?: IOptions): Bluebird<IPublishedResult>;
export declare function _isPublishedCore(input: string, options?: IOptions): Bluebird<IPublishedResult>;
export declare function _isPublishedCoreByPackageJSON(pkg: {
    name: string;
    version: string;
}, options?: IOptions): Bluebird<IPublishedResult>;
export declare function isPublishedByNpaResult(depsResult: ITSResolvable<IDepsResult>, options?: IOptions): Bluebird<boolean>;
export declare function isPublished(input: string, options?: IOptions): Bluebird<boolean>;
export declare function isPublishedByPackageJSON(pkg: {
    name: string;
    version: string;
}, options?: IOptions): Bluebird<boolean>;
export default isPublishedByPackageJSON;
