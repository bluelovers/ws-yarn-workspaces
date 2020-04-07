"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherScriptNames = exports.defaultNpmScriptsOrder = exports.omitKey = void 0;
/**
 * omit key logic
 */
function omitKey(name) {
    const key = name
        .replace(/^[_:\-]+/, '')
        .split(/[_:\-]+/)[0]
        .replace(/\d+$/, '');
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
    'npm',
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