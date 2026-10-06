"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pkg_1 = require("./lib/pkg");
tslib_1.__exportStar(require("./lib/core"), exports);
tslib_1.__exportStar(require("./lib/ws"), exports);
tslib_1.__exportStar(require("./lib/pkg"), exports);
/**
 * 預設匯出單一套件檢查入口，
 * 讓使用者可直接以 `import checkPkgDir from '@yarn-tool/check-pkg-bin'` 使用，
 * 與 CLI 的單套件模式行為一致（Why：降低只做單套件檢查時的匯入成本）。
 *
 * Default export of the single-package check entry, so consumers can use
 * `import checkPkgDir from '@yarn-tool/check-pkg-bin'` directly, matching the
 * CLI's single-package mode (Why: lower the import cost for the common case).
 */
exports.default = pkg_1.checkPkgDir;
//# sourceMappingURL=index.js.map