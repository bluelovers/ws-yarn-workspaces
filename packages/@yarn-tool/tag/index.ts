/**
 * 套件入口：轉出標籤相關 API
 * Package entry: re-export the tagging API
 *
 * 預設匯出 gitPackageTag，因為此套件的多數使用情境
 * 就是「對目前套件建立標籤」單一操作。
 * The default export is gitPackageTag because the commonest use of this
 * package is the single operation "tag the current package".
 */
import { gitPackageTag } from './lib/git-tag';

export * from './lib/types';
export * from './lib/core';
export * from './lib/git-tag';

export default gitPackageTag
