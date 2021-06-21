import { ITSResolvable, ITSWriteablePick, ITSWriteableWith } from 'ts-type';
import { IWrapDedupeCache } from '../types';
import { Arguments, Argv } from 'yargs';
import { Console2 } from 'debug-color2';
export interface IWrapDedupeCacheRuntime extends Omit<ITSWriteableWith<IWrapDedupeCache, 'cwd' | 'rootData' | 'yarnlock_old' | 'yarnlock_old_exists' | 'ret' | 'consoleDebug' | 'console'>, 'ret'> {
    ret: ITSWriteablePick<IWrapDedupeCache["ret"]>;
}
export interface IWrapDedupeOptions<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache> {
    /**
     * 如果初始化沒有發生錯誤 此步驟必定執行
     */
    init?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;
    /**
     * 於 第一次 Dedupe 前的步驟
     */
    before?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;
    /**
     * 此步驟為必要選項
     */
    main(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;
    /**
     * 於 第二次 Dedupe 後的步驟
     */
    after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;
    /**
     * 於 第二次 Dedupe 後的步驟
     */
    after?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;
    /**
     * 如果結束前沒有發生錯誤 此步驟必定執行
     */
    end?(yarg: Argv<T>, argv: Arguments<U>, cache: C): ITSResolvable<boolean | void>;
    /**
     * 步驟間共享的緩存資訊並且會影響部分行為
     */
    cache?: Partial<C>;
    consoleDebug: Console2;
}
