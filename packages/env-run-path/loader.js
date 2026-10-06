"use strict";
/**
 * Created by user on 2019/12/25.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEnv = void 0;
const index_1 = require("./index");
/**
 * 以 overwrite 寫回 process.env 並附加 execPath：
 * loader 是被 `node -r` 或 `import 'env-run-path/loader'` 直接載入的副作用入口，
 * 因此刻意直接修改共用的 process.env，讓後續行程皆能取得合併後的 PATH。
 *
 * Writes back to process.env with overwrite and appends execPath:
 * the loader is a side-effect entry loaded via `node -r` or `import 'env-run-path/loader'`,
 * so it deliberately mutates the shared process.env so later steps see the merged PATH.
 */
exports.processEnv = (0, index_1.processRunPathEnv)({
    overwrite: true,
    appendExecPath: true,
});
exports.default = exports.processEnv;
//# sourceMappingURL=loader.js.map