import { Arguments, Argv } from 'yargs';
import { IWrapDedupeCache, IWrapDedupeReturnType } from '../types';
import { IWrapDedupeOptions } from './types';
/**
 * 以步驟 (Step) 管線包裝 yarn.lock 去重流程：
 * 依序執行 `init → before → 第一次 dedupe → main → 第二次 dedupe → after → 最終 diff → end`，
 * 任一步驟回傳 truthy 即中斷後續步驟。
 * 使用 labelled block（`LABEL1`）而非多個提早 return，
 * 是為了讓中斷時仍會執行結尾的 `end` 步驟並保持統一的回傳形狀。
 *
 * Wraps yarn.lock dedupe in a step pipeline running
 * `init → before → first dedupe → main → second dedupe → after → final diff → end`;
 * any truthy step aborts the remaining ones.
 * A labelled block (`LABEL1`) is used instead of early returns so the trailing `end`
 * step still runs on abort and the return shape stays uniform.
 *
 * @deprecated 建議改由各步驟自行組合 / prefer composing the steps yourself
 */
export declare function wrapDedupe<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: IWrapDedupeOptions<T, U, C>): IWrapDedupeReturnType<T, U, C>;
