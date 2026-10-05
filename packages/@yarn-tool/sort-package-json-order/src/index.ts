/**
 * Sort order for package.json keys / package.json 鍵值排序順序
 *
 * This module exports a predefined sort order for package.json keys.
 * The order follows common conventions and best practices for package.json organization.
 *
 * 此模組匯出 package.json 鍵值的預定義排序順序。
 * 順序遵循 package.json 組織的常見慣例和最佳實踐。
 *
 * @module @yarn-tool/sort-package-json-order
 *
 * @example
 * ```typescript
 * import sortOrder from '@yarn-tool/sort-package-json-order';
 *
 * // Use with sort-object-keys2
 * import { sortObjectKeys } from 'sort-object-keys2';
 *
 * const sorted = sortObjectKeys(packageJson, { keys: sortOrder, useSource: true });
 * ```
 */

import { sortOrder } from './sort-order';

/**
 * 具名匯出（Named export）：供需要明確指定來源的呼叫端使用，
 * 與預設匯出指向同一個陣列實例，兩者混用不會產生不同順序。
 *
 * Named export for callers that prefer an explicit source; it is the very same
 * array instance as the default export, so mixing both yields one identical order.
 */
export { sortOrder }

/**
 * 預設匯出（Default export）：讓 `import sortOrder from '...'` 即可取得順序，
 * 與 README 範例及 sort-package-json3 的 `sortOrder` 選項用法一致。
 *
 * Default export so `import sortOrder from '...'` works, matching the README
 * example and the way `sort-package-json3` consumes the `sortOrder` option.
 */
export default sortOrder
