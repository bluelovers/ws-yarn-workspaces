"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupYarnAddTypesToYargs = setupYarnAddTypesToYargs;
const setupYarnAddToYargs_1 = require("./setupYarnAddToYargs");
function setupYarnAddTypesToYargs(yargs) {
    return (0, setupYarnAddToYargs_1.setupYarnAddToYargs)(yargs, {
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
//# sourceMappingURL=setupYarnAddTypesToYargs.js.map