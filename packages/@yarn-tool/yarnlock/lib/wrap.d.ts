import { Console2 } from 'debug-color2';
import { Argv, Arguments } from 'yargs';
import { IWrapDedupeReturnType, IWrapDedupeCache, IInfoFromDedupeCacheReturnType } from './types';
export declare function wrapDedupe<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: {
    /**
     * 如果初始化沒有發生錯誤 此步驟必定執行
     */
    init?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void;
    /**
     * 於 第一次 Dedupe 前的步驟
     */
    before?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void;
    /**
     * 此步驟為必要選項
     */
    main(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void;
    /**
     * 於 第二次 Dedupe 後的步驟
     */
    after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void;
    /**
     * 於 第二次 Dedupe 後的步驟
     */
    after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void;
    /**
     * 如果結束前沒有發生錯誤 此步驟必定執行
     */
    end?(yarg: Argv<T>, argv: Arguments<U>, cache: C): boolean | void;
    /**
     * 步驟間共享的緩存資訊並且會影響部分行為
     */
    cache?: Partial<C>;
    consoleDebug: Console2;
}): IWrapDedupeReturnType<T, U, C>;
export declare function infoFromDedupeCache(cache: IWrapDedupeCache): IInfoFromDedupeCacheReturnType;
