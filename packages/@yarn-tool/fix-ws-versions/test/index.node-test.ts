/**
 * @yarn-tool/fix-ws-versions 原生測試（node:test + 快照）
 * Native tests for @yarn-tool/fix-ws-versions (node:test + snapshots)
 *
 * - 所有輸入皆為記憶體內建構的假資料，不讀取、不修改任何實際環境檔案。
 *   All inputs are in-memory fixtures; no real environment file is read or modified.
 * - 以 t.assert.snapshot() 快照實際執行結果。
 *   Actual results are snapshotted via t.assert.snapshot().
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

import { fixPkgDepsVersionsCore, fixWsVersionsCore, handleRuntimeCache } from '../index';
import type { IListableRowExtraWithDeps } from 'ws-pkg-list/lib/types';

/**
 * 建立記憶體內的 workspace 列資料（每次呼叫皆為全新物件）
 * Create in-memory workspace rows (fresh objects on every call)
 *
 * - `lodash` 不屬於 workspace，應被忽略 / `lodash` is not a workspace package and should be ignored
 * - `@demo/b` 的 `*` 應被跳過 / the `*` of `@demo/b` should be skipped
 */
function createListable(): IListableRowExtraWithDeps[]
{
	return [
		{
			name: '@demo/a',
			version: '1.2.0',
			private: false,
			location: 'packages/a',
			manifestLocation: 'packages/a/package.json',
			prefix: 'packages/a',
			dependencies: {
				'@demo/b': '^1.0.0',
				'lodash': '^4.17.21',
			},
		},
		{
			name: '@demo/b',
			version: '1.1.0',
			private: false,
			location: 'packages/b',
			manifestLocation: 'packages/b/package.json',
			prefix: 'packages/b',
			dependencies: {
				'@demo/a': '1.2.0',
			},
		},
		{
			name: '@demo/c',
			version: '2.0.0',
			private: true,
			location: 'packages/c',
			manifestLocation: 'packages/c/package.json',
			prefix: 'packages/c',
			dependencies: {
				'@demo/b': '*',
			},
			devDependencies: {
				'@demo/a': '^1.0.0',
			},
			peerDependencies: {
				'@demo/a': '>=1.0.0',
			},
		},
	];
}

describe('handleRuntimeCache', () =>
{
	it('from listable: builds record / names / empty map', (t) =>
	{
		const listable = createListable();
		const cache = handleRuntimeCache({ listable });

		assert.strictEqual(cache.listable, listable);
		assert.deepStrictEqual(cache.record, {
			'@demo/a': listable[0],
			'@demo/b': listable[1],
			'@demo/c': listable[2],
		});

		t.assert.snapshot({
			names: cache.names,
			map: cache.map,
		});
	});

	it('from record: keeps given record and fills names / map', (t) =>
	{
		const record = {
			'@demo/a': {
				name: '@demo/a',
				version: '1.2.0',
				private: false,
				location: 'packages/a',
				manifestLocation: 'packages/a/package.json',
			},
		};

		const cache = handleRuntimeCache({ record });

		// 提供的 record 應原樣保留（不重新建構）/ the given record must be kept as-is
		assert.strictEqual(cache.record, record);
		assert.strictEqual(cache.listable, undefined);

		t.assert.snapshot({
			names: cache.names,
			map: cache.map,
		});
	});

	it('reuses pre-initialized fields and returns the same object', (t) =>
	{
		const listable = createListable();
		const others = [listable[1]];
		const map = {
			changed: [listable[0]],
			others,
			data: { '@demo/b': '1.1.0' },
		};

		const input = { listable, map } as const;
		const cache = handleRuntimeCache(input);

		assert.strictEqual(cache, input);
		assert.strictEqual(cache.map.others, others);
		assert.deepStrictEqual(cache.map.changed, [listable[0]]);
		assert.deepStrictEqual(cache.map.data, { '@demo/b': '1.1.0' });

		t.assert.snapshot({
			names: cache.names,
			map: cache.map,
		});
	});
});

