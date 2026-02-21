"use strict";
/**
 * @yarn-tool/ncu
 *
 * A wrapper tool for npm-check-updates that checks and updates package dependencies.
 * 提供依賴版本檢查與更新的核心功能，封裝 npm-check-updates 並擴展其能力。
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import { npmCheckUpdates } from '@yarn-tool/ncu';
 *
 * const result = await npmCheckUpdates(cache, {
 *   json_old: packageJson,
 *   upgrade: true,
 * });
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/store"), exports);
tslib_1.__exportStar(require("./lib/cli"), exports);
tslib_1.__exportStar(require("./lib/remote"), exports);
tslib_1.__exportStar(require("./lib/util"), exports);
tslib_1.__exportStar(require("./lib/options"), exports);
tslib_1.__exportStar(require("./lib/update"), exports);
exports.default = exports;
//# sourceMappingURL=index.js.map