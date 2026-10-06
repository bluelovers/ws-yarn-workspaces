"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiff = buildDiff;
const deep_diff_1 = require("@bluelovers/deep-diff");
const buildComputedPackage_1 = require("./diff-service/buildComputedPackage");
/**
 * 把新舊 lockfile 各自轉成「套件名 → 版本清單」的對照表後做深層比對。
 * Turn the old and new lockfiles into a "package name → version list" map, then deep-compare them.
 *
 * `?? []` 不是多餘的：`deep-diff` 在兩側完全相同時回傳 `undefined`，
 * 直接交給下游的 `.map()` 會拋出 `Cannot read properties of undefined`。
 * The `?? []` is not redundant: `deep-diff` returns `undefined` when both sides are identical,
 * and handing that to the downstream `.map()` would throw
 * `Cannot read properties of undefined`.
 *
 * @param oldYarnLockContent 舊的 lockfile 內容，可為多份 / Old lockfile content, possibly multiple files
 * @param newYarnLockContent 新的 lockfile 內容，可為多份 / New lockfile content, possibly multiple files
 * @returns 差異節點陣列；無差異時為空陣列 / Array of diff nodes, empty when there is no diff
 */
function buildDiff(oldYarnLockContent, newYarnLockContent) {
    var _a;
    const oldPacakges = (0, buildComputedPackage_1.buildComputedPackage)(oldYarnLockContent);
    const newPackages = (0, buildComputedPackage_1.buildComputedPackage)(newYarnLockContent);
    return (_a = (0, deep_diff_1.diff)(oldPacakges, newPackages)) !== null && _a !== void 0 ? _a : [];
}
//# sourceMappingURL=diff-service.js.map