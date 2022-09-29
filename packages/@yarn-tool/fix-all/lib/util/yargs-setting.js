"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = void 0;
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
    });
    return _return;
}
exports.setupToYargs = setupToYargs;
//# sourceMappingURL=yargs-setting.js.map