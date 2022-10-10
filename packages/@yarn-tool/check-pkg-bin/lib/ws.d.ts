import { IPackageJson } from '@ts-type/package-dts';
export declare function checkWorkspaces(cwd?: string): {
    name: string;
    pkg: IPackageJson<unknown>;
    pkgDir: string;
    result: {
        file: string;
        filename: string;
        hasShebang: boolean;
    }[];
    valid: boolean;
}[];
