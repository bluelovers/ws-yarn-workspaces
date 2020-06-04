export declare function wsFindPackageHasModules(cwd?: string, dir?: string): {
    modules: {
        name: string;
        location: string;
    }[];
    name: string;
    version: string;
    private: boolean;
    location: string;
}[];
export default wsFindPackageHasModules;
