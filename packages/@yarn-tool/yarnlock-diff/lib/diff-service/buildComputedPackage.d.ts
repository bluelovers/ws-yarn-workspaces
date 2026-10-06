import { IComputedPackage } from './types';
import { ITSValueOrArray } from 'ts-type/lib/type/base';
/**
 * 將一份或多份 lockfile 內容彙整成 `IComputedPackage` 對照表。
 * Aggregate one or more lockfile contents into an `IComputedPackage` map.
 *
 * @param yarnLockContentList 單一內容或陣列；非陣列會先包成陣列，讓單檔與多檔共用同一條路徑
 *                            A single content or an array; a non-array is wrapped first so that
 *                            the single-file and multi-file paths stay identical
 * @param alreadyComputedPackage 作為 `reduce` 初始值的既有對照表，用來把多份 lockfile 疊加在一起
 *                               Existing map used as the `reduce` seed, so multiple lockfiles are
 *                               merged into one instead of overwriting each other
 * @returns 套件名 → 排序去重後的版本清單 / Package name → deduplicated, sorted version list
 */
export declare function buildComputedPackage(yarnLockContentList: ITSValueOrArray<Buffer | string>, alreadyComputedPackage?: IComputedPackage): IComputedPackage;
