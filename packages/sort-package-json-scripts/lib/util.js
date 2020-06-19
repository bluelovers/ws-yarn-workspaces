"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherScriptNames = exports.defaultNpmScriptsOrder = exports.omitKey = exports.firstPartKey = exports.trimKey = void 0;
function trimKey(name, skipNumber) {
    return name
        .replace(/^[_:\-]+/, '')
        .replace(skipNumber ? /[_:\-]+$/ : /[\d_:\-]+$/, '');
}
exports.trimKey = trimKey;
function firstPartKey(name) {
    let key = trimKey(name);
    let first = key.split(/[_:\-]+/)[0];
    if (first === '') {
        key = trimKey(name, true);
        first = key.split(/[_:\-]+/)[0];
    }
    return first;
}
exports.firstPartKey = firstPartKey;
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
exports.omitKey = omitKey;
/**
 * group / sore scripts order, by default is follow npm lifecycle scripts
 */
exports.defaultNpmScriptsOrder = new Set([
    'start',
    'dev',
    'restart',
    'stop',
    'coverage',
    'lint',
    'test',
    'install',
    'uninstall',
    'build',
    'link',
    'ci',
    'npm',
    'yarn',
    'lerna',
    'prepublish',
    'prepare',
    'prepublishOnly',
    'prepack',
    'pack',
    'postpack',
    'publish',
    'postpublish',
    'shrinkwrap',
    'version',
]);
/**
 * avoid omitKey wrong parse script name (e.g. prettier
 */
exports.otherScriptNames = new Set([
    'prettier',
]);
//# sourceMappingURL=util.js.map