import { IListableRow } from 'ws-pkg-list/lib/types';
export declare function wsFindPackageHasModulesCore(list: IListableRow[], cwd: string, dir?: string): {
    modules: {
        name: string;
        location: string;
    }[];
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
}[];
export declare function wsFindPackageHasModules(cwd?: string, dir?: string): {
    modules: {
        name: string;
        location: string;
    }[];
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
}[];
export default wsFindPackageHasModules;
