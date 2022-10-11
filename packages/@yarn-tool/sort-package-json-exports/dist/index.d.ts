import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageExportsEntryObject, IPackageExportsValue } from '@ts-type/package-dts/lib/package-json/exports';
export declare function isPackageJsonExportsEntryObject<T extends IPackageExportsValue, O extends IPackageExportsEntryObject = IPackageExportsEntryObject>(exports: T): exports is Extract<T, O>;
export interface IOptions {
    rootOrder?: readonly string[];
    entryOrder?: readonly string[];
}
export declare function _handleOptions(options?: IOptions): {
    rootOrder: string[];
    entryOrder: string[];
};
export declare function sortPackageJsonExports(exports: IPackageJson["exports"], options?: IOptions): import("@ts-type/package-dts/lib/package-json/exports").IPackageExportsValueFallback | import("@ts-type/package-dts/lib/package-json/exports").IPackageJsonExportsEntryObjectRoot;
export default sortPackageJsonExports;
