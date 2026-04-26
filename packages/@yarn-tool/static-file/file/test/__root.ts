/**
 * 測試路徑架構 / Test Path Structure
 *
 * test/
 * ├── fixtures/              ← 測試資料夾（唯讀）
 * └── temp/                 ← 臨時檔案（可寫，永遠建立子資料夾）
 *     ├── fake-lib/
 *     └── temp-pkg/
 */
/// <reference types="node" />
import path from 'upath2';
// @ts-ignore
import { __ROOT_CORE as __ROOT } from './__root-core.cjs';

/**
 * 專案根目錄
 */
export { __ROOT }

export const isWin = process.platform === "win32";

/**
 * 測試資料夾
 *
 * @default test
 */
export const __TEST_ROOT = path.join(__ROOT, 'test');

/**
 * 測試資料夾（唯讀）
 *
 * @default test/fixtures
 */
export const __TEST_FIXTURES = path.join(__TEST_ROOT, 'fixtures');

/**
 * 臨時檔案（可寫，永遠建立子資料夾）
 *
 * test/
 * ├── fixtures/              ← 測試資料夾（唯讀）
 * └── temp/                 ← 臨時檔案（可寫，永遠建立子資料夾）
 *     ├── fake-lib/
 *     └── temp-pkg/
 *
 * @default test/temp
 */
export const __TEST_TEMP = path.join(__TEST_ROOT, 'temp');
