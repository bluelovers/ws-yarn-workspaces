import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function sortPackageJsonExports(exports: IPackageJson["exports"]): string | import("@ts-type/package-dts/lib/package-json/exports").IPackageJsonExportsEntryObjectRoot | {
    [k: string]: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
    "."?: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
} | import("@ts-type/package-dts/types/package.json").PackageExportsEntryObject1 | import("@ts-type/package-dts/types/package.json").PackageExportsFallback1;
