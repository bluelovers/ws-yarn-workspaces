export declare type IParseVersionsFindIndex = 0 | 1 | 2;
export declare function parseVersions(versionOld: string, versionNew: string): {
    versionOld: string;
    versionNew: string;
    partsOld: string[];
    partsNew: string[];
    index: IParseVersionsFindIndex;
};
export declare function parseVersionsAndCompare(versionOld: string, versionNew: string): {
    comp: 0 | 1 | -1;
    versionOld: string;
    versionNew: string;
    partsOld: string[];
    partsNew: string[];
    index: IParseVersionsFindIndex;
};
