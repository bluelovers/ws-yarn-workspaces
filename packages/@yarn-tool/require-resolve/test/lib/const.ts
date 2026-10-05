/**
 * 測試輔助：可用的路徑符號 (Path Symbol) 清單
 * Test helpers: list of available path symbols
 *
 * 由 @yarn-tool/get-paths-by-type 依目前環境回傳可使用的符號，
 * 測試可據此動態產生案例而不寫死環境相關的常數。
 * Provided by @yarn-tool/get-paths-by-type for the current environment, so
 * tests can build cases dynamically instead of hardcoding environment values.
 */

import { getValidPathSymbols } from '@yarn-tool/get-paths-by-type';

/**
 * 當前環境中有效的路徑符號；不同機器（全域路徑是否存在）會有差異
 * Valid path symbols in the current environment; they differ per machine
 * depending on which global paths exist
 */
export const validSymbols = getValidPathSymbols();
