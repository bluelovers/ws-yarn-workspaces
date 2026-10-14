/**
 * normalizeName 快照測試
 * Snapshot tests for normalizeName
 *
 * 只涵蓋純字串轉換與雜湊運算：不接觸檔案系統，測試過程不建立、也不寫入任何檔案。
 * Only covers pure string conversion and hashing: nothing touches the filesystem, so the run creates and writes nothing.
 */
import { describe, test } from 'node:test';

import { normalizeName } from '../lib/normalizeName';

/**
 * 擷取錯誤訊息作為可快照值
 * Capture an error message as a snapshot-friendly value
 *
 * 直接快照 Error 會帶上與機器相關的堆疊字串，
 * 因此只取 message，讓快照跨機器穩定。
 * Snapshotting an Error would drag in machine-specific stack text,
 * so only the message is taken to keep the snapshot stable across machines.
 *
 * @param {() => unknown} fn - 可能拋錯的函式 / Function that may throw
 * @returns {string} 錯誤訊息，未拋錯時回傳 '<no throw>' / The error message, or '<no throw>' when nothing was thrown
 */
function _errorMessage(fn: () => unknown): string
{
	try
	{
		fn();
	}
	catch (e)
	{
		return (e as Error).message;
	}

	return '<no throw>';
}

describe('normalizeName', () =>
{
	test('一般名稱的轉換規則 / conversion rules for plain names', (t: test.TestContext) =>
	{
		/**
		 * 快照記錄完整轉換結果，作為可讀的行為文件；
		 * 下方的 strictEqual 才是真正會失敗的斷言。
		 * The snapshot records full outputs as readable behavioral documentation;
		 * the strictEqual below are the assertions that can actually fail.
		 */
		t.assert.snapshot([
			normalizeName('cache'),
			normalizeName('  my-cache  '),
			normalizeName('My Cache'),
			normalizeName('foo.bar..baz'),
			normalizeName('a__b___c'),
			normalizeName('@scope/package-name'),
			normalizeName('中文-名稱'),
			normalizeName('a b', false),
		]);

		t.assert.strictEqual(normalizeName('  my-cache  '), 'my-cache');
		t.assert.strictEqual(normalizeName('My Cache'), 'My_Cache');
		t.assert.strictEqual(normalizeName('foo.bar..baz'), 'foo_bar_baz');
		t.assert.strictEqual(normalizeName('a__b___c'), 'a_b_c');
		t.assert.strictEqual(normalizeName('@scope/package-name'), '_scope_package-name');
	});

	test('雜湊模式 / hash mode', (t: test.TestContext) =>
	{
		/**
		 * 內建 hash-sum 的輸出為穩定值，可直接快照；
		 * 自訂函數則用來驗證「原樣回傳、不做後處理」的契約。
		 * The built-in hash-sum output is stable and snapshot-safe;
		 * the custom function verifies the "returned as-is with no post-processing" contract.
		 */
		t.assert.snapshot({
			builtIn: normalizeName('@scope/package-name', true),
			custom: normalizeName('my-cache', (input) => `custom(${input.length})`),
		});

		t.assert.strictEqual(normalizeName('my-cache', (input) => `custom(${input.length})`), 'custom(8)');
		t.assert.notStrictEqual(normalizeName('my-cache', true), normalizeName('@scope/package-name', true));
	});

	test('不安全名稱拋錯 / unsafe names throw', (t: test.TestContext) =>
	{
		/**
		 * 快照四個案例的錯誤訊息，可同時看出「哪些輸入會失敗」與失敗原因。
		 * Snapshots the messages of four cases, showing both which inputs fail and why.
		 */
		t.assert.snapshot([
			_errorMessage(() => normalizeName('!!!')),
			_errorMessage(() => normalizeName('   ')),
			_errorMessage(() => normalizeName('___')),
			_errorMessage(() => normalizeName('@#/')),
		]);

		t.assert.throws(() => normalizeName('!!!'), /unsafe normalizeName/);
		t.assert.throws(() => normalizeName('   '), /unsafe normalizeName/);
		t.assert.strictEqual(_errorMessage(() => normalizeName('ok')), '<no throw>');
	});
});
