"use strict";
/**
 * Created by user on 2019/5/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = setupToYargs;
const yargs_setting_1 = require("@yarn-tool/fix-all/lib/util/yargs-setting");
/**
 * 設定 Yargs CLI 選項
 * Setup Yargs CLI options
 *
 * 繼承 @yarn-tool/fix-all 的共用選項
 * （overwriteHostedGitInfo / branch / resetStaticFiles / addStaticFiles / noStaticFiles）
 * Inherits shared options from @yarn-tool/fix-all
 * (overwriteHostedGitInfo / branch / resetStaticFiles / addStaticFiles / noStaticFiles)
 *
 * @param yargs - Yargs 實例 / Yargs instance
 */
function setupToYargs(yargs) {
    const _return = yargs
        .default({
    //input: process.cwd(),
    })
        .option('npmClient', {
        alias: ['N'],
        requiresArg: true,
        normalize: true,
        description: 'npm, yarn, ...etc',
        default: 'npm',
        type: 'string',
    })
        .option('yes', {
        alias: ['y', 'silent'],
        //		requiresArg: true,
        //		default: 'npm',
        type: 'boolean',
    })
        .option('cwd', {
        alias: ['C'],
        requiresArg: true,
        normalize: true,
        //		default: process.cwd(),
        defaultDescription: process.cwd(),
        type: 'string',
    })
        .option('skipCheckWorkspace', {
        alias: ['W'],
        type: 'boolean',
    })
        .option('force', {
        alias: ['f'],
        type: 'boolean',
    })
        .option('sort', {
        type: 'boolean',
        default: true,
    })
        .option('private', {
        alias: ['p'],
        type: 'boolean',
    })
        .option('createModule', {
        alias: ['m'],
        type: 'string',
    })
        .option('name', {
        type: 'string',
    })
        .option('copyStatic', {
        type: 'boolean',
    })
        .option('tsdx', {
        type: 'boolean',
    });
    /**
     * 繼承 @yarn-tool/fix-all 的共用靜態檔案選項
     * Inherit shared static file options from @yarn-tool/fix-all
     */
    return (0, yargs_setting_1.setupToYargs)(_return);
}
exports.default = setupToYargs;
//# sourceMappingURL=yargs-setting.js.map