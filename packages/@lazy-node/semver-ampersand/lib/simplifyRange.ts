import SemVer from 'semver/classes/semver';
import { Options } from 'semver';
import semverSimplifyRange from 'semver/ranges/simplify';
import { handleAmpersandAndSpaces } from './handleAmpersandAndSpaces';

/**
 * 在給定版本清單中簡化範圍
 * Simplify a range against a given list of versions
 *
 * 先把 `&` 轉成空白再交給 semver，讓簡化結果與原生 semver 一致；
 * 因為未傳選項，`noAmpersand` 在此路徑不生效。
 * `&` is converted to a space before delegating to semver so the simplified
 * result matches native semver; since options are not forwarded, `noAmpersand`
 * has no effect on this path.
 *
 * @param ranges - 可用的版本清單 / Available version list
 * @param range - 要簡化的範圍字串 / Range string to simplify
 * @param options - semver 選項 / semver options
 * @returns 簡化後的範圍字串 / Simplified range string
 */
export function simplifyRange<T extends string | SemVer>(ranges: string[], range: T, options?: Options,
)
{
	return semverSimplifyRange(ranges, handleAmpersandAndSpaces(range) as any, options) as T
}

export default simplifyRange
