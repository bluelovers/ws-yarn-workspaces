#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const logger_1 = __importDefault(require("debug-color2/logger"));
const yargs_1 = __importDefault(require("yargs"));
const path_1 = require("path");
const yargs_setting_1 = __importDefault(require("../yargs-setting"));
const CWD = process.cwd();
let cli = yargs_setting_1.default(yargs_1.default)
    // @ts-ignore
    .command('$0', '', function (yargs) {
    let name = yargs.argv.name || yargs.argv._[0];
    if (name) {
        name = path_1.join(CWD, name);
    }
    else {
        name = CWD;
    }
    //console.log(CWD, yargs.argv);
    yargs.argv.debug && logger_1.default.debug(yargs.argv);
    let bool = __1.default(name, {
        ignoreExistsPackage: !!yargs.argv.ignoreExistsPackage,
        ignoreParentWorkspaces: !!yargs.argv.ignoreParentWorkspaces,
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