'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const sortOrder = ['$schema', 'name', 'displayName', 'version', 'stableVersion', 'private', 'description', 'categories', 'keywords', 'homepage', 'bugs', 'repository', 'funding', 'license', 'licenses', 'qna', 'author', 'maintainers', 'contributors', 'publisher', 'sideEffects', 'type', 'imports', 'exports', 'main', 'svelte', 'umd:main', 'jsdelivr', 'unpkg', 'module', 'source', 'jsnext:main', 'browser', 'react-native', 'types', 'typesVersions', 'typings', 'style', 'example', 'examplestyle', 'assets', 'bin', 'man', 'directories', 'files', 'workspaces', 'binary', 'scripts', 'betterScripts', 'wireit', 'l10n', 'contributes', 'activationEvents', 'husky', 'simple-git-hooks', 'pre-commit', 'commitlint', 'lint-staged', 'nano-staged', 'config', 'nodemonConfig', 'browserify', 'babel', 'browserslist', 'xo', 'prettier', 'eslintConfig', 'eslintIgnore', 'npmpkgjsonlint', 'npmPackageJsonLintConfig', 'npmpackagejsonlint', 'release', 'remarkConfig', 'stylelint', 'ava', 'jest', 'jest-junit', 'jest-stare', 'mocha', 'nyc', 'c8', 'tap', 'tsd', 'oclif', 'resolutions', 'overrides', 'dependencies', 'devDependencies', 'dependenciesMeta', 'peerDependencies', 'peerDependenciesMeta', 'optionalDependencies', 'bundledDependencies', 'bundleDependencies', 'extensionPack', 'extensionDependencies', 'flat', 'packageManager', 'engines', 'engineStrict', 'devEngines', 'volta', 'languageName', 'os', 'cpu', 'preferGlobal', 'publishConfig', 'icon', 'badges', 'galleryBanner', 'preview', 'markdown', 'pnpm'];

/**
 * Sort order for package.json keys / package.json 鍵值排序順序
 *
 * This module exports a predefined sort order for package.json keys.
 * The order follows common conventions and best practices for package.json organization.
 *
 * 此模組匯出 package.json 鍵值的預定義排序順序。
 * 順序遵循 package.json 組織的常見慣例和最佳實踐。
 *
 * @module @yarn-tool/sort-package-json-order
 *
 * @example
 * ```typescript
 * import sortOrder from '@yarn-tool/sort-package-json-order';
 *
 * // Use with sort-object-keys2
 * import { sortObjectKeys } from 'sort-object-keys2';
 *
 * const sorted = sortObjectKeys(packageJson, { keys: sortOrder, useSource: true });
 * ```
 */

exports.default = sortOrder;
exports.sortOrder = sortOrder;
//# sourceMappingURL=index.cjs.development.cjs.map
