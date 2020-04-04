"use strict";
/**
 * Created by user on 2019/5/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWorkspacesInitToYargs = void 0;
function setupWorkspacesInitToYargs(yargs) {
    return yargs
        .default({
    //input: process.cwd(),
    })
        .option('name', {
        alias: ['n'],
        requiresArg: true,
        normalize: true,
        type: 'string',
    })
        .option('ignoreExistsPackage', {
        boolean: true,
        alias: ['i'],
    })
        .option('ignoreParentWorkspaces', {
        boolean: true,
    })
        .option('debug', {
        boolean: true,
    });
}
exports.setupWorkspacesInitToYargs = setupWorkspacesInitToYargs;
exports.default = setupWorkspacesInitToYargs;
//# sourceMappingURL=yargs-setting.js.map