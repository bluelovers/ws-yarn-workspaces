/**
 * @yarn-tool/fix-ws-versions 原生測試（node:test + 快照）
 * Native tests for @yarn-tool/fix-ws-versions (node:test + snapshots)
 *
 * - 所有輸入皆為記憶體內建構的假資料，不讀取、不修改任何實際環境檔案。
 *   All inputs are in-memory fixtures; no real environment file is read or modified.
 * - 所有測試共用同一組基底測試資料 {@link createListable}；
 *   測試之間的差異只來自「取用哪一列」與「傳入哪些選項」，而非各自定義資料。
 *   Every test shares one base fixture {@link createListable}; the difference between tests
 *   comes only from which row is taken and which options are passed, never from re-defined data.
 * - 每個 t.assert.snapshot() 都搭配 t.assert.partialDeepStrictEqual() 進行驗證，
 *   避免快照被 --test-update-snapshots 自動更新後失去攔截效果。
 *   Every t.assert.snapshot() is paired with t.assert.partialDeepStrictEqual(), so a snapshot
 *   silently re-written by --test-update-snapshots cannot swallow a regression.
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

import {
	fixPkgDepsVersionsCore,
	fixWsVersionsCore,
	handleRuntimeCache,
	handleOptionsFixWsVersions,
	DEFAULT_WORKSPACE_PROTOCOL,
	getWorkspaceProtocol,
	isWorkspaceProtocol,
	isWorkspaceProtocolBareRange,
	parseWorkspaceProtocol,
	workspaceProtocolToRange,
	rangeToWorkspaceProtocol,
} from '../index';
import type { IListableRowExtraWithDeps } from 'ws-pkg-list/lib/types';

/**
 * 基底測試資料（唯一的資料來源，所有測試共用）
 * The one base fixture shared by every test
 *
 * 同時包含「有 Workspace protocol」與「無 protocol」的依賴引用：
 * Both Workspace-protocol and plain (non-protocol) dependency references are present:
 *
 * - `[0] @demo/a` 無依賴，永遠落在 others / no dependencies, always lands in `others`
 * - `[1] @demo/b` 無 protocol 且已與實際版本相符 / plain range, already aligned
 * - `[2] @demo/c` 只有萬用字元與非 workspace 套件（lodash）/ only a wildcard and a non-workspace package
 * - `[3] @demo/d` 無 protocol、過時的 1.x 引用 / plain, stale 1.x reference
 * - `[4] @demo/app` 主要引用者：無 protocol（含過時與非 workspace）+ 有 protocol
 *   （bare operator、明確版本、過時版本）/ the main referencer: plain refs (stale + non-workspace)
 *   and protocol refs (bare operators, explicit version, stale version)
 */
function createListable(): IListableRowExtraWithDeps[]
{
	return [
		{
			name: '@demo/a',
			version: '1.5.0',
			private: false,
			location: 'packages/a',
			manifestLocation: 'packages/a/package.json',
			prefix: 'packages/a',
		},
		{
			name: '@demo/b',
			version: '2.1.0',
			private: false,
			location: 'packages/b',
			manifestLocation: 'packages/b/package.json',
			prefix: 'packages/b',
			dependencies: {
				// 無 protocol、已與實際版本相符 / plain, already aligned
				'@demo/a': '1.5.0',
			},
		},
		{
			name: '@demo/c',
			version: '3.0.0',
			private: true,
			location: 'packages/c',
			manifestLocation: 'packages/c/package.json',
			prefix: 'packages/c',
			dependencies: {
				// 萬用字元 → 跳過 / wildcard → skipped
				'@demo/a': '*',
				// 非 workspace → 忽略 / non-workspace → ignored
				'lodash': '^4.17.21',
			},
		},
		{
			name: '@demo/d',
			version: '1.1.0',
			private: false,
			location: 'packages/d',
			manifestLocation: 'packages/d/package.json',
			prefix: 'packages/d',
			dependencies: {
				// 無 protocol、過時 / plain, stale
				'@demo/a': '^1.0.0',
			},
		},
		{
			name: '@demo/app',
			version: '1.0.0',
			private: false,
			location: 'packages/app',
			manifestLocation: 'packages/app/package.json',
			prefix: 'packages/app',
			dependencies: {
				// 無 protocol、過時的 1.x 引用 / plain, stale 1.x references
				'@demo/a': '1.0.0',
				'@demo/b': '^1.0.0',
				'@demo/c': '>=1.0.0',
				// 非 workspace → 忽略 / non-workspace → ignored
				'lodash': '^4.17.21',
			},
			devDependencies: {
				// 有 protocol、bare operator / with protocol, bare operators
				'@demo/a': 'workspace:*',
				'@demo/b': 'workspace:^',
				'@demo/c': 'workspace:~',
				// 有 protocol 但非 workspace → 忽略 / with protocol but non-workspace → ignored
				'lodash': 'workspace:^4.17.21',
			},
			peerDependencies: {
				// 有 protocol、明確版本且已相符 / with protocol, explicit, already aligned
				'@demo/a': 'workspace:^1.5.0',
				// 有 protocol、明確版本但過時 / with protocol, explicit, stale
				'@demo/b': 'workspace:^1.0.0',
				// 萬用字元 → 跳過 / wildcard → skipped
				'@demo/c': '*',
			},
		},
	];
}

