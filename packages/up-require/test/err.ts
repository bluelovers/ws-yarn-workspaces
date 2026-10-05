/**
 * Created by user on 2018/9/30/030.
 */

/**
 * 測試用的錯誤產生檔：載入即拋錯，
 * 供測試驗證 require 失敗時錯誤物件的 code 與訊息。
 *
 * Test error fixture: throws on load so tests can verify the code and message
 * of errors produced by a failing require.
 */

/**
 * 刻意在模組載入時拋錯，訊息帶上自身檔案路徑便於對照測試輸出。
 *
 * Throws deliberately at module load; the message includes this file's own
 * path so test output is easy to correlate.
 */
throw new Error(`make a error at ${__filename}`);
