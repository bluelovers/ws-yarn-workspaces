/**
 * findEnvCachePath 快照測試
 * Snapshot tests for findEnvCachePath
 *
 * 全部以明確傳入的 env 物件呼叫、不讀取實際環境，
 * 因此快照內容不隨執行機器的環境變數而變動。
 * Every call passes an explicit env object instead of reading the real environment,
 * so the snapshots never vary with the machine's environment variables.
 */
import { join } from 'path';
import { describe, test } from 'node:test';

import { envCacheKeys, findEnvCachePath } from '../lib/finder/findEnvCachePath';
import { _isPathForSnapshot, _normalizePathForSnapshot } from '../../@yarn-tool/require-resolve/test/lib/test-helper';

/**
 * 快照前標準化路徑 / Normalize paths before snapshotting
 *
 * 只改寫含 workspace 特徵（ws-yarn-workspaces / node_modules）的路徑，
 * 讓快照不因倉庫 clone 位置不同而變動；其餘路徑保持原樣。
 * Only paths carrying a workspace marker (ws-yarn-workspaces / node_modules) are rewritten,
 * keeping the snapshot stable regardless of where the repo is cloned; all others stay untouched.
 *
 * @param {string} [path] - 待標準化的路徑 / Path to normalize
 * @returns {string} [path] 標準化後的路徑 / The normalized path
 */
function _toSnapshotPath(path?: string)
{
	return path !== undefined && _isPathForSnapshot(path) ? _normalizePathForSnapshot(path, undefined) : path;
}

describe('findEnvCachePath', () =>
{

	test('優先順序：專用在前、通用在後 / priority: specific before generic', (t: test.TestContext) =>
	{
		const all = {
			CACHE_DIR_DEV: '/dev/cache',
			TEMP_DEV: '/temp/dev',
			CACHE_DIR: '/cache',
		};

		t.assert.snapshot({
			allSet: findEnvCachePath(undefined, all),
			noDev: findEnvCachePath(undefined, { TEMP_DEV: all.TEMP_DEV, CACHE_DIR: all.CACHE_DIR }),
			onlyCache: findEnvCachePath(undefined, { CACHE_DIR: all.CACHE_DIR }),
		});

		t.assert.strictEqual(findEnvCachePath(undefined, all), '/dev/cache');
		t.assert.strictEqual(findEnvCachePath(undefined, { TEMP_DEV: '/temp/dev', CACHE_DIR: '/cache' }), '/temp/dev');
		t.assert.strictEqual(findEnvCachePath(undefined, { CACHE_DIR: '/cache' }), '/cache');
	});

	test('空白值視為未設定 / blank values count as unset', (t: test.TestContext) =>
	{
		/**
		 * 空字串與純空白都視為未設定，
		 * 避免 CACHE_DIR_DEV="" 這類空白設定搶走後面較通用的來源。
		 * Both empty and whitespace-only values count as unset,
		 * so a blank CACHE_DIR_DEV="" never steals priority from the more generic sources.
		 */
		t.assert.snapshot({
			emptyDev: findEnvCachePath(undefined, { CACHE_DIR_DEV: '', TEMP_DEV: '/temp/dev', CACHE_DIR: '/cache' }),
			blankDevAndTemp: findEnvCachePath(undefined, { CACHE_DIR_DEV: '   ', TEMP_DEV: '\t', CACHE_DIR: ' /cache ' }),
			allBlank: findEnvCachePath(undefined, { CACHE_DIR_DEV: '', TEMP_DEV: '', CACHE_DIR: ' ' }) ?? '<undefined>',
		});

		t.assert.strictEqual(findEnvCachePath(undefined, { CACHE_DIR_DEV: '', CACHE_DIR: '/cache' }), '/cache');
		t.assert.strictEqual(findEnvCachePath(undefined, { CACHE_DIR_DEV: ' ' }), undefined);
	});

	test('完全未設定時回傳 undefined / undefined when nothing is set', (t: test.TestContext) =>
	{
		t.assert.snapshot({
			emptyEnv: findEnvCachePath(undefined, {}) ?? '<undefined>',
			unrelatedEnv: findEnvCachePath(undefined, { PATH: '/usr/bin', HOME: '/home/user' }) ?? '<undefined>',
		});

		t.assert.strictEqual(findEnvCachePath(undefined, {}), undefined);
		t.assert.strictEqual(findEnvCachePath(undefined, { PATH: '/usr/bin' }), undefined);
	});

	test('路徑正規化與快照標準化 / path normalization and snapshot standardization', (t: test.TestContext) =>
	{
		/**
		 * workspace 內的路徑帶有 ws-yarn-workspaces 特徵，
		 * 經 helper 改寫成 <ws-yarn-workspaces>/ 前綴後，快照不隨 clone 位置變動。
		 * A workspace path carries the ws-yarn-workspaces marker;
		 * rewriting it to the <ws-yarn-workspaces>/ prefix keeps the snapshot stable across clone locations.
		 */
		const workspaceCache = join(__dirname, '..', 'node_modules', '.cache');

		t.assert.snapshot({
			workspace: _toSnapshotPath(findEnvCachePath(undefined, { CACHE_DIR: workspaceCache })),
			windowsStyle: findEnvCachePath(undefined, { CACHE_DIR_DEV: 'C:\\dev\\cache' }),
			relativeStyle: findEnvCachePath(undefined, { TEMP_DEV: 'tmp/dev' }),
		});

		t.assert.strictEqual(findEnvCachePath(undefined, { CACHE_DIR_DEV: 'C:\\dev\\cache' }), 'C:/dev/cache');
		t.assert.strictEqual(
			_toSnapshotPath(findEnvCachePath(undefined, { CACHE_DIR: workspaceCache })),
			'<ws-yarn-workspaces>/packages/cache-path/node_modules/.cache',
		);
	});

	test('未傳 processEnv 時沿用 process.env / defaults to process.env', (t: test.TestContext) =>
	{
		/**
		 * 只比較「有傳與沒傳是否一致」，
		 * 不快照實際環境內容，避免測試綁死執行機器。
		 * Only compares "with versus without the argument";
		 * the real environment is never snapshotted, so the test is not tied to the machine.
		 */
		t.assert.strictEqual(findEnvCachePath(undefined), findEnvCachePath(undefined, process.env));
	});
});