/** 基底資料中的套件名稱順序 / package name order of the base fixture */
const NAMES = [
	'@demo/a',
	'@demo/b',
	'@demo/c',
	'@demo/d',
	'@demo/app',
] as const;

describe('handleRuntimeCache', () =>
{
	it('from listable: builds record / names / empty map', (t) =>
	{
		const listable = createListable();
		const cache = handleRuntimeCache({ listable });

		assert.strictEqual(cache.listable, listable);
		t.assert.partialDeepStrictEqual(cache.record, {
			'@demo/a': listable[0],
			'@demo/b': listable[1],
			'@demo/c': listable[2],
			'@demo/d': listable[3],
			'@demo/app': listable[4],
		});

		const snapshot = {
			names: cache.names,
			map: cache.map,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			names: NAMES,
			map: { changed: [], others: [], data: {} },
		});
	});

	it('from record: keeps given record and fills names / map', (t) =>
	{
		const listable = createListable();
		// 取自基底資料，而非另行定義 / taken from the base fixture instead of re-defined
		const record = { '@demo/a': listable[0] };

		const cache = handleRuntimeCache({ record });

		// 提供的 record 應原樣保留（不重新建構）/ the given record must be kept as-is
		assert.strictEqual(cache.record, record);
		assert.strictEqual(cache.listable, undefined);

		const snapshot = {
			names: cache.names,
			map: cache.map,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			names: ['@demo/a'],
			map: { changed: [], others: [], data: {} },
		});
	});

	it('reuses pre-initialized fields and returns the same object', (t) =>
	{
		const listable = createListable();
		const others = [listable[1]];
		const map = {
			changed: [listable[0]],
			others,
			data: { '@demo/a': '1.5.0' },
		};

		const input = { listable, map } as const;
		const cache = handleRuntimeCache(input);

		assert.strictEqual(cache, input);
		assert.strictEqual(cache.map.others, others);
		t.assert.partialDeepStrictEqual(cache.map, {
			changed: [{ name: '@demo/a' }],
			others: [{ name: '@demo/b' }],
			data: { '@demo/a': '1.5.0' },
		});

		const snapshot = {
			names: cache.names,
			map: cache.map,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			names: NAMES,
			map: {
				changed: [{ name: '@demo/a' }],
				others: [{ name: '@demo/b' }],
				data: { '@demo/a': '1.5.0' },
			},
		});
	});
});

