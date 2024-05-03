"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherScriptNames = exports.defaultNpmScriptsOrder = void 0;
exports.trimKey = trimKey;
exports.firstPartKey = firstPartKey;
exports.omitKey = omitKey;
function trimKey(name, skipNumber) {
    return name
        .replace(/^[_:\-]+/, '')
        .replace(skipNumber ? /[_:\-]+$/ : /[\d_:\-]+$/, '');
}
function firstPartKey(name) {
    let key = trimKey(name);
    let first = key.split(/[_:\-]+/)[0];
    if (first === '') {
        key = trimKey(name, true);
        first = key.split(/[_:\-]+/)[0];
    }
    return first;
}
/**
 * omit key logic
 */
function omitKey(name) {
    const key = firstPartKey(name);
    const omitted = key
        .replace(/^(?:pre|post)/, '');
    return {
        /**
         * input name
         */
        name,
        /**
         * omit name and only keep first part
         */
        key,
        /**
         * omit key with pre / post
         */
        omitted,
    };
}
/**
 * group / sore scripts order, by default is follow npm lifecycle scripts
 */
exports.defaultNpmScriptsOrder = new Set([
    'serve',
    'start',
    'dev',
    'restart',
    'stop',
    'review',
    'coverage',
    'lint',
    'test',
    'preinstallOnly',
    'install',
    'postinstallOnly',
    'preuninstallOnly',
    'uninstall',
    'postuninstallOnly',
    'build',
    'storybook',
    //'build-storybook',
    'analyze',
    'link',
    'ci',
    'npm',
    'yarn',
    'lerna',
    'ws',
    'version',
    'major',
    'minor',
    'patch',
    'prerelease',
    'prepareOnly',
    'prepublish',
    'prepare',
    'prepublishOnly',
    'prepack',
    'pack',
    'postpack',
    'publish',
    'postpublish',
    // yarn-tool
    'postpublishOnly',
    'shrinkwrap',
    'dependencies',
]);
/**
 * avoid omitKey wrong parse script name (e.g. prettier
 */
exports.otherScriptNames = new Set([
    'prettier',
]);
//# sourceMappingURL=util.js.map