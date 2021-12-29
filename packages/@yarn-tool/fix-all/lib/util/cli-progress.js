"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgressEstimator = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
// @ts-ignore
const progress_estimator_1 = tslib_1.__importDefault(require("progress-estimator"));
const findPkgModuleCachePath_1 = require("cache-path/lib/finder/findPkgModuleCachePath");
function createProgressEstimator(root) {
    const storagePath = (0, path_1.join)((0, findPkgModuleCachePath_1.findPkgModuleCachePathCore)(root), '.progress-estimator');
    (0, fs_extra_1.ensureDirSync)(storagePath);
    return (0, progress_estimator_1.default)({
        // All configuration keys are optional, but it's recommended to specify a storage location.
        storagePath,
    });
}
exports.createProgressEstimator = createProgressEstimator;
//# sourceMappingURL=cli-progress.js.map