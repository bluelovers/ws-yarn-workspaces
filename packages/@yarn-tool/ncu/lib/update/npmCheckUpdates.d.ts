/**
 * Core npm-check-updates wrapper function.
 * npm-check-updates 的核心封裝函數。
 *
 * 此模組提供主要功能：
 * - 檢查 package.json 中依賴套件的可用更新
 * - 比較當前版本與最新版本
 * - 支援 semver 版本範圍處理
 * - 整合版本快取機制
 *
 * @module update/npmCheckUpdates
 */
import { IOptionsNpmCheckUpdates } from '../types';
import Bluebird from 'bluebird';
import { IWrapDedupeCache } from '@yarn-tool/yarnlock/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
export declare function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>, ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>): Bluebird<IOptionsNpmCheckUpdates>;
