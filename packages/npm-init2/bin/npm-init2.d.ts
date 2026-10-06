#!/usr/bin/env node
/**
 * CLI 入口：僅載入主模組以執行初始化流程，
 * 實際邏輯全部在 index.ts，此檔對應 package.json 的 bin 欄位
 *
 * CLI entry: only loads the main module to run the init flow; all logic lives in index.ts and
 * this file is what the package.json `bin` field points at
 */
import '..';
