"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherScriptNames = exports.defaultNpmScriptsOrder = void 0;
exports.trimKey = trimKey;
exports.firstPartKey = firstPartKey;
exports.omitKey = omitKey;
/**
 * 去除字串開頭的底線、冒號、橫線
 * Remove leading underscores, colons, and hyphens from string
 *
 * @param name - 要處理的腳本名稱
 * @param skipNumber - 是否跳過數字處理
 * @returns 處理後的字串
 *
 * @example
 * trimKey('_test')     // 'test'
 * trimKey(':build')    // 'build'
 * trimKey('--test-1')  // 'test'
 */
function trimKey(name, skipNumber) {
    return name
        .replace(/^[_:\-]+/, '')
        .replace(skipNumber ? /[_:\-]+$/ : /[\d_:\-]+$/, '');
}
/**
 * 取得腳本名稱的第一部分（第一個區段）
 * Extract the first segment (first part) of a script name
 *
 * 將腳本名稱依據底線、冒號、橫線進行分割，取第一個區段作為主要 key。
 * 例如 'pretest:watch' 会返回 'test'，'build:esm' 会返回 'build'。
 *
 * @param name - 要處理的腳本名稱
 * @returns 第一個區段
 *
 * @example
 * firstPartKey('pretest')      // 'test'
 * firstPartKey('build:esm')    // 'build'
 * firstPartKey('postpublish')  // 'publish'
 */
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
    'pnpm',
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