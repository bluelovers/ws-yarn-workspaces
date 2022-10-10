/**
 * Created by user on 2020/6/13.
 */
export declare function checkPkgDir(pkgDir?: string): {
    name: string;
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    pkgDir: string;
    result: {
        file: string;
        filename: string;
        hasShebang: boolean;
    }[];
    valid: boolean;
};
