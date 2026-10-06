"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV2 = exports.parseYarnLockRowV1 = void 0;
const tslib_1 = require("tslib");
/**
 * 匯出統一的列解析結果型別（`IParseNameAndVersionWithNpaResult`），
 * 讓 v1 / v2 解析器共用同一組回傳欄位。
 * Re-export the shared row-parse result type (`IParseNameAndVersionWithNpaResult`) so the
 * v1 / v2 parsers return the same set of fields.
 */
tslib_1.__exportStar(require("./lib/types"), exports);
const parseYarnLockRowV1_1 = require("./lib/v1/parseYarnLockRowV1");
Object.defineProperty(exports, "parseYarnLockRowV1", { enumerable: true, get: function () { return parseYarnLockRowV1_1.parseYarnLockRowV1; } });
const parseYarnLockRowV2_1 = require("./lib/v2/parseYarnLockRowV2");
Object.defineProperty(exports, "parseYarnLockRowV2", { enumerable: true, get: function () { return parseYarnLockRowV2_1.parseYarnLockRowV2; } });
/**
 * 預設匯出整份模組命名空間，而非單一函式：本套件沒有「唯一入口」，
 * 使用者可能任意搭配型別與兩個解析器，因此預設值要保留完整匯出面。
 * The default export is the whole module namespace rather than a single function: this package
 * has no single entry point, and users may mix the types with either parser, so the default
 * must preserve the full export surface.
 */
exports.default = exports;
//# sourceMappingURL=index.js.map