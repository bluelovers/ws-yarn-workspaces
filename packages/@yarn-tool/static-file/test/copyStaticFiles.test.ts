/**
 * @yarn-tool/static-file 快照測試
 * Snapshot tests for @yarn-tool/static-file
 *
 * 只涵蓋不會寫入檔案的內部函式：選項補齊與清單產出皆為唯讀操作，
 * 因此測試過程不建立、也不覆蓋任何靜態檔案。
 * Only covers internals that never write files: option resolution and list generation are read-only,
 * so the run creates and overwrites nothing.
 */
import { describe, test } from 'node:test';

import { _copyStaticFilesCoreListGenerator, _handleCopyStaticFilesOptions } from '../lib/copyStaticFiles';
import { _isPathForSnapshot, _normalizePathForSnapshot } from '../../require-resolve/test/lib/test-helper';

/**
 * 以測試檔所在目錄作為唯一必填的 cwd
 * Use the test file's own directory as the sole required cwd
 *
 * 該目錄必然存在，且不含預設清單中任何 detectFile 指向的檔案，
 * 使快照內容不因執行環境而變動。
 * The directory always exists and holds none of the detectFile targets from the default list,
 * keeping the snapshot independent of the execution environment.
 */
const cwd = __dirname;

/**
 * 快照前標準化路徑 / Normalize paths before snapshotting
 *
 * 僅改寫含 workspace 特徵的絕對路徑；entry 內的相對路徑保持原樣
 * Only absolute paths carrying a workspace marker are rewritten; relative paths inside entry stay untouched
 */
function _toSnapshotPath(path: string)
{
	return _isPathForSnapshot(path) ? _normalizePathForSnapshot(path, undefined) : path;
}

describe('_handleCopyStaticFilesOptions', () =>
{
	test('預設值 + 必填參數 / defaults with only the required param', (t) =>
	{
		const actual = _handleCopyStaticFilesOptions({ cwd });

		const snapshot = {
			...actual,
			cwd: _toSnapshotPath(actual.cwd),
			staticRoot: _toSnapshotPath(actual.staticRoot),
		};

		t.assert.snapshot(snapshot);
	});
});

describe('_copyStaticFilesCoreListGenerator', () =>
{
	test('預設值 + 必填參數 / defaults with only the required param', (t) =>
	{
		/**
		 * 保留實際產出的結構（entry / runtime / copy），只標準化 runtime 內的絕對路徑；
		 * copy 是函式、序列化時會被略過，故以 typeof 取代其值讓鍵的存在仍可見；
		 * 刻意不呼叫 copy()，因此測試不會寫入任何檔案。
		 * Keep the yielded shape (entry / runtime / copy) as-is and only normalize the absolute paths inside runtime;
		 * copy is a function and would be dropped by the serializer, so its value is replaced by typeof to keep the key visible;
		 * copy() is deliberately never called, so nothing is written.
		 */
		const snapshot = [..._copyStaticFilesCoreListGenerator({ cwd })]
			.map((item) => ({
				...item,
				runtime: {
					...item.runtime,
					targetFileFull: _toSnapshotPath(item.runtime.targetFileFull),
					staticFileFull: _toSnapshotPath(item.runtime.staticFileFull),
				},
				copy: typeof item.copy,
			}));

		t.assert.snapshot(snapshot);
	});
});
