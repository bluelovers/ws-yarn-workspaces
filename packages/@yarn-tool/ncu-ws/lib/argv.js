"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNcuToYargs2 = setupNcuToYargs2;
const ncu_1 = require("@yarn-tool/ncu");
/**
 * 設定 ncu-ws 的命令列選項 (Configure ncu-ws CLI options)
 * 相較於 `setupNcuToYargs` 多出：
 * - `resolutions` / `-R`：只處理 resolutions，不更新依賴
 * - `no-safe`：允許跳離目前版本範圍
 * - `AA`：一次啟用「workspace 模式 + 包含根套件」
 * 另附三個常見用法的 `.example()`，方便 `--help` 顯示。
 * Compared to `setupNcuToYargs` it adds:
 * - `resolutions` / `-R`: handle resolutions only, without touching dependencies
 * - `noSafe`: allow leaving the current version range
 * - `AA`: enable both workspace mode and root inclusion in one flag
 * Three common usages are also registered via `.example()` for `--help`.
 *
 * @param yargs - 需帶有 `cwd` 的 yargs 實例 / A yargs instance that carries `cwd`
 */
function setupNcuToYargs2(yargs) {
    return (0, ncu_1.setupNcuToYargs)(yargs)
        .option('resolutions', {
        alias: ['R'],
        desc: 'do with resolutions only',
        boolean: true,
    })
        .option('no-safe', {
        boolean: true,
    })
        .option('AA', {
        desc: 'all packages',
        boolean: true,
    })
        .example(`$0 ncu -u`, `check new version and update package.json`)
        .example(`$0 ncu -R`, `check new version of resolutions in package.json`)
        .example(`$0 ncu -u -R`, `check new version of resolutions in package.json and update package.json`);
}
//# sourceMappingURL=argv.js.map