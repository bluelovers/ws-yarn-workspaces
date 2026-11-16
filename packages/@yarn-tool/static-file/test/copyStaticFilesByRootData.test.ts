/// <reference types="node" />
/**
 * @yarn-tool/static-file copyStaticFilesByRootData 測試
 *
 * 只驗證參數產生邏輯（目標目錄與 file_map 的判定、選項傳遞），
 * 不會呼叫 copyStaticFiles，因此測試過程不建立、也不覆寫任何檔案。
 */
import { describe, test, type TestContext } from 'node:test';
import { join } from 'upath2';
import { __ROOT_WS } from '../../../../__root_ws';
import { _normalizePathForSnapshot } from '../../../../test/lib/normalizePathForSnapshot';
import { _sanitizationFindRootReturn } from '@yarn-tool/find-root/test/lib/sanitization';
import { findRootLazy, IFindRootReturnType } from '@yarn-tool/find-root';

import { getCopyStaticFilesOptionsByRootData } from '../lib/copyStaticFilesByRootData';
import { getWsCopyStaticFiles } from '../lib/ws/wsCopyStaticFiles';
import type { IIgnoreFilesSnapshot, IStaticFilesMapArray } from '../lib/types';

/**
 * workspace 根目錄、workspace 內套件、fixture 套件
 */
const _testPaths: [cwd: string, rootDataExpect?: Partial<IFindRootReturnType>][] = [
	[__ROOT_WS, {
		isRoot: true,
		hasWorkspace: true,
		isWorkspace: true,
		isPkg: false,
	}],
	[join(__ROOT_WS, 'packages', '@yarn-tool', 'static-file'), {
		isRoot: false,
		hasWorkspace: true,
		isWorkspace: false,
		isPkg: true,
	}],
	[join(__ROOT_WS, 'packages', '@yarn-tool', 'static-file', 'test', 'fixtures', 'empty-pkg'), {
		isRoot: true,
		hasWorkspace: false,
		isPkg: true,
	}],
];

/**
 * 單一套件情境的合成 rootData
 *
 * hasWorkspace 為 false 時不會讀取 ws，故以空字串佔位。
 */
const _standaloneRootData = {
	hasWorkspace: false,
	root: '/project',
	isRoot: true,
} satisfies Partial<IFindRootReturnType> as IFindRootReturnType;

describe('workspace 根目錄', () =>
{
	test('複製到 ws 並使用 workspace file_map', (t: TestContext) =>
	{
		const rootData = findRootLazy({ cwd: __ROOT_WS });

		t.assert.ok(rootData?.hasWorkspace);

		const actual = getCopyStaticFilesOptionsByRootData(rootData);

		/**
		 * 部分比對只鎖定關注點：目標目錄與 workspace 清單，
		 * 其餘結構交由「快照」區塊的完整輸出守護
		 */
		t.assert.partialDeepStrictEqual(actual, {
			cwd: rootData.ws,
			file_map: getWsCopyStaticFiles(),
		});
		t.assert.strictEqual('ignoreFilesSnapshot' in actual, false);
	});
});

describe('快照', () =>
{
	/**
	 * 逐一快照預留路徑的 rootData 與產生的參數，
	 * 並以部分比對鎖定目標目錄這個關注點
	 *
	 * cwd 經 _normalizePathForSnapshot 標準化、rootData 經 _sanitizationFindRootReturn
	 * 標準化，file_map 內皆為相對路徑，因此快照不隨執行環境變動。
	 */
	_testPaths.forEach(([cwd, rootDataExpect]) =>
	{
		test(_normalizePathForSnapshot(cwd), (t: TestContext) =>
		{
			const rootData = findRootLazy({
				cwd,
			});

			t.assert.partialDeepStrictEqual(rootData, rootDataExpect);

			const actual = getCopyStaticFilesOptionsByRootData(rootData);

			t.assert.snapshot({
				rootData: _sanitizationFindRootReturn(rootData),
				options: {
					...actual,
					cwd: _normalizePathForSnapshot(actual.cwd),
				},
			});

			t.assert.partialDeepStrictEqual(actual, {
				cwd: rootData.hasWorkspace ? rootData.ws : rootData.root,
			});
		});
	});
});

