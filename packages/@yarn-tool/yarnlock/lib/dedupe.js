"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dedupe = void 0;
const tslib_1 = require("tslib");
/**
 * yarn.lock 去重 (Dedupe) 的轉出口：實作位於相依套件 @yarn-tool/yarnlock-dedupe/object，
 * 此處僅 re-export，讓使用端從單一入口取得去重能力（SSoT）。
 *
 * yarn.lock dedupe re-exports: implementation lives in @yarn-tool/yarnlock-dedupe/object;
 * re-exported here so consumers get dedupe capability from one entry (SSoT).
 */
const object_1 = require("@yarn-tool/yarnlock-dedupe/object");
Object.defineProperty(exports, "Dedupe", { enumerable: true, get: function () { return object_1.yarnDedupe; } });
tslib_1.__exportStar(require("@yarn-tool/yarnlock-dedupe/object"), exports);
/**
 * 預設匯出直接給 yarnDedupe，讓 `import dedupe from` 的用法與工具函式慣用法一致。
 *
 * Default-exports yarnDedupe so `import dedupe from` matches the usual utility convention.
 */
exports.default = object_1.yarnDedupe;
//# sourceMappingURL=dedupe.js.map