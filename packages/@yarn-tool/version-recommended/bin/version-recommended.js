#!/usr/bin/env node
"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * version-recommended CLI 入口點
 *
 * 讀取 package.json 的版本並計算下一個版本，印出以 diff 著色的差異；
 * 預設寫回 package.json，--dry-run 只輸出不寫入，--no-color 輸出純文字
 */
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const fs_1 = require("fs");
const path_1 = require("path");
const find_root_1 = require("@yarn-tool/find-root");
const debug_color2_1 = require("debug-color2");
const semver_diff_1 = require("@yarn-tool/semver-diff");
const argv_1 = require("../lib/argv");
const __1 = require("..");
/**
 * 所有選項統一由 setupToYargs 註冊（含 --help 顯示），
 * 此處只負責解析與執行，避免兩處維護造成選項缺漏
 */
const argv = (0, argv_1.setupToYargs)(yargs_1.default)
    .option('dry-run', {
    desc: 'print the result without writing package.json',
    boolean: true,
})
    .option('no-color', {
    desc: 'disable colors',
    boolean: true,
})
    /** 失敗時顯示說明，避免使用者只看到裸錯誤訊息 */
    .showHelpOnFail(true)
    .version()
    .help()
    .parseSync();
/**
 * 與套件預設匯出同一套查找邏輯：自 cwd 向上尋找專案根目錄的 package.json，
 * 不假設 cwd 底下一定有 package.json；findRoot 另提供寫回所需的路徑
 */
const rootData = (0, find_root_1.findRoot)({ cwd: argv.cwd });
const pkgPath = (0, path_1.join)(rootData.pkg, 'package.json');
const text = (0, fs_1.readFileSync)(pkgPath, 'utf8');
/**
 * yargs 選項由 toNextVersionRecommendedOptions 一併轉交；
 * --new-version 明確指定時優先，否則依 bump / preid 推薦，
 * 指定 --version-style 時改以風格產生（bump 不影響結果）
 */
const result = (0, __1.nextVersionRecommendedByPackageFindUp)((0, argv_1.toNextVersionRecommendedOptions)(argv));
const pkg = result.pkg;
const oldVersion = String((_a = pkg.version) !== null && _a !== void 0 ? _a : '');
const newVersion = ((_b = argv['new-version']) === null || _b === void 0 ? void 0 : _b.length)
    ? argv['new-version']
    : result.newVersion;
const noColor = !!argv['no-color'];
const chalk = (0, debug_color2_1.chalkByConsoleMaybe)();
/**
 * 差異段落交給 colorizeDiff 著色（major 紅、minor 青、patch 綠）；
 * --no-color 時以 stripAnsi 取得純文字，其餘樣式於輸出前統一剝除
 */
const diff = (0, semver_diff_1.colorizeDiff)(oldVersion, newVersion, noColor ? { stripAnsi: true } : undefined);
const newVersionText = noColor ? diff : chalk.yellow(diff);
const output = [
    `${chalk.bold.reset((_c = pkg.name) !== null && _c !== void 0 ? _c : pkgPath)}`,
    `  ${chalk.red(oldVersion)} ${chalk.gray('→')} ${newVersionText}`,
    `  ${pkgPath}`,
].join('\n');
console.log(noColor ? stripAnsi(output) : output);
if (oldVersion === newVersion) {
    console.log('version is up to date, nothing to do');
    process.exit(0);
}
if (argv['dry-run']) {
    console.log('(dry run) package.json not written');
    process.exit(0);
}
/** 只替換與舊版本相符的 version 欄位，保留其餘排版與欄位順序 */
const pattern = new RegExp(`("version"\\s*:\\s*")${escapeRegExp(oldVersion)}(")`);
if (!pattern.test(text)) {
    console.error(`unable to locate "version": "${oldVersion}" in ${pkgPath}`);
    process.exit(1);
}
(0, fs_1.writeFileSync)(pkgPath, text.replace(pattern, `$1${newVersion}$2`));
console.log(`updated ${oldVersion} → ${newVersion}`);
/**
 * 剝除 ANSI 轉義序列，供 --no-color 輸出純文字
 *
 * @param text - 可能含色彩的字串
 * @returns 純文字
 */
function stripAnsi(text) {
    return text.replace(/\x1B\[[0-9;]*m/g, '');
}
/**
 * 轉義正則特殊字元，避免版本號中的 `.` 等字元被當成萬用字元
 *
 * @param text - 原始字串
 * @returns 可安全置入字面值比對的字串
 */
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=version-recommended.js.map