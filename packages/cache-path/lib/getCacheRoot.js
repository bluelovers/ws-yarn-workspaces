"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheRootAsync = exports.getCacheRoot = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const is_writeable_path_1 = require("@lazy-node/is-writeable-path");
const util_1 = require("./util");
function getCacheRoot(_options) {
    let options = (0, util_1.handleOptions)(_options);
    let { processEnv, cwd } = options;
    let dir;
    options.fnOrder.some(function (fn) {
        // @ts-ignore
        dir = fn(cwd, processEnv);
        if (dir === null || dir === void 0 ? void 0 : dir.length) {
            if ((0, util_1._createAble)(options, fn)) {
                try {
                    (0, fs_extra_1.ensureDirSync)(dir);
                }
                catch (err) { }
            }
            return (0, is_writeable_path_1.isWritableDirectorySync)(dir);
        }
    });
    (0, util_1._check)(dir, options);
    return (0, upath2_1.resolve)(dir);
}
exports.getCacheRoot = getCacheRoot;
function getCacheRootAsync(options) {
    return bluebird_1.default.resolve((0, util_1.handleOptions)(options))
        .then(async function (options) {
        let { processEnv, cwd } = options;
        let dir;
        for (let fn of options.fnOrder) {
            // @ts-ignore
            dir = await fn(cwd, processEnv);
            if (dir === null || dir === void 0 ? void 0 : dir.length) {
                if ((0, util_1._createAble)(options, fn)) {
                    try {
                        await (0, fs_extra_1.ensureDir)(dir);
                    }
                    catch (err) { }
                }
                if (await (0, is_writeable_path_1.isWritableDirectoryAsync)(dir)) {
                    break;
                }
            }
        }
        (0, util_1._check)(dir, options);
        return (0, upath2_1.resolve)(dir);
    });
}
exports.getCacheRootAsync = getCacheRootAsync;
//# sourceMappingURL=getCacheRoot.js.map