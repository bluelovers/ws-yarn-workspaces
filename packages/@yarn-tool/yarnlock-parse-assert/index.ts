import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import { detectYarnLockVersionByParsed } from '@yarn-tool/detect-yarnlock-version';
import {
	EnumDetectYarnLock,
	IYarnLockDataRecord,
	IYarnLockDataRowBase,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockParsed,
	IYarnLockParsedLoose,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
} from '@yarn-tool/yarnlock-types';

/**
 * 判斷任意物件是否為可辨識版本的 yarn.lock 解析結果。
 * Check whether an arbitrary object is a yarn.lock parse result with a recognizable version.
 *
 * @remarks
 * 以 detectYarnLockVersionByParsed > 0 作為判準：
 * 回傳 0 代表無法辨識，因此不適合拿來判斷具體版本、只適合做型別守衛。
 * Uses detectYarnLockVersionByParsed > 0: 0 means unrecognized, so this is
 * only a type guard, not a way to tell the exact version.
 */
export function isYarnLockParsed(parsedObject: IYarnLockParsed): parsedObject is IYarnLockParsed
{
	return detectYarnLockVersionByParsed(parsedObject) > 0
}

/**
 * 斷言輸入為有效解析結果，失敗時拋出 YarnLockParsedVersionError。
 * Assert the input is a valid parse result; throw YarnLockParsedVersionError otherwise.
 *
 * @remarks
 * 與 isYarnLockParsed 的差別在於：此函式失敗會中斷流程，
 * 讓未驗證的資料不會繼續流向下游。
 * Unlike isYarnLockParsed, failure aborts the flow so unvalidated data
 * never continues downstream.
 */
export function assertYarnLockParsed(parsedObject: IYarnLockParsed | IYarnLockParsedLoose): asserts parsedObject is IYarnLockParsed
{
	/**
	 * detect 回傳 0 表示無法辨識版本，此時必須拒絕而非放行。
	 * detect returns 0 when the version is unrecognized; the input must be rejected, not passed through.
	 */
	if (!detectYarnLockVersionByParsed(parsedObject))
	{
		throw newYarnLockParsedVersionError();
	}
}

/**
 * 型別守衛：判斷是否為 v1 格式的解析結果。
 * Type guard: check whether the parsed result uses the v1 format.
 *
 * @remarks
 * 只看 verType 欄位；輸入可能未經驗證，故以斷言轉型後再存取欄位。
 * Only inspects `verType`; the input may be unvalidated, so it is
 * asserted into shape before the field access.
 */
export function isYarnLockParsedV1<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>>(data): data is IYarnLockParsedV1<T>
{
	return (data as IYarnLockParsedV1).verType === EnumDetectYarnLock.v1
}

/**
 * 型別守衛：判斷是否為 v2 或 v3 格式的解析結果。
 * Type guard: check whether the parsed result uses the v2 or v3 format.
 *
 * @remarks
 * v2 與 v3 的 parsed 結構相同，因此兩種 verType 一併視為 v2 分支，
 * 避免呼叫端重複判斷。
 * v2 and v3 share the same parsed structure, so both verType values map to
 * the v2 branch and callers avoid a duplicate check.
 */
export function isYarnLockParsedV2<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>>(data): data is IYarnLockParsedV2<T>
{
	return (data as IYarnLockParsedV2).verType === EnumDetectYarnLock.v2 || (data as IYarnLockParsedV2).verType === EnumDetectYarnLock.v3
}

/**
 * assertYarnLockParsedIsSupported 的回呼 (callback) 簽名，依 verType 提供對應的收窄型別。
 * Callback signature of assertYarnLockParsedIsSupported, narrowing the payload per verType.
 *
 * @remarks
 * 以多重簽名 (overload) 表達：給定 v1 時第二參數收窄為 IYarnLockParsedV1、
 * v2 / v3 時收窄為 IYarnLockParsedV2；最後一個簽名作為不支援型別的兜底。
 * Overloads express that a v1 verType narrows the second argument to
 * IYarnLockParsedV1, v2 / v3 to IYarnLockParsedV2; the final signature is
 * the fallback for unsupported types.
 */
interface IAssertYarnLockParsedIsSupportedCB<T extends IYarnLockParsedV1 | IYarnLockParsedV2>
{
	(verType: EnumDetectYarnLock.v1, parsedOldPackage: Extract<T, IYarnLockParsedV1>): any

	(verType: EnumDetectYarnLock.v2, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any

	(verType: EnumDetectYarnLock.v3, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any

	(verType: EnumDetectYarnLock, parsedOldPackage: T): any
}

/**
 * 斷言解析結果屬於支援的版本，可選擇以回呼 (callback) 依版本分流。
 * Assert the parsed result is a supported version, optionally branching via a callback.
 *
 * @param parsedOldPackage - 待驗證的解析結果
 *                           - the parsed result to validate
 * @param cb - 可選回呼，收到 verType 與已收窄的資料
 *             - optional callback receiving the verType and the narrowed data
 *
 * @remarks
 * v2 分支刻意回傳 EnumDetectYarnLock.v3：v2 / v3 共用同一格式，
 * 下游只需處理「v1」與「v2 格式（以 v3 表示）」兩條路徑。
 * The v2 branch deliberately reports EnumDetectYarnLock.v3: v2 / v3 share one
 * format, so downstream only handles two paths — v1 and the v2 format (as v3).
 */
export function assertYarnLockParsedIsSupported<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(parsedOldPackage: T,
	cb?: IAssertYarnLockParsedIsSupportedCB<T>,
): asserts parsedOldPackage is T
{
	/**
	 * if / else-if 依序判斷：先分離 v1，其餘無法辨識者交給結尾的 throw。
	 * if / else-if order: v1 is peeled off first, anything unrecognized falls to the trailing throw.
	 */
	if (isYarnLockParsedV1(parsedOldPackage))
	{
		return cb?.(EnumDetectYarnLock.v1, parsedOldPackage)
	}
	else if (isYarnLockParsedV2(parsedOldPackage))
	{
		return cb?.(EnumDetectYarnLock.v3, parsedOldPackage)
	}

	/**
	 * 兩種格式都不是 → 版本不受支援，以統一錯誤中斷流程。
	 * Neither format matched → unsupported version, abort with the shared error.
	 */
	throw newYarnLockParsedVersionError()
}

/**
 * default 匯出主要斷言函式，方便以 `import assert from ...` 直接使用。
 * Default-export the main assertion for `import assert from ...` convenience.
 */
export default assertYarnLockParsed
