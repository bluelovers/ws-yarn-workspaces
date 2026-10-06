/**
 * Created by user on 2018/6/5/005.
 */
import { workspacesPackagesList } from './lib/listpkg';
/**
 * 匯出所有型別定義，讓使用者能直接引用列（Row）與讀取結果的介面。
 * Re-export all type definitions so consumers can import the row/read-result interfaces directly.
 */
export * from './lib/types';
/**
 * 一次匯出其餘實作模組（清單、讀取、tsconfig paths、過濾與依賴樹），構成套件的主要 API。
 * Re-export the remaining implementation modules (listing, reading, tsconfig paths, filtering, deps tree) to form the main public API.
 */
export * from './lib/listpkg';
export * from './lib/readpkg';
export * from './lib/tsconfig';
export * from './lib/listable';
export * from './lib/glob';
export * from './lib/util';
export * from './lib/deps-tree';
/**
 * 預設匯出主要入口函式，方便 `import list from 'ws-pkg-list'` 直接取得清單。
 * Default-export the primary entry function so `import list from 'ws-pkg-list'` works directly.
 */
export default workspacesPackagesList;
