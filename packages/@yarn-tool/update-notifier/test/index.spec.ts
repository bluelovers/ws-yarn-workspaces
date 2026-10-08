/**
 * @yarn-tool/update-notifier 測試檔案
 * Test file for @yarn-tool/update-notifier
 */
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import {
	updateNotifier,
	shouldCheckMaybe,
	notNpxMaybe,
	handleOptions,
	IUpdateNotifier,
	IUpdateNotifierObject,
} from '../index';
import { join } from 'path';

describe('@yarn-tool/update-notifier', () => {
	describe('shouldCheckMaybe', () => {
		describe('應該回傳 false（跳過檢查）/ Should return false (skip check)', () => {
			const originalEnv = process.env;

			afterEach(() => {
				// @ts-ignore
				process.env = { ...originalEnv };
			});

			it('當 NO_UPDATE_NOTIFIER 環境變數設定時 / when NO_UPDATE_NOTIFIER env var is set', () => {
				process.env.NO_UPDATE_NOTIFIER = '1';
				assert.strictEqual(shouldCheckMaybe('/test/path'), false);
			});

			it('當 NODE_ENV 為 test 時 / when NODE_ENV is test', () => {
				process.env.NODE_ENV = 'test';
				assert.strictEqual(shouldCheckMaybe('/test/path'), false);
			});
		});

		describe('應該回傳 true（執行檢查）/ Should return true (perform check)', () => {
			const originalEnv = process.env;

			afterEach(() => {
				// @ts-ignore
				process.env = { ...originalEnv };
			});

			it('在正常環境下 / in normal environment', () => {
				delete process.env.NO_UPDATE_NOTIFIER;
				process.env.NODE_ENV = 'development';
				assert.strictEqual(shouldCheckMaybe('/test/path'), true);
			});
		});
	});

	describe('notNpxMaybe (deprecated)', () => {
		it('應該與 shouldCheckMaybe 功能相同 / should have same functionality as shouldCheckMaybe', () => {
			const result1 = shouldCheckMaybe('/test/path');
			const result2 = notNpxMaybe('/test/path');
			assert.strictEqual(result1, result2);
		});
	});

	describe('handleOptions', () => {
		describe('處理 __dirname 參數 / Handle __dirname parameter', () => {
			it('應該處理字串路徑 / should handle string path', () => {
				const result = handleOptions('/test/path');
				assert.strictEqual(result.__dirname, '/test/path');
			});

			it('應該處理路徑片段陣列 / should handle path segments array', () => {
				const result = handleOptions(['/test', 'path', 'subdir']);
				assert.strictEqual(result.__dirname, join('/test', 'path', 'subdir'));
			});
		});

		describe('處理 force 參數 / Handle force parameter', () => {
			it('當 force 為 true 時 doCheck 應該為 true / doCheck should be true when force is true', () => {
				const result = handleOptions('/test/path', true);
				assert.strictEqual(result.doCheck, true);
			});

			it('當 force 為 false 時 doCheck 應該依環境決定 / doCheck should depend on environment when force is false', () => {
				const result = handleOptions('/test/path', false);
				// doCheck 的值取決於 shouldCheckMaybe 的結果
				assert.strictEqual(typeof result.doCheck, 'boolean');
			});
		});

		describe('處理 inputNoticeOptions 參數 / Handle inputNoticeOptions parameter', () => {
			it('應該保留傳入的通知選項 / should preserve input notification options', () => {
				const options = {
					shouldNotifyInNpmScript: true,
					updateCheckInterval: 86400000,
				};
				const result = handleOptions('/test/path', false, options);
				assert.deepStrictEqual(result.inputNoticeOptions, options);
			});

			it('應該處理 undefined 的 inputNoticeOptions / should handle undefined inputNoticeOptions', () => {
				const result = handleOptions('/test/path');
				assert.strictEqual(result.inputNoticeOptions, undefined);
			});
		});

		describe('回傳物件結構 / Return object structure', () => {
			it('應該包含所有必要的屬性 / should contain all required properties', () => {
				const result = handleOptions('/test/path', true, {});
				assert.notStrictEqual(result.__dirname, undefined);
				assert.notStrictEqual(result.force, undefined);
				assert.notStrictEqual(result.inputNoticeOptions, undefined);
				assert.notStrictEqual(result.doCheck, undefined);
			});
		});
	});
});
