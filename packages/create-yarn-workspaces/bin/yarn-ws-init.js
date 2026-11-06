#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("..");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const path_1 = require("path");
const yargs_setting_1 = tslib_1.__importDefault(require("../yargs-setting"));
/**
 * CLI 一律以呼叫當下的 shell 目錄作為基準路徑。
 */
const CWD = process.cwd();
/**
 * CLI 入口：解析參數後呼叫 createYarnWorkspacesAsync，失敗時印出說明。
 *
 * 以 async handler 搭配 parseAsync，確保互動介面（@clack/prompts）完成後才結束流程。
 */
let cli = (0, yargs_setting_1.default)(yargs_1.default)
    // @ts-ignore
    .command('$0', '', async function (yargs) {
    /** 優先採用 --name，否則取第一個位置參數作為目標資料夾名稱。 */
    // @ts-ignore
    let name = (yargs.argv.name || yargs.argv._[0]);
    /** 未指定名稱時就地初始化（以 CWD 為目標）。 */
    if (name) {
        name = (0, path_1.join)(CWD, name);
    }
    else {
        name = CWD;
    }
    //console.log(CWD, yargs.argv);
    // @ts-ignore
    yargs.argv.debug && logger_1.default.debug(yargs.argv);
    /** 布林參數以 !! 強制轉型；靜態檔案相關選項刻意保留原始值，讓 addStaticFiles 維持預設 true。 */
    let bool = await (0, __1.createYarnWorkspacesAsync)(name, {
        // @ts-ignore
        ignoreExistsPackage: !!yargs.argv.ignoreExistsPackage,
        // @ts-ignore
        ignoreParentWorkspaces: !!yargs.argv.ignoreParentWorkspaces,
        /**
         * 互動介面預設啟用（yargs default: true），可用 --no-interactive 關閉；
         * 無 TTY 時於 async 版本內自動退回警告。
         */
        // @ts-ignore
        interactive: !!yargs.argv.interactive,
        // @ts-ignore
        debug: !!yargs.argv.debug,
        /*
         * 保留 undefined，讓 addStaticFiles 維持預設 true
         * */
        // @ts-ignore
        addStaticFiles: yargs.argv.addStaticFiles,
        // @ts-ignore
        noStaticFiles: yargs.argv.noStaticFiles,
        // @ts-ignore
        resetStaticFiles: yargs.argv.resetStaticFiles,
    });
    //console.log(77777777777, bool);
    /** 回傳 false 代表前置檢查失敗（如已存在 Package）或使用者於互動介面取消，此時顯示說明協助使用者修正參數。 */
    if (!bool) {
        console.log('\n');
        yargs.showHelp();
    }
    else {
        logger_1.default.success(`done`);
    }
})
    .version()
    .help()
    .parseAsync();
//# sourceMappingURL=yarn-ws-init.js.map