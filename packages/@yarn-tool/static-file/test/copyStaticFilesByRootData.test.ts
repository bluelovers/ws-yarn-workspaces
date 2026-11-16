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
import { getRootCopyStaticFilesAuto } from '../lib/root/getRootCopyStaticFiles';
import { getRowOfStaticFilesMapArray } from '../lib/getRowOfStaticFilesMapArray';
import { getWsCopyStaticFiles } from '../lib/ws/wsCopyStaticFiles';
import type { IIgnoreFilesSnapshot, IStaticFilesMapArray } from '../lib/types';
import { defaultCopyStaticFilesPkgOnly } from '../lib/const';

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

const _pkgOnlyEntry = defaultCopyStaticFilesPkgOnly[0][0];

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

			/**
			 * 依旗標組合驗證清單內容（快照守護全貌，此處只鎖定條件式判定）
			 *
			 * 「應含某條目」以 partialDeepStrictEqual 部分比對表達；
			 * 「不應含某條目」部分比對無法表達缺席，改以 getRowOfStaticFilesMapArray 查詢後 strictEqual undefined
			 */
			const file_map = actual.file_map as IStaticFilesMapArray<string>;

			const _row = (targetFile: string) => getRowOfStaticFilesMapArray(file_map, targetFile as never);

			if (rootData.hasWorkspace)
			{
				/**
				 * workspace 分支：目標為 ws 根目錄，使用 workspace 清單
				 * （含 ws-root-only 條目；isPkg 不套用於 ws 根目錄）
				 */
				t.assert.partialDeepStrictEqual(file_map, [
					['__root_ws.ts'],
				]);
				t.assert.strictEqual(_row(_pkgOnlyEntry), undefined);
			}
			else
			{
				/** 套件清單分支：不含 ws-root-only 條目 */
				t.assert.strictEqual(_row('__root_ws.ts'), undefined);

				/**
				 * root-only 條目僅在「獨立根目錄」加入；
				 * 這裡以 lerna.json.tpl 的 detectFile（root-only 獨有）判定
				 */
				if (rootData.isRoot)
				{
					t.assert.partialDeepStrictEqual(file_map, [
						// ['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
						['lerna.json.tpl'],
					]);
				}
				else
				{
					t.assert.strictEqual(_row('lerna.json.tpl'), undefined);
				}

				/** PkgOnly 條目僅在 isPkg 為 true 時附加 */
				if (rootData.isPkg)
				{
					t.assert.partialDeepStrictEqual(file_map, [
						[_pkgOnlyEntry],
					]);
				}
				else
				{
					t.assert.strictEqual(_row(_pkgOnlyEntry), undefined);
				}
			}
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

describe('isPkg 判斷', () =>
{
	/** defaultCopyStaticFilesPkgOnly 的唯一條目 */
	// const _pkgOnlyEntry = ['playwright.config.ts', 'file/playwright.config.ts', 'playwright.config.js'] as const;

	test('getRootCopyStaticFilesAuto 在 isPkg 為 true 時附加 PkgOnly 條目', (t: TestContext) =>
	{
		const withPkg = getRootCopyStaticFilesAuto({ isRoot: false, hasWorkspace: true, isPkg: true });
		const withoutPkg = getRootCopyStaticFilesAuto({ isRoot: false, hasWorkspace: true, isPkg: false });
		const omitted = getRootCopyStaticFilesAuto({ isRoot: false, hasWorkspace: true });

		const _last = (file_map: IStaticFilesMapArray<string>) => file_map[file_map.length - 1];

		/** true 時末筆為 PkgOnly 條目 */
		t.assert.partialDeepStrictEqual(withPkg, [[_pkgOnlyEntry]]);
		/**
		 * false 與省略時皆不附加；
		 * 缺席無法以部分比對表達，改以查詢後比對 undefined
		 */
		t.assert.strictEqual(getRowOfStaticFilesMapArray(withoutPkg, _pkgOnlyEntry), undefined);
		t.assert.strictEqual(getRowOfStaticFilesMapArray(omitted, _pkgOnlyEntry), undefined);
		/** 附加不影響既有條目數量（僅多一筆） */
		t.assert.strictEqual(withPkg.length, withoutPkg.length + 1);
	});

	test('getCopyStaticFilesOptionsByRootData 預設沿用 rootData.isPkg', (t: TestContext) =>
	{
		const rootData = findRootLazy({ cwd: __dirname });

		/** workspace 內套件：isPkg 為 true */
		t.assert.strictEqual(rootData?.isPkg, true);

		/** 覆寫 cwd 走套件模式清單，才能觀察 isPkg 的傳遞（未覆寫 cwd 時走 workspace 清單） */
		const actual = getCopyStaticFilesOptionsByRootData(rootData, {
			cwd: '/new/package',
		});

		t.assert.partialDeepStrictEqual(actual.file_map, [
			['.npmignore', 'file/npmignore'],
			[_pkgOnlyEntry],
		]);
	});

	test('選項 isPkg 可覆寫 rootData 的值', (t: TestContext) =>
	{
		const rootData = findRootLazy({ cwd: __dirname });

		const enabled = getCopyStaticFilesOptionsByRootData(rootData, {
			cwd: '/new/package',
			hasWorkspace: false,
			isRoot: true,
			isPkg: true,
		});
		const disabled = getCopyStaticFilesOptionsByRootData(rootData, {
			cwd: '/new/package',
			hasWorkspace: false,
			isRoot: true,
			isPkg: false,
		});

		/**
		 * 覆寫為 true 時附加、為 false 時不附加（即使 rootData.isPkg 為 true）；
		 * 應含以部分比對表達，缺席以查詢後比對 undefined 表達
		 */
		t.assert.partialDeepStrictEqual(enabled.file_map, [[_pkgOnlyEntry]]);
		t.assert.strictEqual(
			getRowOfStaticFilesMapArray(disabled.file_map as IStaticFilesMapArray<string>, _pkgOnlyEntry),
			undefined,
		);
	});
});
