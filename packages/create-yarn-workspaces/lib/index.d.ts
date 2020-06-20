export declare function getDefaultPackageJson(name?: string): {
    name: string;
    version: string;
    private: boolean;
    workspaces: string[];
    scripts: {
        [k: string]: string;
        test?: string;
    };
    resolutions: {
        [k: string]: string;
    };
    [k: string]: any;
};
export declare function getDefaultTsconfig(): {
    extends: string;
};
