"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumScriptsEntry = void 0;
exports.scriptsEntryIsNoTestSpecified = scriptsEntryIsNoTestSpecified;
var EnumScriptsEntry;
(function (EnumScriptsEntry) {
    EnumScriptsEntry["JEST_TEST"] = "jest --passWithNoTests";
    EnumScriptsEntry["NO_TEST_SPECIFIED"] = "echo \"Error: no test specified\"";
    EnumScriptsEntry["NO_TEST_SPECIFIED_EXIT"] = "echo \"Error: no test specified\" && exit 1";
    EnumScriptsEntry["BUILD_DTS_BUNDLE"] = "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle";
    EnumScriptsEntry["preversion"] = "yarn run test";
})(EnumScriptsEntry || (exports.EnumScriptsEntry = EnumScriptsEntry = {}));
function scriptsEntryIsNoTestSpecified(value) {
    return value === "echo \"Error: no test specified\" && exit 1" /* EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT */ || value === "echo \"Error: no test specified\"" /* EnumScriptsEntry.NO_TEST_SPECIFIED */;
}
//# sourceMappingURL=scripts.js.map