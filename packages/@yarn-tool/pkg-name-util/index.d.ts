export interface IPackageNameInfo {
    scope?: string;
    name: string;
}
export declare function formatPackageName(data: IPackageNameInfo): string;
export declare function stripScope(packageName: string): string;
export declare function assertScope(scope: string, includeAtSign?: boolean): asserts scope is string;
export declare function validScope(scope: string, includeAtSign?: boolean): scope is string;
export default formatPackageName;