describe('workspace 內套件（未覆寫 cwd）', () =>
{
	test('有 workspace 時仍以 ws 為目標', (t: TestContext) =>
	{
		/**
		 * 對應 fix-all 的分支：複製前已 refind，hasWorkspace 蘊含目標為 ws 根目錄
		 */
		const rootData = findRootLazy({ cwd: __dirname });

		t.assert.ok(rootData?.hasWorkspace);

		const actual = getCopyStaticFilesOptionsByRootData(rootData);

		t.assert.partialDeepStrictEqual(actual, {
			cwd: rootData.ws,
			file_map: getWsCopyStaticFiles(),
		});
	});
});

describe('單一套件', () =>
{
	test('目標為 root 且使用含 root-only 檔案的套件清單', (t: TestContext) =>
	{
		const actual = getCopyStaticFilesOptionsByRootData(_standaloneRootData);

		t.assert.strictEqual(actual.cwd, '/project');

		/**
		 * 部分比對斷言清單來源：預設條目在前、root-only 條目在後，
		 * 兩者皆依序出現即代表取用「預設＋root-only」的單一套件清單
		 */
		t.assert.partialDeepStrictEqual(actual.file_map, [
			['.npmignore', 'file/npmignore'],
			['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
		]);
	});
});

describe('cwd 覆寫', () =>
{
	test('目標改用覆寫值，file_map 改以套件模式判定', (t: TestContext) =>
	{
		/**
		 * 對應 npm-init2 的用法：複製到 targetDir，旗標由 wsProject 狀態決定
		 */
		const rootData = findRootLazy({ cwd: __dirname });

		const actual = getCopyStaticFilesOptionsByRootData(rootData, {
			cwd: '/new/package',
			hasWorkspace: false,
			isRoot: true,
		});

		t.assert.strictEqual(actual.cwd, '/new/package');
		t.assert.partialDeepStrictEqual(actual.file_map, [
			['.npmignore', 'file/npmignore'],
			['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
		]);
	});

	test('未提供旗標時沿用 rootData 的旗標', (t: TestContext) =>
	{
		const rootData = findRootLazy({ cwd: __dirname });

		const actual = getCopyStaticFilesOptionsByRootData(rootData, {
			cwd: '/new/package',
		});

		const file_map = actual.file_map as IStaticFilesMapArray<string>;

		t.assert.strictEqual(actual.cwd, '/new/package');

		/**
		 * rootData 為 hasWorkspace=true / isRoot=false，清單只含預設條目、
		 * 不含 root-only 條目，據以驗證旗標預設值確實來自 rootData
		 */
		t.assert.partialDeepStrictEqual(actual.file_map, [
			['.npmignore', 'file/npmignore'],
		]);
		t.assert.strictEqual(file_map.some(([targetFile]) => targetFile === 'lerna.json.tpl'), false);
	});
});

describe('選項傳遞', () =>
{
	test('ignoreFilesSnapshot 原樣帶入', (t: TestContext) =>
	{
		const ignoreFilesSnapshot: IIgnoreFilesSnapshot = new Map();

		const actual = getCopyStaticFilesOptionsByRootData(_standaloneRootData, {
			ignoreFilesSnapshot,
		});

		t.assert.strictEqual(actual.ignoreFilesSnapshot, ignoreFilesSnapshot);
	});

	test('file_map 覆寫優先於自動判定', (t: TestContext) =>
	{
		const file_map: IStaticFilesMapArray<string> = [
			['custom.txt', 'file/custom.txt'],
		];

		const actual = getCopyStaticFilesOptionsByRootData(_standaloneRootData, {
			file_map,
		});

		t.assert.strictEqual(actual.file_map, file_map);
	});
});