describe('fixPkgDepsVersionsCore', () =>
{
	it('updates internal dep version to current and records data', (t) =>
	{
		const listable = createListable();
		// 基底資料 [3]：無 protocol、過時的 1.x 引用 / base fixture [3]: plain stale 1.x reference
		const row = { dependencies: { ...listable[3].dependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable });

		assert.strictEqual(result.changed, true);
		assert.strictEqual(result.row, row);

		const snapshot = {
			changed: result.changed,
			row,
			data: result.map.data,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: true,
			row: { dependencies: { '@demo/a': '^1.5.0' } },
			data: { '@demo/a': '1.5.0' },
		});
	});

	it('leaves row untouched when version already matches', (t) =>
	{
		const listable = createListable();
		// 基底資料 [1]：已相符的 plain 引用 / base fixture [1]: aligned plain reference
		const row = { dependencies: { ...listable[1].dependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable });

		// 沒有任何變更時 changed 不會被賦值 / `changed` is never assigned when nothing changed
		assert.strictEqual(result.changed, undefined);

		const snapshot = {
			changed: result.changed,
			row,
			data: result.map.data,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: undefined,
			row: { dependencies: { '@demo/a': '1.5.0' } },
			data: {},
		});
	});

	it('skips wildcard and non-workspace deps without throwing', (t) =>
	{
		const listable = createListable();
		// 基底資料 [2]：只有萬用字元與非 workspace 套件 / base fixture [2]: wildcard + non-workspace only
		const row = { dependencies: { ...listable[2].dependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable });

		assert.strictEqual(result.changed, undefined);

		const snapshot = {
			changed: result.changed,
			row,
			data: result.map.data,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: undefined,
			row: {
				dependencies: {
					'@demo/a': '*',
					'lodash': '^4.17.21',
				},
			},
			data: {},
		});
	});

	it('works with record-only cache and accumulates data across calls', (t) =>
	{
		const listable = createListable();
		const { record } = handleRuntimeCache({ listable });
		const cache = { record };

		// 兩次呼叫都取自基底資料 [4] 的不同依賴欄位
		// both calls take a different dependency field of base fixture [4]
		const peerRow = { peerDependencies: { ...listable[4].peerDependencies! } };
		const depRow = { dependencies: { ...listable[4].dependencies! } };

		const first = fixPkgDepsVersionsCore(peerRow, cache);
		const second = fixPkgDepsVersionsCore(depRow, cache);

		assert.strictEqual(first.changed, true);
		assert.strictEqual(second.changed, true);
		// 同一份 cache 會被重複使用 / the same cache is reused across calls
		assert.strictEqual(second.map, first.map);

		const snapshot = {
			peerRow,
			depRow,
			data: second.map.data,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			peerRow: {
				peerDependencies: {
					'@demo/a': '^1.5.0',
					'@demo/b': '^2.1.0',
					'@demo/c': '*',
				},
			},
			depRow: {
				dependencies: {
					'@demo/a': '1.5.0',
					'@demo/b': '^2.1.0',
					'@demo/c': '>=3.0.0',
					'lodash': '^4.17.21',
				},
			},
			// 第二次呼叫補上第一次未接觸到的 `@demo/c`
			// the second call adds `@demo/c`, which the first call never touched
			data: {
				'@demo/a': '1.5.0',
				'@demo/b': '2.1.0',
				'@demo/c': '3.0.0',
			},
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

		t.assert.snapshot(result);
		t.assert.partialDeepStrictEqual(result, {
			names: NAMES,
			// 有過時引用的列會被標記變更 / rows holding stale references are marked changed
			changed: [{ name: '@demo/d' }, { name: '@demo/app' }],
			others: [{ name: '@demo/a' }, { name: '@demo/b' }, { name: '@demo/c' }],
			data: {
				'@demo/a': '1.5.0',
				'@demo/b': '2.1.0',
				'@demo/c': '3.0.0',
			},
		});

		// 已相符、萬用字元與非 workspace 套件不應被改寫
		// aligned / wildcard / non-workspace references must stay untouched
		t.assert.partialDeepStrictEqual(listable[1].dependencies, { '@demo/a': '1.5.0' });
		t.assert.partialDeepStrictEqual(listable[2].dependencies, {
			'@demo/a': '*',
			'lodash': '^4.17.21',
		});

		// 無 protocol 的過時引用會同步為實際版本
		// stale plain references are synced to the actual versions
		t.assert.partialDeepStrictEqual(listable[3].dependencies, { '@demo/a': '^1.5.0' });
		t.assert.partialDeepStrictEqual(listable[4].dependencies, {
			'@demo/a': '1.5.0',
			'@demo/b': '^2.1.0',
			'@demo/c': '>=3.0.0',
			'lodash': '^4.17.21',
		});
	});

	it('reports no changes when every version already matches (second run)', (t) =>
	{
		const listable = createListable();

		fixWsVersionsCore(listable);
		const second = fixWsVersionsCore(listable);

		assert.strictEqual(second.cwd, undefined);
		// 空陣列無法由 partialDeepStrictEqual 察覺多餘元素，故另行檢查長度
		// an empty array cannot be caught by partialDeepStrictEqual, so the length is checked separately
		assert.strictEqual(second.changed.length, 0);

		t.assert.snapshot(second);
		t.assert.partialDeepStrictEqual(second, {
			names: NAMES,
			others: [
				{ name: '@demo/a' },
				{ name: '@demo/b' },
				{ name: '@demo/c' },
				{ name: '@demo/d' },
				{ name: '@demo/app' },
			],
			// 每次呼叫都會建立新的 map，第二次呼叫沒有任何變更 → data 為空
			// every call builds a fresh map, and the second run changes nothing → data stays empty
			data: {},
		});
	});
});

