"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = setupToYargs;
/**
 * @see https://classic.yarnpkg.com/lang/en/docs/cli/version/
 */
function setupToYargs(yargs) {
    const _return = yargs
        .option('no-git-tag-version', {
        desc: 'no git tag version',
        boolean: true,
        default: true,
    })
        .option('no-commit-hooks', {
        desc: 'Bypasses running commit hooks when committing the new version.',
        boolean: true,
    })
        .option('new-version', {
        desc: 'new version',
        string: true,
    })
        .option('major', {
        desc: 'auto-increment major version number',
        boolean: true,
    })
        .option('minor', {
        desc: 'auto-increment minor version number',
        boolean: true,
    })
        .option('patch', {
        desc: 'auto-increment patch version number',
        boolean: true,
    })
        .option('premajor', {
        desc: 'auto-increment premajor version number',
        boolean: true,
    })
        .option('preminor', {
        desc: 'auto-increment preminor version number',
        boolean: true,
    })
        .option('prepatch', {
        desc: 'auto-increment prepatch version number',
        boolean: true,
    })
        .option('prerelease', {
        desc: 'auto-increment prerelease version number',
        boolean: true,
    })
        .option('non-interactive', {
        alias: ['no-interactive'],
        desc: 'do not show interactive prompts',
        boolean: true,
    })
        .option('bump', {
        desc: 'bump version of packages',
        string: true,
    })
        .option('preid', {
        desc: 'Adds an identifier specified by <pre-identifier> to be used to prefix premajor, preminor, prepatch or prerelease version increments.',
        string: true,
    })
        .option('default-preid', {
        desc: 'Adds an identifier specified by <pre-identifier> to be used to prefix premajor, preminor, prepatch or prerelease version increments.',
        string: true,
    });
    return _return;
}
//# sourceMappingURL=argv.js.map