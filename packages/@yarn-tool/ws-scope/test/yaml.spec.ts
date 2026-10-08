//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />

import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { basename, extname, join } from 'path';
import { __ROOT_WS } from '../../../../__root_ws';
import { ScopeYaml } from '../lib/format/yaml';

before(async () =>
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

		assert.strictEqual(wss.opened, true);

		let old = [
			...wss.value,
		];

		assert.ok(!old.includes('lazy-test'));

		wss.add('lazy-test');

		assert.ok(wss.value.includes('lazy-test'));

	});

})
