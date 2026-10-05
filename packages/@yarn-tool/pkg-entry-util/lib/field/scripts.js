"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumScriptsEntry = void 0;
exports.scriptsEntryIsNoTestSpecified = scriptsEntryIsNoTestSpecified;
var EnumScriptsEntry;
(function (EnumScriptsEntry) {
    EnumScriptsEntry["JEST_TEST"] = "jest --passWithNoTests";
    EnumScriptsEntry["NODE_TEST"] = "tsx --test --test-update-snapshots test/**/*.node-spec.ts test/**/*.node-test.ts test/**/*.spec.ts test/**/*.test.ts";
    EnumScriptsEntry["TSC_TEST"] = "tsc --noEmit & echo typescript check done";
    EnumScriptsEntry["NO_TEST_SPECIFIED"] = "echo \"Error: no test specified\"";
    EnumScriptsEntry["NO_TEST_SPECIFIED_EXIT"] = "echo \"Error: no test specified\" && exit 1";
    EnumScriptsEntry["BUILD_DTS_BUNDLE"] = "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle";
    EnumScriptsEntry["BUILD_DTS_COPY"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts";
    EnumScriptsEntry["BUILD_DTS_TSC_EMIT"] = "tsc --emitDeclarationOnly --declaration --noEmit false";
    EnumScriptsEntry["BUILD_DTS_TSC"] = "node --run build:dts:tsc:emit & node --run build:dts:copy";
    EnumScriptsEntry["BUILD_TSDX"] = "ynpx @bluelovers/tsdx build --target node --name index";
    EnumScriptsEntry["BUILD_TSDX_AND_DTS"] = "node --run build:tsdx && node --run build:dts:bundle";
    EnumScriptsEntry["preversion"] = "pnpm run test";
})(EnumScriptsEntry || (exports.EnumScriptsEntry = EnumScriptsEntry = {}));
function scriptsEntryIsNoTestSpecified(value) {
    return value === "echo \"Error: no test specified\" && exit 1" /* EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT */ || value === "echo \"Error: no test specified\"" /* EnumScriptsEntry.NO_TEST_SPECIFIED */;
}
//# sourceMappingURL=scripts.js.map