"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = setupToYargs;
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
    return _return;
}
//# sourceMappingURL=yargs-setting.js.map