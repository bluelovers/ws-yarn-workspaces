
import { tmpdir } from 'node:os';
import { __ROOT_WS } from "../../../../__root_ws";
import { join } from "upath2";
import { findRootLazy, IFindRootReturnType } from "../index";
import { _normalizePathForSnapshot } from "../../../../test/lib/normalizePathForSnapshot";
import { test, TestContext } from "node:test";
import { _sanitizationFindRootReturn } from './lib/sanitization';

test('findRootLazy', () =>
{

	const _testPaths: [cwd: string, rootData?: Partial<IFindRootReturnType>][] = [
		[__ROOT_WS, {
			isRoot: true,
			isWorkspace: true,
			isPkg: false,
		}],
		[join(__ROOT_WS, 'packages'), {
			hasWorkspace: true,
		}],
		[join(__ROOT_WS, 'packages', '@yarn-tool'), {
			hasWorkspace: true,
		}],
		[join(__ROOT_WS, 'packages', '@yarn-tool', 'find-root'), {
			isRoot: false,
			isWorkspace: false,
			isPkg: true,
		}],
		[join(__ROOT_WS, 'packages', '@yarn-tool', 'find-root', 'test'), {
			hasWorkspace: true,
		}],
		[join(__ROOT_WS, 'packages', '@yarn-tool', 'find-root', 'test', 'fixtures'), {
			hasWorkspace: true,
		}],
		[tmpdir(), null],
	];

	_testPaths.forEach(([cwd, rootData]) => {

		const pathSanitization = _normalizePathForSnapshot(cwd);

		test(pathSanitization, (t: TestContext) => {
			const result = findRootLazy({
				cwd
			});

			if (rootData)
			{
				t.assert.partialDeepStrictEqual(result, rootData);
			}
			else if (rootData === null)
			{
				t.assert.equal(result, null);
			}

			t.assert.snapshot(_sanitizationFindRootReturn(result));
		});

	});

});