/**
 * 套件實際版本為 1.5.0 / 2.1.0 / 3.0.0，
 * 但作為依賴被引用時仍寫著 1.0.0 / ^1.0.0 / >=1.0.0 的狀況。
 * Packages are at 1.5.0 / 2.1.0 / 3.0.0 while referenced as 1.0.0 / ^1.0.0 / >=1.0.0.
 *
 * 資料同樣取自基底測試資料的 `@demo/app`。
 * The data also comes from the base fixture's `@demo/app`.
 */
describe('stale 1.x references to newer workspace versions', () =>
{
	it('fixPkgDepsVersionsCore: rewrites 1.0.0 / ^1.0.0 / >=1.0.0 ranges', (t) =>
	{
		const listable = createListable();
		// 基底資料 [4]：三種過時範圍寫法 + 非 workspace 套件
		// base fixture [4]: three stale range shapes plus a non-workspace package
		const row = { dependencies: { ...listable[4].dependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable });

		assert.strictEqual(result.changed, true);

		const snapshot = {
			changed: result.changed,
			row,
			data: result.map.data,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: true,
			row: {
				dependencies: {
					'@demo/a': '1.5.0',
					'@demo/b': '^2.1.0',
					'@demo/c': '>=3.0.0',
					'lodash': '^4.17.21',
				},
			},
			data: {
				'@demo/a': '1.5.0',
				'@demo/b': '2.1.0',
				'@demo/c': '3.0.0',
			},
		});
	});
});

/**
 * Workspace protocol 公用邏輯：偵測 / 預設值 / 順向轉換 / 逆向轉換
 * Shared Workspace protocol logic: detect / defaults / forward conversion / reverse conversion
 *
 * 版本值一律取自基底測試資料，確保與其他測試同源。
 * Version values always come from the base fixture so they stay on one source of truth.
 */
