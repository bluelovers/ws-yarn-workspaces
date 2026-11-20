"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = setupToYargs;
/**
 * 註冊與 `yarn version` 相容的命令列選項
 *
 * 選項命名刻意沿用 yarn classic，讓既有腳本不需修改即可改用本套件。
 *
 * @see https://classic.yarnpkg.com/lang/en/docs/cli/version/
 * @param yargs - yargs 實例
 * @returns 註冊選項後的 yargs
 */
function setupToYargs(yargs) {
    const _return = yargs
        /**
         * 三個與 git/互動相關的開關預設關閉程式化操作：
         * 預設 no-git-tag-version 為 true，避免自動流程擅自建立 tag
         */
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
        /**
         * 七種 ReleaseType 旗標對應 INextVersionRecommendedOptions 的同名布林欄位；
         * 同時指定多個時依 releaseTypes 順序決定優先順序
         */
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
        /**
         * --bump 為字串形式的明確指定，優先於上述旗標；
         * --preid 與 --default-preid 分別對應 detectPreidByVersion 使用的
         * 明確 preid 與純數字預發行時的預設 preid
         */
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
    })
        /**
         * --version-style 對應 INextVersionRecommendedOptions.versionStyle：
         * 指定後新版本改由 @yarn-tool/version-style-jetbrains 產生，
         * 此時只看 --version-style 與 --reset-daily-increment，
         * 不套用 --preid / --default-preid 等 semver 遞增規則
         */
        .option('version-style', {
        desc: 'use @yarn-tool/version-style-jetbrains style for the new version',
        string: true,
    })
        /**
         * 風格模式下把當日遞增號重設為 1（預設為沿用舊版本遞增）
         */
        .option('reset-daily-increment', {
        desc: 'reset daily increment to 1 when version style is enabled',
        boolean: true,
    });
    return _return;
}
//# sourceMappingURL=argv.js.map