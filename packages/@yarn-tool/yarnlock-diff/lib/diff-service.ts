import { diff } from "@bluelovers/deep-diff";
import { buildComputedPackage } from './diff-service/buildComputedPackage';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

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
export function buildDiff(
	oldYarnLockContent: ITSValueOrArray<Buffer | string>,
	newYarnLockContent: ITSValueOrArray<Buffer | string>,
)
{
	const oldPacakges = buildComputedPackage(oldYarnLockContent);

	const newPackages = buildComputedPackage(newYarnLockContent);

	return diff(oldPacakges, newPackages) ?? [];
}
