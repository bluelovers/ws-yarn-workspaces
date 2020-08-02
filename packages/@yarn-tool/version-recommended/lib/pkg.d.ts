import { INextVersionRecommendedOptions } from './types';
export declare function nextVersionRecommendedByPackage(pkg: {
    version?: string;
}, options?: INextVersionRecommendedOptions): import("./types").INextVersionRecommended;
export declare function nextVersionRecommendedByPackageFindUp(options?: INextVersionRecommendedOptions): import("./types").INextVersionRecommended;
