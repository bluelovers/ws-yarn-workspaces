import { findRootLazy } from '@yarn-tool/find-root';
import { wsEnvConfig } from '../index';

test(`test`, () =>
{
	const rootData = findRootLazy();

	let actual = wsEnvConfig();

	expect(actual).toMatchObject({
		error: expect.anything(),
		path: expect.stringContaining('.env'),
		cwd: expect.any(String),
		current: rootData.root,
		fileExists: expect.any(Boolean),
	});

});
