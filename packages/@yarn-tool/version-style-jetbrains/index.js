"use strict";
/**
 * 基於日期的版本編號生成器
 * Date-based version style generator
 *
 * @see https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/version-style-jetbrains
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._getDateInfoFromOptions = exports._handleVersionStyleOptions = exports.getJetbrainsYearCode = exports.getQuarterFromMonth = exports.generateAllStyleVersions = exports.getNextVersion = exports.isTodayVersion = exports.incrementVersion = exports.getNextDayVersion = exports.dateToVersionByStyle = exports.dateToVersion = exports.parseVersion = exports.EnumVersionStyle = void 0;
const tslib_1 = require("tslib");
// 重新導出所有 lib 模組
tslib_1.__exportStar(require("./lib"), exports);
// 重新導出以方便使用
var lib_1 = require("./lib");
Object.defineProperty(exports, "EnumVersionStyle", { enumerable: true, get: function () { return lib_1.EnumVersionStyle; } });
Object.defineProperty(exports, "parseVersion", { enumerable: true, get: function () { return lib_1.parseVersion; } });
Object.defineProperty(exports, "dateToVersion", { enumerable: true, get: function () { return lib_1.dateToVersion; } });
Object.defineProperty(exports, "dateToVersionByStyle", { enumerable: true, get: function () { return lib_1.dateToVersionByStyle; } });
Object.defineProperty(exports, "getNextDayVersion", { enumerable: true, get: function () { return lib_1.getNextDayVersion; } });
Object.defineProperty(exports, "incrementVersion", { enumerable: true, get: function () { return lib_1.incrementVersion; } });
Object.defineProperty(exports, "isTodayVersion", { enumerable: true, get: function () { return lib_1.isTodayVersion; } });
Object.defineProperty(exports, "getNextVersion", { enumerable: true, get: function () { return lib_1.getNextVersion; } });
Object.defineProperty(exports, "generateAllStyleVersions", { enumerable: true, get: function () { return lib_1.generateAllStyleVersions; } });
// 新增的輔助函數
Object.defineProperty(exports, "getQuarterFromMonth", { enumerable: true, get: function () { return lib_1.getQuarterFromMonth; } });
Object.defineProperty(exports, "getJetbrainsYearCode", { enumerable: true, get: function () { return lib_1.getJetbrainsYearCode; } });
Object.defineProperty(exports, "_handleVersionStyleOptions", { enumerable: true, get: function () { return lib_1._handleVersionStyleOptions; } });
Object.defineProperty(exports, "_getDateInfoFromOptions", { enumerable: true, get: function () { return lib_1._getDateInfoFromOptions; } });
//# sourceMappingURL=index.js.map