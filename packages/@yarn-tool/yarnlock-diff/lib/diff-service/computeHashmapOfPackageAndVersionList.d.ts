import { IComputedPackage } from './types';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
/**
 * `reduce` 的疊代器：把一份已解析的 lockfile 攤平並累加到對照表上。
 * The `reduce` accumulator: flatten one parsed lockfile and merge it into the map.
 *
 * 採用 `Array.prototype.reduce` 形式（ accumulator 在前）是為了直接串在
 * `reduceYarnLockParsedEntries` 之上，不必先展開成中間陣列。
 * The reduce-style signature (accumulator first) lets it chain directly onto
 * `reduceYarnLockParsedEntries` without materializing an intermediate array.
 *
 * @param alreadyComputedPackage 已累加的對照表 / The map accumulated so far
 * @param parsedOldPackage 已解析的 v1 或 v2 lockfile / A parsed v1 or v2 lockfile
 * @returns 累加後的對照表；每一輪都會重新去重並以鬆散 semver 排序 / The accumulated map,
 *          re-deduplicated and sorted with loose semver on every pass
 */
export declare function computeHashmapOfPackageAndVersionList(alreadyComputedPackage: IComputedPackage, parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2): IComputedPackage;
