/**
 * handleOptions 快照測試
 * Snapshot tests for handleOptions
 *
 * 只驗證選項整理與搜尋順序：不呼叫任何 finder、不建立目錄，測試過程不寫入檔案。
 * Only verifies option resolution and search order: no finder is invoked and no directory is created, so nothing is written.
 */
import { isAbsolute } from 'path';
import { describe, test } from 'node:test';
import { resolve } from 'upath2';

import type { IOptions } from '../lib/types';
import { handleOptions } from '../lib/util';
import { findEnvCachePath } from '../lib/finder/findEnvCachePath';
import { _isPathForSnapshot, _normalizePathForSnapshot } from '../../@yarn-tool/require-resolve/test/lib/test-helper';

/**
 * 自訂快取來源 A / custom cache source A
 * 自訂快取來源 B / custom cache source B
 *
 * 以函式名稱出現在 fnOrder 快照中，用來驗證自訂順序與兜底順序的拼接結果。
 * They appear in the fnOrder snapshot by function name, so the concatenation of custom and fallback orders can be verified.
 */
const customFirst = (cwd?: string) => 'custom-first';
const customSecond = (cwd?: string) => 'custom-second';

/**
 * 取出 fnOrder 的函式名稱 / Read out the function names of fnOrder
 *
 * fnOrder 是函式陣列、序列化時會被略過，
 * 改以名稱快照與斷言，才能看見實際順序。
 * fnOrder is an array of functions which serialization drops,
 * so names are snapshotted and asserted instead to make the actual order visible.
 *
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @returns {string[]} 依序排列的函式名稱 / Function names in order
 */
function _fnOrderNames(options: IOptions): string[]
{
	return [...(options.fnOrder ?? [])].map((fn) => fn.name);
}

/**
 * 快照前整理選項 / Trim options before snapshotting
 *
 * - cwd 若帶 workspace 特徵則改寫為 <ws-yarn-workspaces>/ 前綴，快照不綁死 clone 位置
 * - fnOrder 以函式名稱取代（函式本身序列化時會被略過）
 * - 內容隨機器而變的 process.env 以識別字串取代，其餘 env 則原樣保留
 * cwd carrying a workspace marker is rewritten to the <ws-yarn-workspaces>/ prefix so the snapshot is not tied to the clone location;
 * fnOrder is replaced by function names (functions themselves are dropped by the serializer);
 * the machine-dependent process.env is replaced by a marker string, any other env is kept as-is.
 *
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @returns {object} 可安全序列化的選項內容 / Serializable option contents
 */
function _toSnapshot(options: IOptions)
{
	const cwd = options.cwd;

	return {
		...options,
		cwd: cwd !== undefined && _isPathForSnapshot(cwd) ? _normalizePathForSnapshot(cwd, undefined) : cwd,
		fnOrder: _fnOrderNames(options),
		processEnv: options.processEnv === process.env ? '<process.env>' : options.processEnv,
	};
}

