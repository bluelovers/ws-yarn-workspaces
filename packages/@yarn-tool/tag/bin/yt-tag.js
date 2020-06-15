#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_setting_1 = __importDefault(require("../lib/yargs-setting"));
const yargs_1 = __importDefault(require("yargs"));
const git_tag_1 = __importDefault(require("../lib/git-tag"));
let argv = yargs_setting_1.default(yargs_1.default)
    .option('cwd', {
    default: process.cwd(),
    normalize: true,
})
    .showHelpOnFail(true)
    .version()
    .help()
    .argv;
git_tag_1.default({
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
});
//# sourceMappingURL=yt-tag.js.map