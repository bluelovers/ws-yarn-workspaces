import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
/** 需要被強制為布林值的預設選項欄位 / Default option fields that must be coerced to boolean */
export declare const opts: readonly ["includePrerelease", "loose", "rtl"];
/**
 * 把選項中的指定欄位強制轉為布林值
 * Coerce the given option fields to boolean
 *
 * 使用者常傳入 0/1、字串等非嚴格布林值，此函式統一成真正的 boolean，
 * 避免 `if (options.loose)` 這類判斷在非預期型別下出現歧義。
 * Callers often pass 0/1 or strings instead of a real boolean; this normalizes
 * them so checks like `if (options.loose)` never behave ambiguously.
 *
 * @param options - 選項物件（會被原地修改）/ Options object (mutated in place)
 * @param fields - 需要轉換的欄位，預設 opts / Fields to coerce, defaults to `opts`
 * @param mode - true 時即使欄位不存在也補成 false / When true, missing fields are also materialized as false
 * @returns 同一個選項物件 / The same options object
 */
export declare function fixBooleanProperty<T extends Record<any, any>>(options: T, fields?: ITSArrayListMaybeReadonly<string>, mode?: boolean): T;
