export declare const enum EnumScriptsEntry {
    JEST_TEST = "jest --passWithNoTests",
    NO_TEST_SPECIFIED = "echo \"Error: no test specified\"",
    NO_TEST_SPECIFIED_EXIT = "echo \"Error: no test specified\" && exit 1",
    BUILD_DTS_BUNDLE = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle",
    preversion = "yarn run test"
}
export declare function scriptsEntryIsNoTestSpecified(value: string): value is EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT | EnumScriptsEntry.NO_TEST_SPECIFIED;