describe('workspace protocol shared helpers', () =>
{
	/** 基底測試資料中的實際版本 / the actual version held by the base fixture */
	const version = createListable()[0].version;

	it('getWorkspaceProtocol: default and swappable', () =>
	{
		assert.strictEqual(getWorkspaceProtocol(), DEFAULT_WORKSPACE_PROTOCOL);
		assert.strictEqual(getWorkspaceProtocol({}), DEFAULT_WORKSPACE_PROTOCOL);
		assert.strictEqual(getWorkspaceProtocol({ protocol: 'custom:' }), 'custom:');
	});

	it('isWorkspaceProtocol: detects default and custom protocol', (t) =>
	{
		const snapshot = {
			'workspace:*': isWorkspaceProtocol('workspace:*'),
			'workspace:^1.5.0': isWorkspaceProtocol('workspace:^1.5.0'),
			'1.5.0': isWorkspaceProtocol('1.5.0'),
			'^1.5.0': isWorkspaceProtocol('^1.5.0'),
			'undefined': isWorkspaceProtocol(undefined),
			'custom:* (default opts)': isWorkspaceProtocol('custom:*'),
			'custom:* (custom opts)': isWorkspaceProtocol('custom:*', { protocol: 'custom:' }),
			'workspace:* (custom opts)': isWorkspaceProtocol('workspace:*', { protocol: 'custom:' }),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			'workspace:*': true,
			'workspace:^1.5.0': true,
			'1.5.0': false,
			'^1.5.0': false,
			'undefined': false,
			'custom:* (default opts)': false,
			'custom:* (custom opts)': true,
			'workspace:* (custom opts)': false,
		});
	});

	it('parseWorkspaceProtocol: splits protocol from range', (t) =>
	{
		const snapshot = {
			'workspace:^1.5.0': parseWorkspaceProtocol('workspace:^1.5.0'),
			'workspace:*': parseWorkspaceProtocol('workspace:*'),
			'workspace:': parseWorkspaceProtocol('workspace:'),
			'1.5.0': parseWorkspaceProtocol('1.5.0'),
			'custom:~ (custom opts)': parseWorkspaceProtocol('custom:~', { protocol: 'custom:' }),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			'workspace:^1.5.0': {
				value: 'workspace:^1.5.0',
				protocol: 'workspace:',
				range: '^1.5.0',
			},
			'workspace:*': {
				value: 'workspace:*',
				protocol: 'workspace:',
				range: '*',
			},
			'workspace:': {
				value: 'workspace:',
				protocol: 'workspace:',
				range: '',
			},
			'1.5.0': null,
			'custom:~ (custom opts)': {
				value: 'custom:~',
				protocol: 'custom:',
				range: '~',
			},
		});
	});

	it('isWorkspaceProtocolBareRange: detects bare operators', (t) =>
	{
		const snapshot = {
			'': isWorkspaceProtocolBareRange(''),
			'*': isWorkspaceProtocolBareRange('*'),
			'^': isWorkspaceProtocolBareRange('^'),
			'~': isWorkspaceProtocolBareRange('~'),
			'^1.5.0': isWorkspaceProtocolBareRange('^1.5.0'),
			'1.5.0': isWorkspaceProtocolBareRange('1.5.0'),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			'': true,
			'*': true,
			'^': true,
			'~': true,
			'^1.5.0': false,
			'1.5.0': false,
		});
	});

	it('workspaceProtocolToRange: pnpm docs example (version from base fixture)', (t) =>
	{
		const snapshot = {
			'workspace:*': workspaceProtocolToRange('workspace:*', { version }),
			'workspace:~': workspaceProtocolToRange('workspace:~', { version }),
			'workspace:^': workspaceProtocolToRange('workspace:^', { version }),
			'workspace:^1.5.0': workspaceProtocolToRange('workspace:^1.5.0', { version }),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			'workspace:*': '1.5.0',
			'workspace:~': '~1.5.0',
			'workspace:^': '^1.5.0',
			'workspace:^1.5.0': '^1.5.0',
		});
	});

	it('workspaceProtocolToRange: without version / non-workspace / custom protocol', (t) =>
	{
		const snapshot = {
			'workspace:* (no version)': workspaceProtocolToRange('workspace:*'),
			'workspace:^ (no version)': workspaceProtocolToRange('workspace:^'),
			'1.5.0': workspaceProtocolToRange('1.5.0'),
			'^1.5.0': workspaceProtocolToRange('^1.5.0'),
			'workspace:^ (custom protocol)': workspaceProtocolToRange('workspace:^', { protocol: 'custom:' }),
			'custom:^ (custom protocol)': workspaceProtocolToRange('custom:^', { protocol: 'custom:' }),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			'workspace:* (no version)': '*',
			'workspace:^ (no version)': 'workspace:^',
			'1.5.0': '1.5.0',
			'^1.5.0': '^1.5.0',
			'workspace:^ (custom protocol)': 'workspace:^',
			'custom:^ (custom protocol)': 'custom:^',
		});
	});

	it('rangeToWorkspaceProtocol: reverse conversion with swappable protocol', (t) =>
	{
		const snapshot = {
			'1.5.0': rangeToWorkspaceProtocol('1.5.0'),
			'^1.5.0': rangeToWorkspaceProtocol('^1.5.0'),
			'~1.5.0': rangeToWorkspaceProtocol('~1.5.0'),
			'>=1.5.0': rangeToWorkspaceProtocol('>=1.5.0'),
			'workspace:^1.5.0 (idempotent)': rangeToWorkspaceProtocol('workspace:^1.5.0'),
			'^1.5.0 (custom out)': rangeToWorkspaceProtocol('^1.5.0', { protocol: 'custom:' }),
			'workspace:^1.5.0 (custom out)': rangeToWorkspaceProtocol('workspace:^1.5.0', { protocol: 'custom:' }),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			'1.5.0': 'workspace:1.5.0',
			'^1.5.0': 'workspace:^1.5.0',
			'~1.5.0': 'workspace:~1.5.0',
			'>=1.5.0': 'workspace:>=1.5.0',
			'workspace:^1.5.0 (idempotent)': 'workspace:^1.5.0',
			'^1.5.0 (custom out)': 'custom:^1.5.0',
			'workspace:^1.5.0 (custom out)': 'custom:^1.5.0',
		});
	});

	it('round trip: workspace → range → workspace', (t) =>
	{
		const snapshot = {
			workspace: rangeToWorkspaceProtocol(workspaceProtocolToRange('workspace:^', { version })),
			'workspace (custom out)': rangeToWorkspaceProtocol(
				workspaceProtocolToRange('workspace:^', { version }),
				{ protocol: 'custom:' },
			),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			workspace: 'workspace:^1.5.0',
			'workspace (custom out)': 'custom:^1.5.0',
		});
	});
});

