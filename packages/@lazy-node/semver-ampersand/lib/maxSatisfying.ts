import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverMaxSatisfying from 'semver/ranges/max-satisfying';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

/**
 * 找出符合範圍的最大版本
 * Find the largest version that satisfies the range
 *
 * 注意：此處呼叫 handleAmpersandAndSpaces 時不傳選項，
 * 因此 `&` 一律會被視為「且」轉成空白，noAmpersand 在此路徑不生效。
 * Note: handleAmpersandAndSpaces is called without options here, so `&` is
 * always treated as "AND" (converted to a space); `noAmpersand` has no effect
 * on this path.
 *
 * @param versions - 候選版本列表 / Candidate versions
 * @param range - 範圍字串（支援 `&`）/ Range string (`&` supported)
 * @param optionsOrLoose - 選項或寬鬆旗標 / Options or loose flag
 * @returns 最大符合版本，找不到時為 null / Largest satisfying version, or null when none
 */
export function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>,
	range: string | Range,
	optionsOrLoose?: boolean | Options,
): T
{
	return semverMaxSatisfying(versions, handleAmpersandAndSpaces(range) as any, optionsOrLoose)
}

export default maxSatisfying
