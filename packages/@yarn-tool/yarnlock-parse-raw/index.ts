/**
 * 依格式版本分組匯出解析 (parse) 與寫回 (stringify) API。
 * Re-export parse / stringify APIs grouped by lockfile format version.
 *
 * @remarks
 * v1 與 v2 的原始結構差異大，因此刻意分開成兩組函式、不做統一封裝，
 * 讓呼叫端依偵測結果自行選擇對應的處理路徑。
 * The v1 and v2 raw structures differ greatly, so the two groups are kept
 * separate without a wrapper; callers pick the right path by detection.
 */
export { parseYarnLockRawV2, stringifyYarnLockRawV2 } from './lib/v2';
export { parseYarnLockRawV1, stringifyYarnLockRawV1 } from './lib/v1';