/**
 * fixPkgDepsVersionsCore 對 Workspace protocol 的處理
 * fixPkgDepsVersionsCore handling of the Workspace protocol
 *
 * 每個案例都取自基底測試資料 `@demo/app` 的依賴欄位，差異只來自傳入的選項。
 * Every case takes a dependency field of the base fixture's `@demo/app`; only the options differ.
 */
describe('fixPkgDepsVersionsCore with workspace protocol', () =>
{
	it('saveWorkspaceProtocol omitted: converts workspace:* / ^ / ~', (t) =>
	{
		const listable = createListable();
		// 基底資料 [4] 的 devDependencies：bare operator + 非 workspace
		// base fixture [4] devDependencies: bare operators plus a non-workspace entry
		const row = { dependencies: { ...listable[4].devDependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable });

		assert.strictEqual(result.changed, true);

		const snapshot = {
			changed: result.changed,
			dependencies: row.dependencies,
			data: result.map.data,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: true,
			dependencies: {
				'@demo/a': '1.5.0',
				'@demo/b': '^2.1.0',
				'@demo/c': '~3.0.0',
				'lodash': 'workspace:^4.17.21',
			},
			data: {
				'@demo/a': '1.5.0',
				'@demo/b': '2.1.0',
				'@demo/c': '3.0.0',
			},
		});
	});

	it('saveWorkspaceProtocol false: same conversion as omitted', (t) =>
	{
		const listable = createListable();
		const row = { dependencies: { ...listable[4].devDependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable }, { saveWorkspaceProtocol: false });

		assert.strictEqual(result.changed, true);

		const snapshot = {
			changed: result.changed,
			dependencies: row.dependencies,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: true,
			dependencies: {
				'@demo/a': '1.5.0',
				'@demo/b': '^2.1.0',
				'@demo/c': '~3.0.0',
				'lodash': 'workspace:^4.17.21',
			},
		});
	});

	it('saveWorkspaceProtocol true: keeps protocol, bare operators untouched', (t) =>
	{
		const listable = createListable();
		const row = { dependencies: { ...listable[4].devDependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable }, { saveWorkspaceProtocol: true });

		// bare operator 沒有版本可修復 → 無任何變更 / a bare operator carries no version to fix → nothing changed
		assert.strictEqual(result.changed, undefined);

		const snapshot = {
			changed: result.changed,
			dependencies: row.dependencies,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: undefined,
			dependencies: {
				'@demo/a': 'workspace:*',
				'@demo/b': 'workspace:^',
				'@demo/c': 'workspace:~',
				'lodash': 'workspace:^4.17.21',
			},
		});
	});

	it('saveWorkspaceProtocol true: syncs stale version inside the protocol', (t) =>
	{
		const listable = createListable();
		// 基底資料 [4] 的 peerDependencies：明確版本（已相符 + 過時）+ 萬用字元
		// base fixture [4] peerDependencies: explicit versions (aligned + stale) plus a wildcard
		const row = { dependencies: { ...listable[4].peerDependencies! } };

		const result = fixPkgDepsVersionsCore(row, { listable }, { saveWorkspaceProtocol: true });

		assert.strictEqual(result.changed, true);

		const snapshot = {
			changed: result.changed,
			dependencies: row.dependencies,
			data: result.map.data,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: true,
			dependencies: {
				'@demo/a': 'workspace:^1.5.0',
				'@demo/b': 'workspace:^2.1.0',
				'@demo/c': '*',
			},
			data: { '@demo/b': '2.1.0' },
		});
	});

	it('non-workspace deps are unaffected by the option', (t) =>
	{
		const listable = createListable();
		// 同時帶入無 protocol 與有 protocol 的欄位，兩者都含非 workspace 套件
		// carries both a plain and a protocol field, each holding a non-workspace package
		const row = {
			dependencies: { ...listable[4].dependencies! },
			devDependencies: { ...listable[4].devDependencies! },
		};

		const result = fixPkgDepsVersionsCore(row, { listable }, { saveWorkspaceProtocol: true });

		assert.strictEqual(result.changed, true);

		const snapshot = {
			changed: result.changed,
			dependencies: row.dependencies,
			devDependencies: row.devDependencies,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			changed: true,
			// 無 protocol 的過時引用仍會被同步 / stale plain references are still synced
			dependencies: {
				'@demo/a': '1.5.0',
				'@demo/b': '^2.1.0',
				'@demo/c': '>=3.0.0',
				'lodash': '^4.17.21',
			},
			// 有 protocol 的 bare operator 被保留、lodash 兩處都不受影響
			// protocol bare operators are kept and lodash is untouched in both fields
			devDependencies: {
				'@demo/a': 'workspace:*',
				'@demo/b': 'workspace:^',
				'@demo/c': 'workspace:~',
				'lodash': 'workspace:^4.17.21',
			},
		});
	});
});

