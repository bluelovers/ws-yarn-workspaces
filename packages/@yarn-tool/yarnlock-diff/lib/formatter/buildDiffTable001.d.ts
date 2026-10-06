import { IDiffNode } from '@bluelovers/deep-diff';
import { IComputedPackage } from '../diff-service/types';
/**
 * 舊版表格渲染器：直接以 `cli-table` + `chalk` 產生三欄表格。
 * Legacy table renderer: builds a three-column table directly with `cli-table` + `chalk`.
 *
 * 已被 `./buildDiffTable002` 取代——本版本顏色硬編寫、不支援 `stripAnsi`，
 * 且使用到未列入 dependencies 的 `cli-table` / `chalk`。保留僅供比對與回溯。
 * Superseded by `./buildDiffTable002` — this version hardcodes colors, has no `stripAnsi`
 * support, and relies on `cli-table` / `chalk` which are not in dependencies. Kept only for
 * reference and backward comparison.
 *
 * @deprecated 請改用 `./buildDiffTable002` / Use `./buildDiffTable002` instead
 * @param diff `buildDiff` 產生的差異節點 / Diff nodes produced by `buildDiff`
 * @returns 三欄表格文字 / Three-column table text
 */
export declare function buildDiffTable(diff: IDiffNode<IComputedPackage, IComputedPackage>[]): string;
