#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const __1 = require("..");
const debug_color2_1 = require("debug-color2");
const cli_table3_1 = __importDefault(require("cli-table3"));
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const string_natural_compare_1 = __importDefault(require("@bluelovers/string-natural-compare"));
const table_1 = require("@yarn-tool/table");
const find_root_1 = require("@yarn-tool/find-root");
const cli = yargs_1.default
    .option('workspaces', {
    alias: ['w'],
    boolean: true,
})
    .option('cwd', {
    normalize: true,
    default: process.cwd(),
})
    .help()
    .argv;
const table = new cli_table3_1.default({
    colAligns: ['left', 'right'],
});
table_1.applyStyleBorderless(table);
const chalk = debug_color2_1.chalkByConsoleMaybe(debug_color2_1.console);
table.options.head = [
    chalk.bold.reset('package name'),
    chalk.bold.reset('validate'),
];
let bool;
const rootData = find_root_1.findRoot(cli);
if ((_a = cli.workspaces) !== null && _a !== void 0 ? _a : rootData.isWorkspace) {
    __1.checkWorkspaces(cli.cwd)
        .sort((a, b) => string_natural_compare_1.default(a.name, b.name))
        .forEach(data => {
        let valid = data.valid.toString();
        let color = 'gray';
        if (data.result.length) {
            bool = data.valid && (bool !== null && bool !== void 0 ? bool : true);
            color = data.valid ? 'green' : 'red';
        }
        else {
            valid = 'none';
        }
        table.push([
            data.name,
            chalk[color](valid),
        ]);
    });
}
else {
    let data = __1.checkPkgDir(pkg_dir_1.default.sync(cli.cwd));
    bool = (!data.result.length || data.valid);
    let valid = data.valid.toString();
    let color = 'gray';
    if (!data.result.length) {
        valid = 'none';
    }
    else {
        color = data.valid ? 'green' : 'red';
    }
    table.push([
        chalk.blue(data.name),
        chalk[color](valid),
    ]);
}
debug_color2_1.console.log(table.toString());
if (bool === false) {
    process.exit(1);
}
//# sourceMappingURL=check-pkg-bin.js.map