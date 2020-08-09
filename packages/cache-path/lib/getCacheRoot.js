"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheRootAsync = exports.getCacheRoot = void 0;
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const bluebird_1 = __importDefault(require("bluebird"));
const index_1 = require("@lazy-node/is-writeable-path/index");
const util_1 = require("./util");
function getCacheRoot(_options) {
    let options = util_1.handleOptions(_options);
    let { processEnv, cwd } = options;
    let dir;
    options.fnOrder.some(function (fn) {
        // @ts-ignore
        dir = fn(cwd, processEnv);
        if (dir === null || dir === void 0 ? void 0 : dir.length) {
            if (util_1._createAble(options, fn)) {
                try {
                    fs_extra_1.ensureDirSync(dir);
                }
                catch (err) { }
            }
            return index_1.isWritableDirectorySync(dir);
        }
    });
    util_1._check(dir, options);
    return upath2_1.resolve(dir);
}
exports.getCacheRoot = getCacheRoot;
function getCacheRootAsync(options) {
    return bluebird_1.default.resolve(util_1.handleOptions(options))
        .then(async function (options) {
        let { processEnv, cwd } = options;
        let dir;
        for (let fn of options.fnOrder) {
            // @ts-ignore
            dir = await fn(cwd, processEnv);
            if (dir === null || dir === void 0 ? void 0 : dir.length) {
                if (util_1._createAble(options, fn)) {
                    try {
                        await fs_extra_1.ensureDir(dir);
                    }
                    catch (err) { }
                }
                if (await index_1.isWritableDirectoryAsync(dir)) {
                    break;
                }
            }
        }
        util_1._check(dir, options);
        return upath2_1.resolve(dir);
    });
}
exports.getCacheRootAsync = getCacheRootAsync;
//# sourceMappingURL=getCacheRoot.js.map