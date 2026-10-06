"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = setupToYargs;
/**
 * 註冊自動修復相關的 yargs 選項
 * Register yargs options related to auto-fix
 *
 * 選項定義與 INpmAutoFixAll 介面一一對應；別名（-O / -S）是為了讓 CLI
 * 操作更簡短，同時保留完整名稱以利閱讀指令歷程
 * Option definitions map one-to-one with the INpmAutoFixAll interface;
 * aliases (-O / -S) keep the CLI short while full names remain for
 * readable command history
 *
 * @param yargs - 要擴充的 yargs 實例 / The yargs instance to extend
 * @returns 帶有選項定義的 yargs 實例（以 IYargsSync 型別回傳）/ The yargs instance with options defined (typed as IYargsSync)
 */
function setupToYargs(yargs) {
    const _return = yargs
        .option('overwriteHostedGitInfo', {
        boolean: true,
        alias: ['O', 'overwrite'],
    })
        .option('branch', {
        string: true,
    })
        .option('resetStaticFiles', {
        boolean: true,
        alias: ['S'],
    })
        .option('addStaticFiles', {
        boolean: true,
    })
        .option('noStaticFiles', {
        boolean: true,
    });
    /**
     * 以雙重斷言繞過 yargs 泛型推導的限制，
     * 取得可精確推導選項型別的 IYargsSync 包裝
     * Double assertion bypasses yargs' generic inference limitation to
     * obtain the IYargsSync wrapper with precise option type inference
     */
    return _return;
}
//# sourceMappingURL=yargs-setting.js.map