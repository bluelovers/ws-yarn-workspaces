/**
 * Created by user on 2020/6/11.
 */
import { ITSArrayListMaybeReadonly, ITSValueOfArray } from 'ts-type';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { Console2 } from 'debug-color2';
import { Argv, Arguments } from 'yargs';
import { IVersionValue } from '@ts-type/package-dts/lib/package-json/types';
import { IYarnLockDataRowBase } from '@yarn-tool/yarnlock-types';
import { IFsYarnLockReturnType } from '@yarn-tool/yarnlock-fs/lib/types';
/**
 * 解析後的 yarn.lock 資料，以 `名稱@版本` 鍵值對應到列資料。
 * @deprecated 請改用 @yarn-tool/yarnlock-types 的 IYarnLockDataRecord / use IYarnLockDataRecord from @yarn-tool/yarnlock-types instead
 */
export type IYarnLockfileParseObject<T extends ITSArrayListMaybeReadonly<string> = string[]> = Record<string, IYarnLockfileParseObjectRow<T>>;
/**
 * yarn.lock 資料
 * @deprecated
 */
export interface IYarnLockfileParseObjectRow<T extends ITSArrayListMaybeReadonly<string> = string[]> extends IYarnLockDataRowBase {
    /**
     * 安裝來源網址
     */
    resolved: string;
    /**
     * hash key
     */
    integrity: string;
}
/**
 * `filterResolutions` / `exportYarnLock` 的回傳形狀：
 * 同時提供「原始鍵列表」與「依模組名稱彙整後」的多種視圖，
 * 讓呼叫端不必重複解析 yarn.lock 鍵值。
 *
 * Return shape of `filterResolutions` / `exportYarnLock`: offers both the raw key list
 * and module-name-aggregated views so callers never re-parse yarn.lock keys themselves.
 */
export interface IFilterResolutions<T extends ITSArrayListMaybeReadonly<string>> {
    /**
     * yarn.lock key 列表
     */
    names: T;
    /**
     * 過濾後的 yarn lock deps
     */
    deps: {
        [P in (keyof ITSValueOfArray<T> | string)]: {
            [P in IVersionValue]: IYarnLockfileParseObjectRow<T>;
        };
    };
    /**
     * 實際安裝的版本編號
     */
    installed?: {
        [P in ITSValueOfArray<T>]: IVersionValue[];
    };
    /**
     * 每個模組最大的安裝版本
     */
    max?: {
        [P in ITSValueOfArray<T>]: {
            key: ITSValueOfArray<T>;
            value: IYarnLockfileParseObjectRow<T>;
        };
    };
}
/**
 * `removeResolutions` 的回傳形狀：同時保留刪除前後的 yarn.lock 快照
 * 與變動旗標，供呼叫端判斷是否需要回寫檔案。
 *
 * Return shape of `removeResolutions`: keeps before/after yarn.lock snapshots plus a
 * changed flag so callers can decide whether to rewrite the file.
 */
export interface IRemoveResolutions<T extends ITSArrayListMaybeReadonly<string>> {
    /**
     * 執行前的 yarn.lock
     */
    yarnlock_old: IYarnLockfileParseObject<T>;
    /**
     * 執行後的 yarn.lock
     */
    yarnlock_new: IYarnLockfileParseObject<T>;
    /**
     * yarn.lock 是否有變動
     */
    yarnlock_changed: boolean;
    /**
     * 命中的過濾明細
     */
    result: IFilterResolutions<T>;
}
/**
 * `wrapDedupe` 管線在各步驟間共享的快取 (Cache)；
 * 欄位會隨步驟推進被改寫，因此部分欄位設為 readonly 以限制只由管線賦值。
 *
 * Cache shared across `wrapDedupe` pipeline steps; fields are rewritten as steps
 * progress, so some are readonly to reserve assignment to the pipeline itself.
 */
export interface IWrapDedupeCache {
    /**
     * 如果不存在則等於 argv.cwd
     */
    readonly cwd?: string;
    /**
     * 專案根目錄資訊，由 findRoot 於初始化時解析
     */
    readonly rootData?: IFindRootReturnType;
    /**
     * 目前的 yarn.lock 狀態(隨步驟更動狀態)
     */
    yarnlock_cache?: IFsYarnLockReturnType;
    /**
     * 執行前的 yarn.lock
     */
    readonly yarnlock_old?: string;
    /**
     * `yarnlock_old` 的後備基準：於第一次 dedupe 前備份，
     * 當 `yarnlock_old` 缺少時仍能作為最終 diff 的比對基準。
     *
     * Fallback baseline of `yarnlock_old`: snapshotted before the first dedupe so the
     * final diff still has a baseline when `yarnlock_old` is unavailable.
     */
    yarnlock_old2?: string;
    /**
     * 執行前的 yarn.lock 是否存在
     */
    readonly yarnlock_old_exists?: string;
    /**
     * yarn.lock 是否有變動
     */
    yarnlock_changed?: boolean;
    /**
     * 最後一次的 yarn.lock diff 訊息
     */
    yarnlock_msg?: string;
    /**
     * 每個步驟的狀態 true 代表中斷所有步驟
     * null 代表此步驟不存在
     * void/undefined 代表此步驟未執行
     */
    readonly ret: {
        readonly init: boolean | void | null;
        readonly before: boolean | void | null;
        readonly main: boolean | void | null;
        readonly after: boolean | void | null;
        readonly end: boolean | void | null;
    };
    /**
     * 除錯用 console，由 handleWrapDedupeOptions 套用預設值
     */
    readonly consoleDebug?: Console2;
    /**
     * 一般輸出用 console，由 handleWrapDedupeOptions 套用預設值
     */
    readonly console?: Console2;
}
/**
 * `wrapDedupe` 的回傳形狀：除了回傳快取，也一併帶回 yargs 的 yarg/argv，
 * 讓呼叫端不需要再從作用域外抓取參數即可接續處理。
 *
 * Return shape of `wrapDedupe`: besides the cache it carries the yargs yarg/argv back,
 * so callers can continue without re-capturing them from an outer scope.
 */
export interface IWrapDedupeReturnType<T extends {
    cwd?: string;
    [k: string]: unknown;
}, U extends T | {
    cwd: string;
    [k: string]: unknown;
}, C extends IWrapDedupeCache> {
    /**
     * 解析後的工作目錄（絕對路徑）
     */
    cwd: string;
    /**
     * 專案根目錄資訊
     */
    rootData: IFindRootReturnType;
    /**
     * yargs 的 builder 實例
     */
    yarg: Argv<T>;
    /**
     * yargs 解析後的參數
     */
    argv: Arguments<U>;
    /**
     * 管線共享的快取
     */
    cache: C;
}
/**
 * `infoFromDedupeCache` 的回傳：根目錄資訊與 yarn.lock 狀態的彙整結果。
 *
 * Return of `infoFromDedupeCache`: root info merged with yarn.lock status flags.
 */
export type IInfoFromDedupeCacheReturnType = IFindRootReturnType & {
    yarnlock_file: string;
    yarnlock_old_exists: string;
    yarnlock_exists: boolean;
    yarnlock_changed: boolean;
};
