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

import { join } from "path";

export const __ROOT = join(__dirname, '..');

export const isWin = process.platform === "win32";

export const __TEST_ROOT = join(__ROOT, 'test');
export const __TEST_FIXTURES = join(__TEST_ROOT, 'fixtures');
