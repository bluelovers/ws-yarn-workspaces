export declare function checkWorkspaces(cwd?: string): {
    name: string;
    pkg: import("@ts-type/package-dts").IPackageJson<any>;
    pkgDir: string;
    result: {
        file: string;
        filename: string;
        hasShebang: boolean;
    }[];
    valid: boolean;
}[];
