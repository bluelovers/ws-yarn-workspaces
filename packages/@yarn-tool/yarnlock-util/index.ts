/**
 * 匯出統一的列解析結果型別（`IParseNameAndVersionWithNpaResult`），
 * 讓 v1 / v2 解析器共用同一組回傳欄位。
 * Re-export the shared row-parse result type (`IParseNameAndVersionWithNpaResult`) so the
 * v1 / v2 parsers return the same set of fields.
 */
export * from './lib/types';

import { parseYarnLockRowV1 } from './lib/v1/parseYarnLockRowV1';
import { parseYarnLockRowV2 } from './lib/v2/parseYarnLockRowV2';

/**
 * v1 的列解析器（Row Parser）。
 * The v1 row parser.
 */
export { parseYarnLockRowV1 }

/**
 * Berry（v2/v3）的列解析器（Row Parser）。
 * The Berry (v2/v3) row parser.
 */
export { parseYarnLockRowV2 }

/**
 * 預設匯出整份模組命名空間，而非單一函式：本套件沒有「唯一入口」，
 * 使用者可能任意搭配型別與兩個解析器，因此預設值要保留完整匯出面。
 * The default export is the whole module namespace rather than a single function: this package
 * has no single entry point, and users may mix the types with either parser, so the default
 * must preserve the full export surface.
 */
export default exports as typeof import('./index')
