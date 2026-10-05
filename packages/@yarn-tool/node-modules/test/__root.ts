/**
 * 測試輔助：套件根目錄路徑與執行平台判斷
 * Test helpers: package root path and runtime platform detection
 */

import { join } from "path";

/**
 * 套件根目錄的絕對路徑，供測試定位 fixtures 與產出檔案
 * Absolute path of the package root, used by tests to locate fixtures and outputs
 */
export const __ROOT = join(__dirname, '..');

/**
 * 是否執行於 Windows，用於需要平台分支的測試案例
 * Whether running on Windows, used by test cases that branch per platform
 */
export const isWin = process.platform === "win32";
