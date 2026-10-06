import { EnumDetectYarnLock, IYarnLockParsed, IYarnLockRawSourceV1, IYarnLockRawSourceV2, IYarnLockSource } from '@yarn-tool/yarnlock-types';
import { stringifyYarnLockRawV1 } from '@yarn-tool/yarnlock-parse-raw/lib/v1';
import { stringifyYarnLockRawV2 } from '@yarn-tool/yarnlock-parse-raw/lib/v2';
/**
 * 將任意形式的 `yarn.lock` 資料還原成其原本版本的原始文字。
 * Restore any form of `yarn.lock` data back to the raw text of its own lockfile version.
 *
 * 刻意把三條路徑（已解析物件 → 原始 JSON 物件 → 原始文字）收斂在同一個入口，
 * 是因為呼叫端通常不確定輸入來源，統一入口可避免每一層重複實作版本偵測。
 * Collapsing the three paths (parsed object → raw JSON object → raw text) into one entry
 * point avoids duplicating version detection at every layer, since callers usually do not
 * know the exact shape of their input.
 *
 * @param yarnlock_old 已解析物件、原始 JSON 物件、字串或 Buffer / Parsed object, raw JSON object, string or Buffer
 * @returns 對應 v1/v2/v3 的 lockfile 原始文字 / Raw lockfile text matching v1/v2/v3
 * @throws 無法辨識任何版本時拋出 `YarnLockParsedVersionError` / Thrown when no lockfile version can be detected
 */
export declare function yarnLockStringify(yarnlock_old: Record<string, any> | Buffer | string | IYarnLockSource | IYarnLockParsed): string;
/**
 * 序列化結果的聯合型別（Union Type），以 `verType` 作為可辨別聯合（Discriminated Union）的判別鍵，
 * 讓呼叫端只檢查一次就能同時收窄 `fn` 與 `json`。
 * Union type of serialization results keyed by `verType`, so a single check narrows both
 * `fn` and `json` for the caller.
 */
export type IResultYarnLockStringifyRaw = {
    /**
     * Yarn 鎖定檔 v1（classic）分支。
     * Yarn lockfile v1 (classic) branch.
     */
    verType: EnumDetectYarnLock.v1;
    /**
     * v1 專用的序列化函式；v1 與 v2+ 的文字格式差異過大，無法共用同一個實作。
     * The v1-only serializer; v1 and v2+ text formats differ too much to share an implementation.
     */
    fn: typeof stringifyYarnLockRawV1;
    /**
     * 經版本偵測確認屬於 v1 的原始 JSON。
     * The raw JSON confirmed to be v1 by version detection.
     */
    json: IYarnLockRawSourceV1;
    /**
     * 序列化後的 lockfile 原始文字。
     * The serialized raw lockfile text.
     */
    content: string;
} | {
    /**
     * Yarn 鎖定檔 v2（berry）分支。
     * Yarn lockfile v2 (berry) branch.
     */
    verType: EnumDetectYarnLock.v2;
    /**
     * v2 與 v3 的 lockfile 文字格式相同，因此刻意共用 `stringifyYarnLockRawV2`。
     * v2 and v3 share the same lockfile text format, so they deliberately reuse
     * `stringifyYarnLockRawV2`.
     */
    fn: typeof stringifyYarnLockRawV2;
    /**
     * 經版本偵測確認屬於 v2 的原始 JSON；v2 與 v3 共用同一組型別。
     * The raw JSON confirmed to be v2; v2 and v3 share the same type shape.
     */
    json: IYarnLockRawSourceV2;
    /**
     * 序列化後的 lockfile 原始文字。
     * The serialized raw lockfile text.
     */
    content: string;
} | {
    /**
     * Yarn 鎖定檔 v3 分支；僅版本列舉不同，其餘行為皆與 v2 相同。
     * Yarn lockfile v3 branch; only the enum differs, everything else behaves like v2.
     */
    verType: EnumDetectYarnLock.v3;
    /**
     * v3 沿用 v2 的序列化函式，見 v2 分支的說明。
     * v3 reuses the v2 serializer; see the v2 branch for the rationale.
     */
    fn: typeof stringifyYarnLockRawV2;
    /**
     * 經版本偵測確認屬於 v3 的原始 JSON。
     * The raw JSON confirmed to be v3 by version detection.
     */
    json: IYarnLockRawSourceV2;
    /**
     * 序列化後的 lockfile 原始文字。
     * The serialized raw lockfile text.
     */
    content: string;
};
/**
 * 進階用法：回傳完整結果物件（含版本與實際使用的序列化函式），而不只是文字。
 * Advanced form that returns the full result (version and the serializer actually used)
 * instead of only the text.
 *
 * 以下底線開頭表示屬於進階／內部 API，一般情境請改用 `yarnLockStringifyRaw`。
 * The leading underscore marks this as an advanced/internal API; prefer `yarnLockStringifyRaw`
 * in normal use.
 *
 * @param yarnlockRawJSON 已知版本的原始 JSON 物件 / Raw JSON object with a known lockfile version
 */
export declare function _yarnLockStringifyRaw(yarnlockRawJSON: IYarnLockSource): IResultYarnLockStringifyRaw;
/**
 * 將已知版本的原始 JSON 物件序列化為 lockfile 原始文字。
 * Serialize a raw JSON object of known lockfile version into raw lockfile text.
 *
 * @param yarnlockRawJSON 已知版本的原始 JSON 物件 / Raw JSON object with a known lockfile version
 * @returns lockfile 原始文字 / Raw lockfile text
 * @throws 版本無法辨識或不支援時拋出 / Thrown when the version is unknown or unsupported
 */
export declare function yarnLockStringifyRaw(yarnlockRawJSON: IYarnLockSource): string;
/**
 * 序列化核心：只負責「挑函式 → 呼叫」，不做版本偵測。
 * Serialization core: only picks the serializer and calls it, with no version detection.
 *
 * 版本偵測集中放在上游（`yarnLockStringify` / `_yarnLockStringifyRaw`），
 * 如此這裡就能把未知版本當成程式設計錯誤直接拋錯，而不是回傳半成品。
 * Version detection stays upstream (`yarnLockStringify` / `_yarnLockStringifyRaw`) so this
 * function can treat an unknown version as a programming error and throw instead of
 * returning a partial result.
 *
 * @param verType 已判定的鎖定檔版本 / The already-determined lockfile version
 * @param yarnlockRawJSON 對應版本的原始 JSON / Raw JSON matching that version
 * @throws `verType` 不在 v1/v2/v3 之內時拋出 / Thrown when `verType` is not v1/v2/v3
 */
export declare function _yarnLockStringifyRawCore(verType: EnumDetectYarnLock, yarnlockRawJSON: IYarnLockSource): IResultYarnLockStringifyRaw;
/**
 * 預設匯出（Default Export）指向萬用入口 `yarnLockStringify`，
 * 讓 `import yarnLockStringify from '@yarn-tool/yarnlock-stringify'` 與具名匯入行為一致。
 * The default export points at the all-in-one entry `yarnLockStringify`, so
 * `import yarnLockStringify from '@yarn-tool/yarnlock-stringify'` behaves the same as the
 * named import.
 */
export default yarnLockStringify;
