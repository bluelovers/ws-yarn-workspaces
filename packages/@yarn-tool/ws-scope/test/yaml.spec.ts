//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname, join } from 'path';
import { __ROOT_WS } from '../../../../__root_ws';
import { ScopeYaml } from '../lib/format/yaml';

beforeAll(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{

	test.skip(`dummy`, () => {});

	test(`test`, () =>
	{
		const file = join(__ROOT_WS, 'packages', '@yarn-tool/static-file', 'file/pnpm-workspace.yaml');

		let wss = new ScopeYaml(file);
		wss.loadFile();

		let actual;
		let expected;

		expect(wss).toHaveProperty('opened', true);

		let old = [
			...wss.value,
		];

		expect(old).not.toContainEqual('lazy-test');

		wss.add('lazy-test');

		expect(wss.value).toContainEqual('lazy-test');

	});

})
