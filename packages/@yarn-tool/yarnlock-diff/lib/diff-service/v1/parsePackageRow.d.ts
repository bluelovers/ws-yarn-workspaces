import { parseYarnLockRowV1 as parsePackageRow } from '@yarn-tool/yarnlock-util/lib/v1/parseYarnLockRowV1';
/**
 * 把 v1 的列解析器（Row Parser）統一命名為 `parsePackageRow` 再轉發。
 * Re-export the v1 row parser under the unified name `parsePackageRow`.
 *
 * v1 與 v2 的原始函式名稱不同（`parseYarnLockRowV1` / `parseYarnLockRowV2`），
 * 統一名稱後兩邊的測試與呼叫端可以共用同一段程式碼。
 * The underlying functions have different names (`parseYarnLockRowV1` / `parseYarnLockRowV2`);
 * normalizing the export name lets tests and call sites share one code path.
 */
export { parsePackageRow };
export default parsePackageRow;
