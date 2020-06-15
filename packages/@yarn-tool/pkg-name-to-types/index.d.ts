declare const sep = "__";
declare const reNamespacedName: RegExp;
declare const reNamespacedNameWithVersion: RegExp;
export { sep, reNamespacedName, reNamespacedNameWithVersion };
export declare function parseArgvPkgName(input: string): {
    input: string;
    namespace: string;
    name: string;
    version: string;
};
export declare function isNamespacedName(packageName: string): boolean;
export declare function escapePackageName(packageName: string): string;
export declare function listToTypes(input: string[], includeVersion?: boolean): string[];
export declare function extractName(packageName: string): string;
export declare function pkgNameToTypes(packageName: string, includeVersion?: boolean): string;
export default pkgNameToTypes;
