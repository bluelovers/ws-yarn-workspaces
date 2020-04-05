"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherNpmScriptsOrder = exports.defaultNpmScriptsOrder = exports.omitKey = void 0;
function omitKey(name) {
    const key = name
        .replace(/^[_:\-]+/, '')
        .split(/[_:\-]+/)[0]
        .replace(/\d+$/, '');
    const omitted = key
        .replace(/^(?:pre|post)/, '');
    return {
        name,
        key,
        omitted,
    };
}
exports.omitKey = omitKey;
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
exports.otherNpmScriptsOrder = new Set([
    'prettier',
]);
//# sourceMappingURL=util.js.map