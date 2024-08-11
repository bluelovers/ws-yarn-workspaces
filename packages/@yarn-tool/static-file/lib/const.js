"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCopyStaticFilesWsRootOnly = exports.defaultCopyStaticFilesRootOnly = exports.defaultCopyStaticFiles = void 0;
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
    ['.nycrc.tpl', 'file/nycrc'],
    ['.mocharc.yml.tpl', 'file/mocharc.yml'],
    //['jest.config.js', 'file/jest.config.js'],
    ['jest.config.js', 'file/jest.config.auto.js'],
    ['.nowignore', 'file/nowignore'],
    ['now.json.tpl', 'file/now.json.tpl', 'now.json'],
    ['.npmrc.tpl', 'file/npmrc', '.npmrc'],
    ['tsdx.config.js.tpl', 'file/tsdx.config.js', 'tsdx.config.js'],
    ['tsc-multi.json.tpl', 'file/tsc-multi.json.tpl', 'tsc-multi.json'],
    ['test/__root.ts', 'file/test/__root.ts'],
    ['test/fixtures/.gitkeep', 'file/test/fixtures/.gitkeep'],
    ...([
        'temp.ts',
    ].map(file => [
        `test/${file}`,
        `file/test/${file}`
    ])),
    //['changelog-option.js.tpl', 'file/changelog-option.js', 'changelog-option.js'],
];
const _defaultCopyStaticFilesRootOnly = [
    ['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
    ['pnpm-workspace.yaml.tpl', 'file/pnpm-workspace.yaml', 'pnpm-workspace.yaml'],
    ['.github/workflows/coverage.yml', 'file/github/workflows/coverage.yml'],
    ['.github/workflows/action-yarnlock-dedupe.yml', 'file/github/workflows/action-yarnlock-dedupe.yml'],
    ['.github/workflows/build.yml', 'file/github/workflows/build.yml'],
    ['.github/workflows/yarn-lock-changes.yml', 'file/github/workflows/yarn-lock-changes.yml'],
    ['.github/commit-convention.md', 'file/github/commit-convention.md'],
    ...([
        'dependabot.yml',
        'workflows/codeql-analysis.yml',
        'workflows/cmd-rebase.yml',
    ].map(file => [`.github/${file}`, `file/github/${file}`])),
    ['.node-version', 'file/node-version'],
    ['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json'],
    ['.eslintrc.json', 'file/eslintrc.json.tpl', '.eslintrc.json'],
    //['changelog-option.js', 'file/changelog-option.js', 'changelog-option.js.tpl'],
    ['.yarnrc.yml.tpl', 'file/root/yarnrc.yml', '.yarnrc.yml'],
    ['jest.config.js', 'file/jest.config.js'],
    ['jest.config.js.tpl', 'file/jest.config.js'],
    ['jest.config.auto.js.tpl', 'file/jest.config.auto.js'],
    ['.editorconfig.tpl', 'file/tpl.editorconfig'],
    ['.editorconfig', 'file/tpl.editorconfig'],
    ['global.tsdx.d.ts', 'file/root/global.tsdx.d.ts'],
];
const _defaultCopyStaticFilesWsRootOnly = [
    ['lerna.json.tpl', 'file/lerna.json.tpl'],
    ['pnpm-workspace.yaml', 'file/pnpm-workspace.yaml'],
    ['tsconfig.json', 'file/tsconfig.json.tpl'],
    ['tsc-multi.json.tpl', 'file/tsc-multi.json.tpl', 'tsc-multi.json'],
    ['__root_ws.ts', 'file/ws-root/__root_ws.ts'],
    ['jest.config.js', 'file/ws-root/jest.config.js'],
    ['jest-preset.js', 'file/ws-root/jest-preset.js'],
    ['.run/lerna_publish_yes.run.xml', 'file/ws-root/.run/lerna_publish_yes.run.xml'],
];
exports.defaultCopyStaticFiles = Object.freeze(_defaultCopyStaticFiles);
exports.defaultCopyStaticFilesRootOnly = Object.freeze(_defaultCopyStaticFilesRootOnly);
exports.defaultCopyStaticFilesWsRootOnly = Object.freeze(_defaultCopyStaticFilesWsRootOnly);
//# sourceMappingURL=const.js.map