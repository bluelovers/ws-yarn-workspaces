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

export { sortOrder }

export default sortOrder
