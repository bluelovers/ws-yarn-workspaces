
import { tmpdir } from 'node:os';
import { __ROOT_WS } from "../../../../__root_ws";
import { join } from "upath2";
import { findRootLazy, IFindRootReturnType } from "../index";
import { _normalizePathForSnapshot } from "../../../../test/lib/normalizePathForSnapshot";
import { test, TestContext } from "node:test";

function _sanitizationFindRootReturn(result: IFindRootReturnType)
{
	if (!result)
	{
		return result;
	}

	return {
		...result,
		cwd: _normalizePathForSnapshot(result.cwd),
		pkg: _normalizePathForSnapshot(result.pkg),
		ws: _normalizePathForSnapshot(result.ws),
		root: _normalizePathForSnapshot(result.root),
	};
}

test('findRootLazy', () =>
{

	[
		__ROOT_WS,
		join(__ROOT_WS, 'packages'),
		join(__ROOT_WS, 'packages', '@yarn-tool'),
		join(__ROOT_WS, 'packages', '@yarn-tool', 'find-root'),
		join(__ROOT_WS, 'packages', '@yarn-tool', 'find-root', 'test'),
		join(__ROOT_WS, 'packages', '@yarn-tool', 'find-root', 'test', 'fixtures'),
		tmpdir(),
	].forEach((path) => {

		const pathSanitization = _normalizePathForSnapshot(path);

		test(pathSanitization, (t: TestContext) => {
			const result = findRootLazy({
				cwd: path
			});

			t.assert.snapshot(_sanitizationFindRootReturn(result));
		});

	});

});
