"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumScriptsEntry = void 0;
exports.scriptsEntryIsNoTestSpecified = scriptsEntryIsNoTestSpecified;
/**
 * 常用腳本命令字串列舉
 * Enum of common script command strings
 *
 * 集中管理預設腳本的命令內容，讓各預設腳本模組引用同一份字串，
 * 避免命令在多處重複定義後逐漸不一致
 * Centralizes the command strings so every preset script module shares a
 * single source, preventing drift caused by duplicated definitions
 */
var EnumScriptsEntry;
(function (EnumScriptsEntry) {
    /** 以 Jest 執行測試，且在沒有測試檔時仍視為成功 / Run Jest tests, passing when no test files exist */
    EnumScriptsEntry["JEST_TEST"] = "jest --passWithNoTests";
    /** 以 Node.js 原生 test runner（經 tsx）執行測試並更新快照 / Run tests via Node's native runner (through tsx) and update snapshots */
    EnumScriptsEntry["NODE_TEST"] = "tsx --test --test-update-snapshots test/**/*.node-spec.ts test/**/*.node-test.ts test/**/*.spec.ts test/**/*.test.ts";
    /**
     * TypeScript 型別檢查：以 `&` 連結 echo，讓檢查完成後仍有成功訊息
     * Type check: chained with `&` so a completion message is printed afterward
     */
    EnumScriptsEntry["TSC_TEST"] = "tsc --noEmit & echo typescript check done";
    /** 未指定測試的預設錯誤訊息（不中斷流程）/ Default "no test specified" message (does not abort) */
    EnumScriptsEntry["NO_TEST_SPECIFIED"] = "echo \"Error: no test specified\"";
    /** 同上，但以 `exit 1` 讓腳本以失敗結束 / Same as above, but exits with code 1 to fail the script */
    EnumScriptsEntry["NO_TEST_SPECIFIED_EXIT"] = "echo \"Error: no test specified\" && exit 1";
    /** 以 dts-bundle-generator 產生打包型別檔 / Generate a bundled declaration file with dts-bundle-generator */
    EnumScriptsEntry["BUILD_DTS_BUNDLE"] = "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle";
    /** 複製已存在的型別檔到 dist（Windows copy 指令）/ Copy an existing declaration file into dist (Windows copy command) */
    EnumScriptsEntry["BUILD_DTS_COPY"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts";
    /** 僅輸出型別宣告檔 / Emit declaration files only */
    EnumScriptsEntry["BUILD_DTS_TSC_EMIT"] = "tsc --emitDeclarationOnly --declaration --noEmit false";
    /** 完整型別建構：先 emit 再複製 / Full type build: emit first, then copy */
    EnumScriptsEntry["BUILD_DTS_TSC"] = "node --run build:dts:tsc:emit & node --run build:dts:copy";
    /** 以 TSDX 建構 JS bundle / Build the JS bundle with TSDX */
    EnumScriptsEntry["BUILD_TSDX"] = "ynpx @bluelovers/tsdx build --target node --name index";
    /** 建構 JS 與打包型別檔（兩者依序執行）/ Build JS and bundled declarations (run in sequence) */
    EnumScriptsEntry["BUILD_TSDX_AND_DTS"] = "node --run build:tsdx && node --run build:dts:bundle";
    /** 版本遞增前先跑測試，避免發布未經驗證的版本 / Run tests before a version bump so unverified code is never published */
    EnumScriptsEntry["preversion"] = "pnpm run test";
})(EnumScriptsEntry || (exports.EnumScriptsEntry = EnumScriptsEntry = {}));
/**
 * 判斷腳本命令是否為「未指定測試」的佔位訊息
 * Check whether a script command is the "no test specified" placeholder
 *
 * 同時涵蓋會中斷（`exit 1`）與不會中斷兩種變體，
 * 讓呼叫端不必自行比較兩組字串
 * Covers both the aborting (`exit 1`) and non-aborting variants so callers
 * need not compare two literals themselves
 *
 * @param value - 要檢查的腳本命令 / the script command to check
 * @returns 是否為未指定測試的佔位訊息 / whether it is the "no test specified" placeholder
 */
function scriptsEntryIsNoTestSpecified(value) {
    return value === "echo \"Error: no test specified\" && exit 1" /* EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT */ || value === "echo \"Error: no test specified\"" /* EnumScriptsEntry.NO_TEST_SPECIFIED */;
}
//# sourceMappingURL=scripts.js.map