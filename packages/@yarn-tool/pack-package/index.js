"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackedTarballInfo = exports.printPackedTarballInfo = exports.packTargetPackage = void 0;
exports.packPackage = packPackage;
const pack_1 = require("./lib/pack");
const info_1 = require("./lib/info");
const print_1 = require("./lib/print");
var pack_2 = require("./lib/pack");
Object.defineProperty(exports, "packTargetPackage", { enumerable: true, get: function () { return pack_2.packTargetPackage; } });
var print_2 = require("./lib/print");
Object.defineProperty(exports, "printPackedTarballInfo", { enumerable: true, get: function () { return print_2.printPackedTarballInfo; } });
var info_2 = require("./lib/info");
Object.defineProperty(exports, "getPackedTarballInfo", { enumerable: true, get: function () { return info_2.getPackedTarballInfo; } });
/**
 * 打包套件並回傳可延遲取得 tarball 資訊的凍結物件。
 *
 * tarball() 與 log() 以閉包快取 (Cache) tarball 資訊：
 * 多次呼叫只會讀取/解析一次 tar 檔（Why：解析成本不低且結果不可變）。
 * 使用 Object.freeze 防止呼叫者改寫凍結後的結果。
 *
 * Pack a package and return a frozen object with lazily obtainable tarball
 * info. tarball()/log() cache the info via closure so the tarball is read and
 * parsed at most once (Why: parsing is not cheap and the result is immutable).
 * Object.freeze prevents callers from mutating the result.
 *
 * @param options 打包選項 / packing options
 */
function packPackage(options) {
    return (0, pack_1.packTargetPackage)(options)
        .then(async (data) => {
        // tarball 資訊保存於此變數作為快取；
        // 以 ?? 運算子確保「首次取得」與「回傳快取」只發生一次。
        // Tarball info is kept here as the cache; the ?? operator ensures
        // "fetch on first use" and "return cached value" happen exactly once.
        let tarball;
        const object = Object.freeze({
            ...data,
            async tarball() {
                return tarball !== null && tarball !== void 0 ? tarball : (tarball = await (0, info_1.getPackedTarballInfo)(data));
            },
            // log 依賴 tarball()，因此同樣吃到快取，
            // 重複呼叫 log() 不會重複解析 tar 檔。
            // log() goes through tarball(), so repeated log() calls reuse
            // the cache instead of re-parsing the tarball.
            async log() {
                return (0, print_1.printPackedTarballInfo)(await object.tarball());
            },
        });
        return object;
    });
}
/**
 * 預設匯出主要打包入口（Why：單一主要用途的模組以預設匯出最為直覺）。
 *
 * Default-exports the main pack entry (Why: the most intuitive default for a
 * single-purpose module).
 */
exports.default = packPackage;
//# sourceMappingURL=index.js.map