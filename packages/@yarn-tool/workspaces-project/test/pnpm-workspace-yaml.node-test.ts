/**
 * `__snapshots__/pnpm-workspace.yaml` 的唯讀測試（node:test + 快照）
 * Read-only tests for `__snapshots__/pnpm-workspace.yaml` (node:test + snapshots)
 *
 * 目的：確認讀取 YAML 時不會破壞原始檔案的格式與註解，並能讀取 `saveWorkspaceProtocol` 設定。
 * 因此測試全程只讀、從不寫回，所以原始註解（含整段被註解掉的設定）必然原封不動。
 *
 * Goal: verify that reading the YAML leaves the file's original formatting and comments intact,
 * and that the `saveWorkspaceProtocol` setting can be read from it. The test is read-only end to
 * end and never writes the file back, so the original comments (including fully commented-out
 * blocks) stay untouched.
 *
 * - 快照記錄原始內容與註解列清單，可直接從快照檔確認註解是否保留。
 *   The snapshot records the raw content and the comment lines, so the snapshot file itself shows
 *   whether the comments survived.
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import { __TEST_FIXTURES } from './__root';

const file = join(__TEST_FIXTURES, 'pnpm-workspace.yaml');

/**
 * 讀取未被註解掉的頂層標量值（`key: value`）。
 * Read a top-level scalar (`key: value`) that has not been commented out.
 *
 * 被註解的行以 `#` 開頭，不會命中 `key:` 前綴，因此不會誤判整段被註解掉的設定。
 * A commented line starts with `#` and never matches the `key:` prefix, so a fully commented-out
 * block is not mistaken for a real setting.
 */
function readTopLevelScalar(source: string, key: string): string | undefined
{
	const prefix = `${key}:`;

	for (const line of source.split(/\r?\n/))
	{
		if (line.startsWith(prefix))
		{
			return line.slice(prefix.length).trim();
		}
	}

	return undefined;
}

/**
 * 收集所有註解列，用來在快照中直接檢視原始註解。
 * Collect every comment line so the original comments can be inspected directly in the snapshot.
 */
function collectComments(source: string): string[]
{
	return source
		.split(/\r?\n/)
		.filter(line => line.trimStart().startsWith('#'));
}

describe(`pnpm-workspace.yaml`, () =>
{
	it(`reads saveWorkspaceProtocol while keeping the original comments`, (t) =>
	{
		// 唯讀：僅讀取文字，絕不寫回，註解因此保留
		// read-only: only the text is read and never written back, so the comments are preserved
		const source = readFileSync(file, 'utf8');

		assert.notStrictEqual(source.length, 0);

		const saveWorkspaceProtocol = readTopLevelScalar(source, 'saveWorkspaceProtocol');
		const comments = collectComments(source);

		const snapshot = {
			saveWorkspaceProtocol,
			comments,
			source,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			saveWorkspaceProtocol: 'false',
		});
	});

});
