export declare function assertIsAbsolutePath(absolutePath: string): asserts absolutePath is string;
export declare function parseModulePath(absolutePath: string): {
    root: string;
    moduleBasename: string;
    parentBasename: string;
    isTypes: boolean;
    inNodeModules: boolean;
};
export declare function parseModulePathIsAlias(absolutePath: string): {
    parsed: import("@yarn-tool/npm-package-arg-util/lib/types").IParsePackageName;
    resolveData: {
        pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
        pkgJsonLocation: string;
        resolveLocation(path: string, ...paths: string[]): string;
        name: string;
        pkgRoot: string;
        entryPointLocation: string;
    };
    isAlias: boolean;
    root: string;
    moduleBasename: string;
    parentBasename: string;
    isTypes: boolean;
    inNodeModules: boolean;
};
export declare function parseModulePathIsAliasUnsafe(absolutePath: string): {
    parsed: import("@yarn-tool/npm-package-arg-util/lib/types").IParsePackageName;
    resolveData: {
        pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
        pkgJsonLocation: string;
        resolveLocation(path: string, ...paths: string[]): string;
        name: string;
        pkgRoot: string;
        entryPointLocation: string;
    };
    isAlias: boolean;
    root: string;
    moduleBasename: string;
    parentBasename: string;
    isTypes: boolean;
    inNodeModules: boolean;
};
export declare function modulePathIsAlias(dir: string): boolean;
export default modulePathIsAlias;
