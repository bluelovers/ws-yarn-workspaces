"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printReport = exports.updateYarnLockTag = void 0;
/**
 * 套件進入點 (Entrypoint)：彙整並重新導出 lockfile 更新與報告列印相關的 API。
 *
 * Package entry point: aggregates and re-exports the lockfile updating and
 * report printing APIs.
 */
const updateYarnLockTag_1 = require("./lib/updateYarnLockTag");
Object.defineProperty(exports, "updateYarnLockTag", { enumerable: true, get: function () { return updateYarnLockTag_1.updateYarnLockTag; } });
const printReport_1 = require("./lib/printReport");
Object.defineProperty(exports, "printReport", { enumerable: true, get: function () { return printReport_1.printReport; } });
/**
 * 預設導出 (Default export) 指向 updateYarnLockTag，
 * 讓 `import updateYarnLockTag from '@yarn-tool/yarnlock-ncu'` 成為最短的使用方式。
 *
 * The default export points to updateYarnLockTag so the shortest import form
 * remains the primary usage.
 */
exports.default = updateYarnLockTag_1.updateYarnLockTag;
//# sourceMappingURL=index.js.map