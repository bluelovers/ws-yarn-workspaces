import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function sortPackageJsonExports(exports: IPackageJson["exports"]): string | {
    [k: string]: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
    "."?: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
} | {
    [k: string]: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
    require?: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
    import?: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
    node?: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
    default?: import("@ts-type/package-dts/types/package.json").PackageExportsEntry | import("@ts-type/package-dts/types/package.json").PackageExportsFallback;
} | import("@ts-type/package-dts/types/package.json").PackageExportsEntry[];
