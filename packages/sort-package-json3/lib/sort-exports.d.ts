import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageExportsEntryObject, IPackageExportsValue, IPackageJsonExportsEntryObjectRoot } from '@ts-type/package-dts/lib/package-json/exports';
export declare function isPackageJsonExportsEntryObject<T extends IPackageExportsValue, O extends IPackageExportsEntryObject = IPackageExportsEntryObject>(exports: T): exports is Extract<T, O>;
export declare function sortPackageJsonExports(exports: IPackageJson["exports"]): import("@ts-type/package-dts/lib/package-json/exports").IPackageExportsValueFallback | IPackageJsonExportsEntryObjectRoot;