describe('fixPkgDepsVersionsCore', () =>
{
	it('updates internal dep version to current and records data', (t) =>
	{
		const listable = createListable();
		const row = {
			dependencies: {
				'@demo/b': '^1.0.0',
			},
		};

		const result = fixPkgDepsVersionsCore(row, { listable });

		assert.strictEqual(result.changed, true);
		assert.strictEqual(result.row, row);

		t.assert.snapshot({
			changed: result.changed,
			row,
			data: result.map.data,
		});
	});

	it('leaves row untouched when version already matches', (t) =>
	{
		const listable = createListable();
		const row = {
			dependencies: {
				'@demo/b': '^1.1.0',
			},
		};

		const result = fixPkgDepsVersionsCore(row, { listable });

		// 沒有任何變更時 changed 不會被賦值 / `changed` is never assigned when nothing changed
		assert.strictEqual(result.changed, undefined);

		t.assert.snapshot({
			changed: result.changed,
			row,
			data: result.map.data,
		});
	});

	it('skips wildcard and non-workspace deps without throwing', (t) =>
	{
		const listable = createListable();
		const row = {
			dependencies: {
				'@demo/a': '*',
				'left-pad': '1.0.0',
			},
		};

		const result = fixPkgDepsVersionsCore(row, { listable });

		assert.strictEqual(result.changed, undefined);
		assert.deepStrictEqual(row.dependencies, {
			'@demo/a': '*',
			'left-pad': '1.0.0',
		});

		t.assert.snapshot({
			changed: result.changed,
			row,
			data: result.map.data,
		});
	});

	it('works with record-only cache and accumulates data across calls', (t) =>
	{
		const record = {
			'@demo/a': {
				name: '@demo/a',
				version: '1.2.0',
				private: false,
				location: 'packages/a',
				manifestLocation: 'packages/a/package.json',
			},
			'@demo/b': {
				name: '@demo/b',
				version: '1.1.0',
				private: false,
				location: 'packages/b',
				manifestLocation: 'packages/b/package.json',
			},
		};

		const cache = { record };
		const rowA = { dependencies: { '@demo/b': '^1.0.0' } };
		const rowC = { devDependencies: { '@demo/a': '^1.0.0' } };

		const first = fixPkgDepsVersionsCore(rowA, cache);
		const second = fixPkgDepsVersionsCore(rowC, cache);

		// 同一份 cache 會被重複使用 / the same cache is reused across calls
		assert.strictEqual(second.map, first.map);

		t.assert.snapshot({
			rowA,
			rowC,
			data: second.map.data,
		});
	});
});

describe('fixWsVersionsCore', () =>
{
	it('syncs internal dep versions and splits changed / others', (t) =>
	{
		const listable = createListable();
		const result = fixWsVersionsCore(listable, 'D:/fake/workspace');

		assert.strictEqual(result.listable, listable);
		assert.strictEqual(result.cwd, 'D:/fake/workspace');
		assert.deepStrictEqual(result.names, ['@demo/a', '@demo/b', '@demo/c']);
		assert.deepStrictEqual(result.changed.map((row) => row.name), ['@demo/a', '@demo/c']);
		assert.deepStrictEqual(result.others.map((row) => row.name), ['@demo/b']);

		// 非 workspace 套件與萬用字元不應被改寫 / non-workspace deps and wildcards must stay untouched
		assert.deepStrictEqual(listable[0].dependencies, {
			'@demo/b': '^1.1.0',
			'lodash': '^4.17.21',
		});
		assert.deepStrictEqual(listable[1].dependencies, { '@demo/a': '1.2.0' });
		assert.deepStrictEqual(listable[2].dependencies, { '@demo/b': '*' });
		assert.deepStrictEqual(listable[2].devDependencies, { '@demo/a': '^1.2.0' });

		t.assert.snapshot(result);
	});

	it('reports no changes when every version already matches', (t) =>
	{
		const listable = createListable();
		listable[0].dependencies['@demo/b'] = '^1.1.0';
		listable[2].devDependencies['@demo/a'] = '^1.2.0';
		listable[2].peerDependencies['@demo/a'] = '>=1.2.0';

		const result = fixWsVersionsCore(listable);

		assert.strictEqual(result.cwd, undefined);
		assert.deepStrictEqual(result.changed, []);
		assert.deepStrictEqual(result.others.map((row) => row.name), ['@demo/a', '@demo/b', '@demo/c']);

		t.assert.snapshot(result);
	});
});

