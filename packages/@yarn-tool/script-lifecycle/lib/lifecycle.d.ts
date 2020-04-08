export declare const lifecycleMap: {
    install: {
        name: "install";
        ignoreSelf: boolean;
        before: string[];
        after: string[];
    };
    pack: {
        name: "pack";
        ignoreSelf: boolean;
        before: string[];
        after: string[];
    };
    publish: {
        name: "publish";
        ignoreSelf: boolean;
        before: string[];
        after: string[];
    };
};
export default lifecycleMap;
