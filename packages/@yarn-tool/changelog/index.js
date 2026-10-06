"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * @yarn-tool/changelog 模組入口 (Module entry point)
 * 說明：彙整 changelog 相關的類型、更新與版本建議 API，以及 yargs 設定；
 * 預設匯出直接是 `updateChangelogByCwd`，讓 `import changelog from '@yarn-tool/changelog'`
 * 即可完成最常見的「依工作目錄更新日誌」操作。
 * Why: it gathers the changelog types, update/recommend APIs and the yargs setup;
 * the default export is `updateChangelogByCwd` itself so the most common task —
 * updating the changelog from a working directory — is a single default import.
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/lerna"), exports);
tslib_1.__exportStar(require("./lib/yargs-setting"), exports);
const lerna_1 = require("./lib/lerna");
/**
 * 預設匯出：依工作目錄更新 CHANGELOG.md 的函式
 * Default export: the function that updates CHANGELOG.md from a working directory
 */
exports.default = lerna_1.updateChangelogByCwd;
//# sourceMappingURL=index.js.map