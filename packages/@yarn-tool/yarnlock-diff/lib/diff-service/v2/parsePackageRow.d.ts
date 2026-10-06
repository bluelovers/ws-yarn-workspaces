import { parseYarnLockRowV2 as parsePackageRow } from '@yarn-tool/yarnlock-util/lib/v2/parseYarnLockRowV2';
/**
 * 把 Berry（v2/v3）的列解析器（Row Parser）統一命名為 `parsePackageRow` 再轉發。
 * Re-export the Berry (v2/v3) row parser under the unified name `parsePackageRow`.
 *
 * 與 `../v1/parsePackageRow` 使用相同的對外名稱，
 * 讓上層可以只依版本選擇模組、而不必修改呼叫端的識別字面。
 * It shares the export name with `../v1/parsePackageRow` so the caller only switches module by
 * version and never has to change the identifier it imports.
 */
export { parsePackageRow };
export default parsePackageRow;
