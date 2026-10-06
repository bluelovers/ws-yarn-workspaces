"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupYarnAddTypesToYargs = setupYarnAddTypesToYargs;
const setupYarnAddToYargs_1 = require("./setupYarnAddToYargs");
/**
 * 註冊 types 相關選項 (Register the types-related options)
 *
 * Register the `@types/*` install options on the given yargs instance.
 *
 * @param yargs yargs 實例 (The yargs instance)
 *
 * @returns 同一個 yargs 實例，已包含 `yarn add` 選項與 types 選項
 *
 * The same yargs instance, already containing both the `yarn add` and the
 * types options.
 */
function setupYarnAddTypesToYargs(yargs) {
    return (0, setupYarnAddToYargs_1.setupYarnAddToYargs)(yargs, {
        allowEmptyName: true,
    })
        /**
         * `auto` / `all` 決定掃描來源，`AA` 為兩者的捷徑；
         * 以捷徑減少長指令在終端機輸入時的出錯機會。
         *
         * `auto` / `all` choose the scan source and `AA` is a shortcut for both,
         * reducing typos when typing long commands in a terminal.
         */
        .option('auto', {
        desc: `auto install from package.json`,
        boolean: true,
    })
        .option('all', {
        desc: `dependencies, devDependencies from package.json`,
        boolean: true,
    })
        .option('AA', {
        desc: `--auto --all`,
        boolean: true,
    })
        /**
         * 關閉 strict：此指令常由腳本附加未知參數，
         * 嚴格模式會直接中斷既有的自動化流程。
         *
         * Strict mode is disabled because scripts often append unknown arguments
         * and a strict parse would break existing automation.
         */
        .strict(false);
}
//# sourceMappingURL=setupYarnAddTypesToYargs.js.map