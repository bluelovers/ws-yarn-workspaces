import { IWrapDedupeCache, IWrapDedupeReturnType } from '../types';
import { Arguments, Argv } from 'yargs';
import { IWrapDedupeOptions } from './types';
/**
 * `wrapDedupe` 的非同步版本：以 `await` 依序執行
 * `init → before → 第一次 dedupe → main → 第二次 dedupe → after → 最終 diff → end`，
 * 任一步驟回傳 truthy 即中斷後續步驟。
 * 與同步版相同，使用 labelled block（`LABEL1`）而非提早 return，
 * 讓中斷時仍會執行結尾的 `end` 步驟並保持統一的回傳形狀。
 *
 * Asynchronous variant of `wrapDedupe`: awaits
 * `init → before → first dedupe → main → second dedupe → after → final diff → end` in
 * order; any truthy step aborts the rest. Like the sync version it uses a labelled block
 * (`LABEL1`) instead of early returns so the trailing `end` step still runs on abort and
 * the return shape stays uniform.
 */
export declare function wrapDedupeAsync<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: IWrapDedupeOptions<T, U, C>): Promise<IWrapDedupeReturnType<T, U, C>>;
