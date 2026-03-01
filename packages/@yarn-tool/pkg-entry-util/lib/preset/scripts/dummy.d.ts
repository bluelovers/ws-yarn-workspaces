/**
 * 虛擬腳本填充工具 / Dummy Scripts Filler Utility
 *
 * 提供用於填充 package.json scripts 欄位中生命週期腳本佔位符的功能
 * Provides functionality to fill lifecycle script placeholders in package.json scripts field
 */
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
/**
 * 核心虛擬腳本填充函數 / Core dummy scripts filler function
 *
 * 為指定的腳本欄位填充 echo 命令作為佔位符
 * Fills echo commands as placeholders for specified script fields
 *
 * @template T - 腳本物件類型 / Script object type
 * @param scripts - 腳本物件 / Script object
 * @param prefix - echo 前綴文字 / Echo prefix text
 * @param fields - 要填充的腳本名稱陣列 / Array of script names to fill
 * @returns 填充後的腳本物件 / Filled script object
 *
 * @example
 * ```typescript
 * _fillDummyScriptsCore({}, 'workspaces', ['preversion', 'postversion'])
 * // 返回: { preversion: 'echo workspaces preversion', postversion: 'echo workspaces postversion' }
 * ```
 */
export declare function _fillDummyScriptsCore<T extends Record<string, string>>(scripts: T, prefix: string, fields: ITSArrayListMaybeReadonly<string>): T;
/**
 * 填充虛擬生命週期腳本 / Fill dummy lifecycle scripts
 *
 * 為 package.json 的標準生命週期腳本填充佔位符命令
 * Fills placeholder commands for standard lifecycle scripts in package.json
 *
 * 包含以下腳本 / Includes following scripts:
 * - preversion: 版本更新前執行 / Run before version bump
 * - version: 版本更新時執行 / Run on version bump
 * - prepublishOnly: 發布前執行 / Run before publish
 * - postversion: 版本更新後執行 / Run after version bump
 * - publish: 發布時執行 / Run on publish
 * - prepublish: 發布前執行（舊版）/ Run before publish (legacy)
 * - postpublish: 發布後執行 / Run after publish
 * - postpublishOnly: 發布後執行 / Run after publish only
 * - prepare: 準備階段執行 / Run during prepare
 * - prepack: 打包前執行 / Run before pack
 * - pack: 打包時執行 / Run on pack
 * - postpack: 打包後執行 / Run after pack
 * - pretest: 測試前執行 / Run before test
 * - ci:build: CI 建置階段 / CI build stage
 * - ci:install: CI 安裝階段 / CI install stage
 *
 * @template T - 腳本物件類型 / Script object type
 * @param scripts - 腳本物件（可選）/ Script object (optional)
 * @param prefix - echo 前綴文字（可選）/ Echo prefix text (optional)
 * @returns 填充後的腳本物件 / Filled script object
 *
 * @example
 * ```typescript
 * fillDummyScripts({}, 'my-package')
 * // 返回包含所有生命週期腳本的物件
 * ```
 */
export declare function fillDummyScripts<T extends Record<string, string>>(scripts?: T, prefix?: string): T;