describe('handleOptions', () =>
{
	test('字串參數視為 cwd / a string argument is treated as cwd', (t: test.TestContext) =>
	{
		const options = handleOptions('some/dir');

		/**
		 * cwd 為依執行時 cwd 解析出的絕對路徑，
		 * 快照其標準化結果與尾段，驗證「字串即 cwd」且路徑被統一為正斜線。
		 * cwd is an absolute path resolved against the runtime cwd;
		 * its normalized form and tail are snapshotted to verify "a string means cwd" with unified forward slashes.
		 */
		t.assert.snapshot(_toSnapshot(options));

		t.assert.strictEqual(isAbsolute(options.cwd), true);
		t.assert.strictEqual(options.cwd.endsWith('/some/dir'), true);
		t.assert.strictEqual(options.create, false);
	});

	test('未指定 cwd 時使用 process.cwd() / defaults cwd to process.cwd()', (t: test.TestContext) =>
	{
		const options = handleOptions();

		t.assert.snapshot(_toSnapshot(options));

		t.assert.strictEqual(options.cwd, resolve(process.cwd()));
		t.assert.strictEqual(options.processEnv, process.env);
	});

	test('預設搜尋順序：環境變數與專案內優先 / default order: env var and in-project first', (t: test.TestContext) =>
	{
		const options = handleOptions({ cwd: __dirname });

		t.assert.snapshot(_toSnapshot(options));

		/**
		 * 固定預設順序的契約：明確指定的環境變數來源最前，其次才是專案內路徑，最後為全域快取。
		 * Pins the default-order contract: the explicitly configured env var source leads, then the in-project path, and the global caches come last.
		 */
		t.assert.deepStrictEqual(_fnOrderNames(options), [
			'findEnvCachePath',
			'findPkgModulePath',
			'findYarnCachePath',
			'findNpmCachePath',
			'findOSTempPath',
		]);
	});

	test('useGlobalDefaultFailback 改用全域優先順序 / global-first order when enabled', (t: test.TestContext) =>
	{
		const options = handleOptions({ cwd: __dirname, useGlobalDefaultFailback: true });

		t.assert.snapshot(_toSnapshot(options));

		t.assert.deepStrictEqual(_fnOrderNames(options), [
			'findEnvCachePath',
			'findYarnCachePath',
			'findNpmCachePath',
			'findOSTempPath',
			'findPkgModulePath',
		]);
	});

	test('自訂順序後接預設順序並去重 / custom order followed by the deduped default order', (t: test.TestContext) =>
	{
		const options = handleOptions({
			cwd: __dirname,
			fnOrder: [customFirst, findEnvCachePath, customFirst],
		});

		t.assert.snapshot(_toSnapshot(options));

		/**
		 * 重複的 customFirst 只保留首次出現，
		 * 被併入的 findEnvCachePath 與自訂順序中同一來源也只留一次。
		 * The duplicated customFirst keeps only its first occurrence,
		 * and the merged findEnvCachePath appears once even though it was also given in the custom order.
		 */
		t.assert.deepStrictEqual(_fnOrderNames(options), [
			'customFirst',
			'findEnvCachePath',
			'findPkgModulePath',
			'findYarnCachePath',
			'findNpmCachePath',
			'findOSTempPath',
		]);
	});

	test('disableDefaultFailback 不接兜底順序 / no fallback order appended', (t: test.TestContext) =>
	{
		const options = handleOptions({
			cwd: __dirname,
			fnOrder: [customFirst, customSecond],
			disableDefaultFailback: true,
		});

		t.assert.snapshot(_toSnapshot(options));

		t.assert.deepStrictEqual(_fnOrderNames(options), [
			'customFirst',
			'customSecond',
		]);
	});

	test('自訂順序 + useGlobalDefaultFailback 接全域順序 / custom order plus the global fallback', (t: test.TestContext) =>
	{
		const options = handleOptions({
			cwd: __dirname,
			fnOrder: [customFirst],
			useGlobalDefaultFailback: true,
		});

		t.assert.snapshot(_toSnapshot(options));

		t.assert.deepStrictEqual(_fnOrderNames(options), [
			'customFirst',
			'findEnvCachePath',
			'findYarnCachePath',
			'findNpmCachePath',
			'findOSTempPath',
			'findPkgModulePath',
		]);
	});

	test('create 布林化與 processEnv 透傳 / create coercion and processEnv passthrough', (t: test.TestContext) =>
	{
		const options = handleOptions({
			cwd: __dirname,
			create: 1 as unknown as boolean,
			processEnv: { FOO: 'bar' },
		});

		t.assert.snapshot(_toSnapshot(options));

		t.assert.strictEqual(options.create, true);
		t.assert.strictEqual(handleOptions({ cwd: __dirname }).create, false);
		t.assert.deepStrictEqual(options.processEnv, { FOO: 'bar' });
	});

	test('未指定 processEnv 時沿用 process.env / defaults to process.env', (t: test.TestContext) =>
	{
		/**
		 * 只驗證有無指定都指向同一份 process.env，
		 * 不快照實際環境內容，避免測試綁死執行機器。
		 * Only verifies that both with and without the argument point at the same process.env;
		 * the real environment is never snapshotted, so the test is not tied to the machine.
		 */
		t.assert.strictEqual(handleOptions({ cwd: __dirname }).processEnv, process.env);
		t.assert.strictEqual(handleOptions({ cwd: __dirname, processEnv: undefined }).processEnv, process.env);
	});
});
