"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._diffArray = exports.yarnLockDiff = void 0;
/**
 * yarn.lock 差異比較 (Diff) 的轉出口：實作位於相依套件 @yarn-tool/yarnlock-diff，
 * 此處僅 re-export，讓使用端從單一入口取得 diff 能力（SSoT）。
 *
 * yarn.lock diff re-exports: implementation lives in @yarn-tool/yarnlock-diff;
 * re-exported here so consumers get diff capability from one entry (SSoT).
 */
const yarnlock_diff_1 = require("@yarn-tool/yarnlock-diff");
Object.defineProperty(exports, "yarnLockDiff", { enumerable: true, get: function () { return yarnlock_diff_1.yarnLockDiff; } });
const diffArray002_1 = require("@yarn-tool/yarnlock-diff/lib/formatter/diffArray002");
Object.defineProperty(exports, "_diffArray", { enumerable: true, get: function () { return diffArray002_1._diffArray; } });
/**
 * 預設匯出直接給 yarnLockDiff，讓 `import diff from` 的用法與工具函式慣用法一致。
 *
 * Default-exports yarnLockDiff so `import diff from` matches the usual utility convention.
 */
exports.default = yarnlock_diff_1.yarnLockDiff;
//# sourceMappingURL=diff.js.map