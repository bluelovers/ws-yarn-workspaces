#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_setting_1 = (0, tslib_1.__importDefault)(require("../lib/yargs-setting"));
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const git_tag_1 = (0, tslib_1.__importDefault)(require("../lib/git-tag"));
let argv = (0, yargs_setting_1.default)(yargs_1.default)
    .option('cwd', {
    default: process.cwd(),
    normalize: true,
})
    .showHelpOnFail(true)
    .version()
    .help()
    .argv;
(0, git_tag_1.default)({
    cwd: argv.cwd,
    tagPrefix: argv['tag-prefix'],
    excludeName: argv['exclude-name'],
    message: argv.message,
    forceGitTag: argv['force-git-tag'],
    signGitTag: argv['sign-git-tag'],
}, {
    stdio: 'inherit',
})
    .then(result => {
    process.exit(result.exitCode);
});
//# sourceMappingURL=yt-tag.js.map