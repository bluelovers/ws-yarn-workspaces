"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupYarnAddTypesToYargs = void 0;
const setupYarnAddToYargs_1 = require("./setupYarnAddToYargs");
function setupYarnAddTypesToYargs(yargs) {
    return setupYarnAddToYargs_1.setupYarnAddToYargs(yargs, {
        allowEmptyName: true,
    })
        .option('auto', {
        desc: `auto install from package.json`,
        boolean: true,
    })
        .option('all', {
        desc: `dependencies, devDependencies from package.json`,
        boolean: true,
    })
        .option('AA', {
        desc: `--auto --all`,
        boolean: true,
    })
        .strict(false);
}
exports.setupYarnAddTypesToYargs = setupYarnAddTypesToYargs;
//# sourceMappingURL=setupYarnAddTypesToYargs.js.map