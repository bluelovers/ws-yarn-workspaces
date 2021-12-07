"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCopyStaticFilesRootOnly = exports.defaultCopyStaticFiles = void 0;
const _defaultCopyStaticFiles = [
    ['.npmignore', 'file/npmignore'],
    ['.gitignore', 'file/gitignore'],
    ['.eslintignore', 'file/eslintignore'],
    ['.nvmrc', 'file/nvmrc'],
    ['.browserslistrc', 'file/browserslistrc'],
    ['tsconfig.json.tpl', 'file/tsconfig.json.tpl', 'tsconfig.json'],
    ['test/tsconfig.json.tpl', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],
    ['tsconfig.esm.json.tpl', 'file/tsconfig.esm.json.tpl', 'tsconfig.esm.json'],
    ['tsconfig.tsdx.json.tpl', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.tsdx.json'],
    ['.eslintrc.json.tpl', 'file/eslintrc.json.tpl', '.eslintrc.json'],
    ['README.md', 'file/README.md'],
    ['.nycrc', 'file/nycrc'],
    ['.mocharc.yml', 'file/mocharc.yml'],
    ['jest.config.js', 'file/jest.config.js'],
    ['.nowignore', 'file/nowignore'],
    ['now.json.tpl', 'file/now.json.tpl', 'now.json'],
    ['.npmrc.tpl', 'file/npmrc', '.npmrc'],
    ['tsdx.config.js.tpl', 'file/tsdx.config.js', 'tsdx.config.js'],
    ['tsc-multi.json.tpl', 'file/tsc-multi.json.tpl', 'tsc-multi.json'],
];
const _defaultCopyStaticFilesRootOnly = [
    ['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
    ['pnpm-workspace.yaml.tpl', 'file/pnpm-workspace.yaml', 'pnpm-workspace.yaml'],
    ['.github/workflows/coverage.yml', 'file/github/workflows/coverage.yml'],
    ['.github/workflows/action-yarnlock-dedupe.yml', 'file/github/workflows/action-yarnlock-dedupe.yml'],
    ['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json'],
];
exports.defaultCopyStaticFiles = Object.freeze(_defaultCopyStaticFiles);
exports.defaultCopyStaticFilesRootOnly = Object.freeze(_defaultCopyStaticFilesRootOnly);
//# sourceMappingURL=const.js.map