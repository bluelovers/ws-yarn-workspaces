"use strict";
/**
 * 模組入口：彙整並再匯出 yarn-tool 共用的 CLI 表格工具。
 * 集中於此單一入口（Single Entry）再匯出，讓使用端只需引用套件名稱，
 * 不必知道內部 `lib/` 的目錄結構。
 *
 * Module entry: re-exports the shared CLI table utilities of yarn-tool.
 * Everything is gathered into this single entry so consumers only need to
 * import the package name without knowing the internal `lib/` layout.
 *
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.CliTable = void 0;
const tslib_1 = require("tslib");
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
exports.CliTable = cli_table3_1.default;
exports.Table = cli_table3_1.default;
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/deps-table"), exports);
tslib_1.__exportStar(require("./lib/core"), exports);
tslib_1.__exportStar(require("./lib/style"), exports);
/**
 * 預設匯出即為 `cli-table3` 建構子，讓 `import Table from '@yarn-tool/table'`
 * 的用法與直接使用 `cli-table3` 一致。
 *
 * The default export is the `cli-table3` constructor, so
 * `import Table from '@yarn-tool/table'` behaves the same as using
 * `cli-table3` directly.
 */
exports.default = cli_table3_1.default;
//# sourceMappingURL=index.js.map