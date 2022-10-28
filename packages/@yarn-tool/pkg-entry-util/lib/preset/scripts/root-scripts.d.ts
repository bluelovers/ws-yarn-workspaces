export declare function defaultRootScripts(): {
    "prepublishOnly:check-bin": string;
    "version:bump": string;
    "npm:publish": string;
    "npm:publish:bump": string;
    "postpublish:git:commit": string;
    "postpublish:git:tag": string;
    "postpublish:changelog": string;
    "postpublish:git:push": string;
    postpublish: string;
    "ci:install": string;
    "test:jest:clearCache": string;
    "install:resetLockfile": string;
    "install:frozenLockfile": string;
    "ws:fix-all": string;
    "ws:fix-all:resetStaticFiles": string;
    coverage: string;
    "test:jest": import("../../field/scripts").EnumScriptsEntry;
    "test:snapshot": string;
    "test:jest:snapshot": string;
    "test:tsd": string;
};
