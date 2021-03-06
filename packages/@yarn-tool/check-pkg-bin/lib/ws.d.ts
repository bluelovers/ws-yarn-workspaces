export declare function checkWorkspaces(cwd?: string): {
    name: string;
    pkg: import("npm-package-json-loader").IPackageJson<any>;
    pkgDir: string;
    result: {
        file: string;
        filename: string;
        hasShebang: boolean;
    }[];
    valid: boolean;
}[];
