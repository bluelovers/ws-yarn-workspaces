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
};