/**
 * fixWsVersionsCore 傳遞 Workspace protocol 選項
 * fixWsVersionsCore passing the Workspace protocol option through
 *
 * 與 {@link fixWsVersionsCore} 使用同一組基底資料，差異只在於選項如何影響 protocol 欄位與 plain 引用。
 * Uses the same base fixture as {@link fixWsVersionsCore}; only the options differ, and only in how
 * they affect the protocol fields and the plain references.
 */
describe('fixWsVersionsCore with workspace protocol', () =>
{
	it('default: converts Workspace protocol into plain ranges', (t) =>
	{
		const listable = createListable();

		const result = fixWsVersionsCore(listable, 'D:/fake/protocol-workspace');

		const snapshot = {
			devDependencies: listable[4].devDependencies,
			peerDependencies: listable[4].peerDependencies,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			devDependencies: {
				'@demo/a': '1.5.0',
				'@demo/b': '^2.1.0',
				'@demo/c': '~3.0.0',
				'lodash': 'workspace:^4.17.21',
			},
			peerDependencies: {
				'@demo/a': '^1.5.0',
				'@demo/b': '^2.1.0',
				'@demo/c': '*',
			},
		});

		t.assert.partialDeepStrictEqual(result, {
			names: NAMES,
			changed: [{ name: '@demo/d' }, { name: '@demo/app' }],
			others: [{ name: '@demo/a' }, { name: '@demo/b' }, { name: '@demo/c' }],
		});
	});

	it('saveWorkspaceProtocol: true keeps protocol but never adds it to plain ranges', (t) =>
	{
		const listable = createListable();

		const result = fixWsVersionsCore(listable, {
			cwd: 'D:/fake/protocol-workspace',
			saveWorkspaceProtocol: true,
		});

		const snapshot = {
			// 無 protocol 的引用（`@demo/d` 純 plain、`@demo/app` plain + lodash）
			// plain references (`@demo/d` is plain-only, `@demo/app` holds plain plus lodash)
			plain: {
				'@demo/d': listable[3].dependencies,
				'@demo/app': listable[4].dependencies,
			},
			devDependencies: listable[4].devDependencies,
			peerDependencies: listable[4].peerDependencies,
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			// `saveWorkspaceProtocol` 只負責「保留既有的 workspace:」，
			// 不會反過來替原本沒有 protocol 的引用補上前綴。
			// `saveWorkspaceProtocol` only *keeps* an existing `workspace:`; it never back-fills the
			// prefix onto references that had no protocol to begin with.
			plain: {
				'@demo/d': { '@demo/a': '^1.5.0' },
				'@demo/app': {
					'@demo/a': '1.5.0',
					'@demo/b': '^2.1.0',
					'@demo/c': '>=3.0.0',
					'lodash': '^4.17.21',
				},
			},
			// bare operator 原樣保留 / bare operators are kept as-is
			devDependencies: {
				'@demo/a': 'workspace:*',
				'@demo/b': 'workspace:^',
				'@demo/c': 'workspace:~',
				'lodash': 'workspace:^4.17.21',
			},
			// 明確版本被同步、protocol 前綴保留 / the explicit version is synced while the prefix stays
			peerDependencies: {
				'@demo/a': 'workspace:^1.5.0',
				'@demo/b': 'workspace:^2.1.0',
				'@demo/c': '*',
			},
		});

		// 無 protocol 的過時引用仍會使同一列被標記變更
		// stale plain references still mark the same row as changed
		t.assert.partialDeepStrictEqual(result, {
			names: NAMES,
			changed: [{ name: '@demo/d' }, { name: '@demo/app' }],
			others: [{ name: '@demo/a' }, { name: '@demo/b' }, { name: '@demo/c' }],
		});
	});
});