/**
 * 套件實際版本為 3.0.0 / 2.1.0 / 1.5.0，
 * 但作為依賴被引用時仍寫著 1.0.0 / ^1.0.0 / >=1.0.0 的狀況。
 * Packages are at 3.0.0 / 2.1.0 / 1.5.0 while referenced as 1.0.0 / ^1.0.0 / >=1.0.0.
 */
describe('stale 1.x references to newer workspace versions', () =>
{
	function createStaleListable(): IListableRowExtraWithDeps[]
	{
		return [
			{
				name: '@demo/x',
				version: '3.0.0',
				private: false,
				location: 'packages/x',
				manifestLocation: 'packages/x/package.json',
				prefix: 'packages/x',
			},
			{
				name: '@demo/y',
				version: '2.1.0',
				private: false,
				location: 'packages/y',
				manifestLocation: 'packages/y/package.json',
				prefix: 'packages/y',
			},
			{
				name: '@demo/z',
				version: '1.5.0',
				private: false,
				location: 'packages/z',
				manifestLocation: 'packages/z/package.json',
				prefix: 'packages/z',
			},
			{
				name: '@demo/app',
				version: '1.0.0',
				private: false,
				location: 'packages/app',
				manifestLocation: 'packages/app/package.json',
				prefix: 'packages/app',
				dependencies: {
					'@demo/x': '1.0.0',
					'@demo/y': '^1.0.0',
					'@demo/z': '>=1.0.0',
				},
			},
		];
	}

	it('fixPkgDepsVersionsCore: rewrites 1.0.0 / ^1.0.0 / >=1.0.0 ranges', (t) =>
	{
		const listable = createStaleListable();
		const row = {
			dependencies: {
				'@demo/x': '1.0.0',
				'@demo/y': '^1.0.0',
				'@demo/z': '>=1.0.0',
			},
		};

		const result = fixPkgDepsVersionsCore(row, { listable });

		assert.strictEqual(result.changed, true);

		t.assert.snapshot({
			changed: result.changed,
			row,
			data: result.map.data,
		});
	});

	it('fixWsVersionsCore: only the referencing package is marked changed', (t) =>
	{
		const listable = createStaleListable();

		const result = fixWsVersionsCore(listable, 'D:/fake/stale-workspace');

		assert.deepStrictEqual(result.changed.map((row) => row.name), ['@demo/app']);
		assert.deepStrictEqual(result.others.map((row) => row.name), ['@demo/x', '@demo/y', '@demo/z']);
		assert.deepStrictEqual(listable[3].dependencies, {
			'@demo/x': '3.0.0',
			'@demo/y': '^2.1.0',
			'@demo/z': '>=1.5.0',
		});

		t.assert.snapshot(result);
	});

	it('fixWsVersionsCore: second run is a no-op', (t) =>
	{
		const listable = createStaleListable();

		fixWsVersionsCore(listable);
		const second = fixWsVersionsCore(listable);

		assert.deepStrictEqual(second.changed, []);
		assert.deepStrictEqual(second.others.map((row) => row.name), ['@demo/x', '@demo/y', '@demo/z', '@demo/app']);

		t.assert.snapshot(second);
	});
});
