"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = setupToYargs;
function setupToYargs(yargs) {
    const _return = yargs
        .option('cwd', {
        default: process.cwd(),
        normalize: true,
    })
        .option('tag-prefix', {
        alias: 't',
        string: true,
    })
        .option('exclude-name', {
        boolean: true,
    })
        .option('message', {
        alias: 'm',
        string: true,
    })
        .option('force-git-tag', {
        alias: 'f',
        boolean: true,
    })
        .option('sign-git-tag', {
        boolean: true,
    });
    return _return;
}
exports.default = setupToYargs;
//# sourceMappingURL=yargs-setting.js.map