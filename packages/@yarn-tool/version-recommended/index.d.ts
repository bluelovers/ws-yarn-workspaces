/**
 * 套件主要入口：重新匯出所有版本推薦 API
 * Package entry point: re-export every version recommendation API
 *
 * 這裡刻意只做轉出而不含邏輯，讓 tree-shaking 與文件工具
 * 能把實作細節留在 lib/ 各模組中。
 * This entry only re-exports with no logic, so tree-shaking and doc tools
 * keep implementation details inside the lib/ modules.
 */
import { nextVersionRecommended } from './lib/nextVersionRecommended';
import { nextVersionRecommendedByWorkspacesProject, nextVersionRecommendedByWorkspacesFindUp } from './lib/ws';
import { nextVersionRecommendedByPackage, nextVersionRecommendedByPackageFindUp } from './lib/pkg';
export * from './lib/types';
export { nextVersionRecommended };
export { nextVersionRecommendedByWorkspacesFindUp };
export { nextVersionRecommendedByWorkspacesProject };
export { nextVersionRecommendedByPackage };
export { nextVersionRecommendedByPackageFindUp };
/**
 * 預設匯出為「自動向上尋找 package.json」的版本，
 * 因為多數 CLI 場景不需要手動提供版本字串
 *
 * The default export finds package.json upward automatically, since most CLI
 * usage does not want to pass a version string by hand
 */
export default nextVersionRecommendedByPackageFindUp;
