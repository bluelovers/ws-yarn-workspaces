/**
 * 共享根目錄腳本預設 / Shared Root Scripts Preset
 *
 * 提供根目錄套件共用的預設 npm scripts
 * Provides shared npm scripts for root packages
 *
 * 此模組被 root-scripts 和 ws-root-scripts 共用
 * This module is shared by root-scripts and ws-root-scripts
 */
/**
 * 共享根目錄預設腳本 / Shared root default scripts
 *
 * 適用於所有根目錄類型的通用管理腳本
 * General management scripts for all root package types
 *
 * @returns 包含共享根目錄腳本的物件 / Object containing shared root scripts
 *
 * 包含腳本 / Includes scripts:
 * - ci:install: CI 環境安裝與依賴設定 / CI environment install and dependency setup
 * - test:jest:clearCache: 清除 Jest 快取 / Clear Jest cache
 * - install:resetLockfile: 重置鎖定檔安裝 / Install with reset lockfile
 * - install:frozenLockfile: 凍結鎖定檔安裝 / Install with frozen lockfile
 * - ws:fix-all: 修復所有工作區問題 / Fix all workspace issues
 * - ws:fix-all:resetStaticFiles: 修復並重置靜態檔 / Fix and reset static files
 */
export declare function defaultSharedRootScripts(): {
    /**
     * CI 環境安裝腳本 / CI environment install script
     *
     * 安裝核心開發工具：yarn-tool、lerna、ynpx、ts-node、ts-jest、jest、typescript、jest-config、tsx、pnpm
     * Installs core development tools
     */
    "ci:install": string;
    /** 清除 Jest 快取 / Clear Jest cache */
    "test:jest:clearCache": string;
    /** 重置鎖定檔安裝 / Install with reset lockfile */
    "install:resetLockfile": string;
    /** 凍結鎖定檔安裝 / Install with frozen lockfile */
    "install:frozenLockfile": string;
    /** 修復所有工作區問題 / Fix all workspace issues */
    "ws:fix-all": string;
    /** 修復並重置靜態檔 / Fix and reset static files */
    "ws:fix-all:resetStaticFiles": string;
};
