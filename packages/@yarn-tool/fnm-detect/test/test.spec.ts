import assert from 'node:assert/strict';
import { describe, test, type TestContext } from 'node:test';
import { dirname } from "upath2";
import { detectFnmByAll, detectFnmByEnv, detectFnmByExecPath, IDetectFnmByAllInput } from "..";

describe('fnm', () =>
{
	const FNM_DIR = 'C:/Users/zzzzzzz/AppData/Roaming/fnm';
	const FNM_MULTISHELL_PATH = 'C:/Users/zzzzzzz/AppData/Local/fnm_multishells/7064_1771483456556';

	[
		'C:/Users/xxxxxxx/AppData/Roaming/fnm/aliases/default',
		'C:/Users/xxxxxxx/AppData/Roaming/fnm/aliases/latest',
		'C:/Users/xxxxxxx/AppData/Roaming/fnm/aliases/lts-latest',
		'C:/Users/xxxxxxx/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
		'C:/Users/xxxxxxx/AppData/Local/fnm_multishells/7064_1771483456556',
		'C:/Users/xxxxxxx/AppData/Roaming/fnm',
		'C:/Users/xxxxxxx/AppData/Local/fnm_multishells',
	].forEach(execPath => {
		describe(`${JSON.stringify(execPath)}`, () => {

			let version = 'v24.13.1';

			let env = {
				FNM_DIR,
				FNM_MULTISHELL_PATH: execPath.replace('xxxxxxx', 'yyyyyyy'),
			};

			_lazyTest001({
				execPath,
				version,
				env,
			});

		});
	});
})

function _lazyTest001(pc: IDetectFnmByAllInput)
{
	test(`detectFnmByExecPath`, (t) => {
		_lazyTest002(detectFnmByExecPath(pc.execPath, pc.version), t);

	});


	test(`detectFnmByEnv`, (t) => {

		_lazyTest002(detectFnmByEnv(pc.env, pc.version), t);
	});


	test(`detectFnmByAll`, (t) => {
		_lazyTest002(detectFnmByAll(pc), t);
	});

}

function _lazyTest002<T extends Record<string, any>>(result: T, t: TestContext, input?: any)
{
	if (result)
	{
		delete result.exists;
		delete result.fnmPathReal;
		delete result.aliasDefaultPathReal;

		if (result.isFnm)
		{
			if (result.installationPath)
			{
				assert.strictEqual(typeof result.fnmPath, 'string');
				assert.strictEqual(typeof result.installationPath, 'string');
				assert.strictEqual(typeof result.version, 'string');

				t.assert.snapshot(result);
			}
			else
			{
				assert.strictEqual(typeof result.fnmPath, 'string');

				t.assert.snapshot(result);
			}
		}
		else
		{
			t.assert.snapshot(result);
		}
	}
	else
	{
		t.assert.snapshot({
			input,
			result,
		});
	}
}
