"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.satisfies = satisfies;
const tslib_1 = require("tslib");
const satisfies_1 = tslib_1.__importDefault(require("semver/functions/satisfies"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
/**
 * 檢查版本是否符合範圍
 * Check whether a version satisfies a range
 *
 * 先把 `&` 轉成空白（「且」語意）再交給原生 semver，因此 `>=1.0.0 & <2.0.0`
 * 與 `>=1.0.0 <2.0.0` 等價；此處未轉傳選項給 handleAmpersandAndSpaces，
 * 所以 `noAmpersand` 不生效，只有 loose / includePrerelease 會送到 semver。
 * `&` is converted to a space ("AND") before delegating to native semver, so
 * `>=1.0.0 & <2.0.0` equals `>=1.0.0 <2.0.0`; options are not forwarded to
 * handleAmpersandAndSpaces, so `noAmpersand` is ignored here while loose /
 * includePrerelease still reach semver.
 *
 * @param version - 要檢查的版本 / Version to check
 * @param range - 範圍字串（支援 `&`）/ Range string (`&` supported)
 * @param optionsOrLoose - 選項或寬鬆旗標 / Options or loose flag
 * @returns 是否符合 / Whether it satisfies the range
 */
function satisfies(version, range, optionsOrLoose) {
    return (0, satisfies_1.default)(version, (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), optionsOrLoose);
}
exports.default = satisfies;
//# sourceMappingURL=satisfies.js.map