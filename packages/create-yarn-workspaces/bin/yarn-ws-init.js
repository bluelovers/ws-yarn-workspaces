#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const path_1 = require("path");
const yargs_setting_1 = tslib_1.__importDefault(require("../yargs-setting"));
const CWD = process.cwd();
let cli = (0, yargs_setting_1.default)(yargs_1.default)
    // @ts-ignore
    .command('$0', '', function (yargs) {
    // @ts-ignore
    let name = (yargs.argv.name || yargs.argv._[0]);
    if (name) {
        name = (0, path_1.join)(CWD, name);
    }
    else {
        name = CWD;
    }
    //console.log(CWD, yargs.argv);
    // @ts-ignore
    yargs.argv.debug && logger_1.default.debug(yargs.argv);
    let bool = (0, __1.default)(name, {
        // @ts-ignore
        ignoreExistsPackage: !!yargs.argv.ignoreExistsPackage,
        // @ts-ignore
        ignoreParentWorkspaces: !!yargs.argv.ignoreParentWorkspaces,
        // @ts-ignore
        debug: !!yargs.argv.debug,
    });
    //console.log(77777777777, bool);
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
    .argv;
//# sourceMappingURL=yarn-ws-init.js.map