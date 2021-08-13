import { IFindRootOptions } from '@yarn-tool/find-root';
export interface IOptions extends Partial<IFindRootOptions> {
    name: string;
    targetNodeModulesPath: string;
    sourcePackagePath: string;
    cwd?: string;
    targetNodeModulesName?: string;
    overwrite?: boolean;
}
export declare function linkToNodeModulesCore<T extends IOptions>(options: T): T & {
    resultPath: string;
};
export declare function linkToNodeModules<T extends Partial<IOptions>>(options?: T): IOptions & {
    resultPath: string;
};
export default linkToNodeModules;
