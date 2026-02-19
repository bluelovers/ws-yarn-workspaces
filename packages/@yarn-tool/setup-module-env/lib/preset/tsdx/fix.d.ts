/**
 * tsdx package.json 修復與調整工具函式
 * Utility functions for fixing and adjusting tsdx package.json
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { ISetupTsdxOptions } from './index';
import { ITSPickExtra } from 'ts-type/lib/type/record';
/**
 * 修復 tsdx 專案的 package.json 設定
 * Fix tsdx project's package.json configuration
 *
 * 根據工作區 (workspace) 的狀態調整 tslib 依賴的位置：
 * Adjusts tslib dependency location based on workspace status:
 *
 * - 如果位於工作區內但不是工作區根目錄：移除 tslib 依賴（由根目錄統一管理）
 *   If inside a workspace but not the workspace root: removes tslib dependency (managed by root)
 *
 * - 如果是獨立專案或工作區根目錄：將 tslib 從 dependencies 移至 devDependencies
 *   If standalone project or workspace root: moves tslib from dependencies to devDependencies
 *
 * @param pkg - package.json 物件 / package.json object
 * @param config - 包含 rootData 的設定選項 / configuration options containing rootData
 * @returns 修改後的 package.json 物件 / Modified package.json object
 */
export declare function fixTsdxPackage<P extends IPackageJson>(pkg: P, config: ITSPickExtra<ISetupTsdxOptions<P>, 'rootData'>): P;