/**
 * handleOptionsFixWsVersions 參數歸一化
 * handleOptionsFixWsVersions argument normalization
 */
describe('handleOptionsFixWsVersions', () =>
{
	it('normalizes cwd / object / opts combinations', (t) =>
	{
		const shared = { protocol: 'custom:' };

		const snapshot = {
			'undefined': handleOptionsFixWsVersions(),
			'string': handleOptionsFixWsVersions('D:/fake/ws'),
			'empty string': handleOptionsFixWsVersions(''),
			'object': handleOptionsFixWsVersions({ cwd: 'D:/fake/ws', saveWorkspaceProtocol: true }),
			'null object': handleOptionsFixWsVersions(null),
			'string + opts': handleOptionsFixWsVersions('D:/fake/ws', { saveWorkspaceProtocol: true }),
			'object + opts': handleOptionsFixWsVersions({ cwd: 'D:/a' }, { cwd: 'D:/b' }),
			'undefined + opts': handleOptionsFixWsVersions(undefined, { saveWorkspaceProtocol: true }),
			'shared protocol opts': handleOptionsFixWsVersions({ cwd: 'D:/a' }, shared),
		};

		t.assert.snapshot(snapshot);
		t.assert.partialDeepStrictEqual(snapshot, {
			'undefined': {},
			'string': { cwd: 'D:/fake/ws' },
			'empty string': {},
			'object': { cwd: 'D:/fake/ws', saveWorkspaceProtocol: true },
			'null object': {},
			'string + opts': { cwd: 'D:/fake/ws', saveWorkspaceProtocol: true },
			'object + opts': { cwd: 'D:/b' },
			'undefined + opts': { saveWorkspaceProtocol: true },
			'shared protocol opts': { cwd: 'D:/a', protocol: 'custom:' },
		});
	});
});
