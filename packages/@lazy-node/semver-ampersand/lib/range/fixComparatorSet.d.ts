import { IComparatorArrayInput, IComparatorSetInput } from '../types';
/**
 * 尋找是否存在任意版本比較器（`*`）
 * Look for an "any" comparator (`*`)
 *
 * @param comparatorsArray - 比較器陣列 / Comparator array
 * @returns 找到的比較器，否則 undefined / The comparator if found, otherwise undefined
 */
export declare function includeAny(comparatorsArray: IComparatorArrayInput): import("semver").Comparator;
/**
 * 若集合中含 `*`，整組範圍就等同於 `*`
 * If the set contains `*`, the whole range is just `*`
 *
 * if we have any that are `*`, then the range is just `*`
 *
 * unsafeOptimize 才會跨集合搜尋；預設只在「單一比較器正好是 `*`」時收斂，
 * 因為跨集合的最佳化可能覆蓋掉 `||` 另一端有意義的條件。
 * Cross-set searching only happens under unsafeOptimize; by default the set is
 * collapsed only when a lone comparator is already `*`, because cross-set
 * optimization could wipe out a meaningful condition on the other side of `||`.
 *
 * @param comparatorsSet - 比較器集合 / Comparator set
 * @param unsafeOptimize - 是否啟用不安全最佳化 / Whether unsafe optimization is enabled
 * @returns 收斂後的集合 / The collapsed set
 */
export declare function optimizeComparatorSetAny(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean): IComparatorSetInput;
/**
 * 移除 Null Set（<0.0.0-0）的集合
 * Remove sets containing a null set (<0.0.0-0)
 *
 * unsafeOptimize 時只要集合內「任一」比較器是 null set 就整組移除；
 * 否則只看第一個比較器，避免過度刪除（保留 semver 的保守行為）。
 * With unsafeOptimize a set is dropped when *any* of its comparators is a null
 * set; otherwise only the first comparator is inspected, keeping semver's
 * conservative behavior and avoiding over-deletion.
 *
 * @param comparatorsSet - 比較器集合 / Comparator set
 * @param unsafeOptimize - 是否啟用不安全最佳化 / Whether unsafe optimization is enabled
 * @returns 過濾後的集合 / Filtered set
 */
export declare function filterRemoveNullSet(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean): IComparatorArrayInput[];
/**
 * 修正並化簡整個比較器集合
 * Fix and simplify the whole comparator set
 *
 * 順序很重要：先過濾 null set（同時保留一份首元素當保險），
 * 再對剩餘集合做 `*` 收斂，最後清掉空陣列；
 * 若全部被過濾掉，會回退到第一個集合，確保至少保留一個可判斷的條件。
 * Order matters: null sets are filtered first (keeping the first element as a
 * fallback), then `*` collapsing runs on the remainder, and finally empty
 * arrays are dropped; if everything was filtered out, the original first set is
 * restored so at least one condition remains judgeable.
 *
 * @param comparatorsSet - 比較器集合 / Comparator set
 * @param unsafeOptimize - 是否啟用不安全最佳化 / Whether unsafe optimization is enabled
 * @returns 修正後的集合 / Fixed set
 */
export declare function fixComparatorSet(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean): IComparatorSetInput;
