"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyYarnLockRawV1 = exports.parseYarnLockRawV1 = exports.stringifyYarnLockRawV2 = exports.parseYarnLockRawV2 = void 0;
/**
 * 依格式版本分組匯出解析 (parse) 與寫回 (stringify) API。
 * Re-export parse / stringify APIs grouped by lockfile format version.
 *
 * @remarks
 * v1 與 v2 的原始結構差異大，因此刻意分開成兩組函式、不做統一封裝，
 * 讓呼叫端依偵測結果自行選擇對應的處理路徑。
 * The v1 and v2 raw structures differ greatly, so the two groups are kept
 * separate without a wrapper; callers pick the right path by detection.
 */
var v2_1 = require("./lib/v2");
Object.defineProperty(exports, "parseYarnLockRawV2", { enumerable: true, get: function () { return v2_1.parseYarnLockRawV2; } });
Object.defineProperty(exports, "stringifyYarnLockRawV2", { enumerable: true, get: function () { return v2_1.stringifyYarnLockRawV2; } });
var v1_1 = require("./lib/v1");
Object.defineProperty(exports, "parseYarnLockRawV1", { enumerable: true, get: function () { return v1_1.parseYarnLockRawV1; } });
Object.defineProperty(exports, "stringifyYarnLockRawV1", { enumerable: true, get: function () { return v1_1.stringifyYarnLockRawV1; } });
//# sourceMappingURL=index.js.map