//@noUnusedParameters:false

import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { basename, extname } from 'path';
import { EnumDetectYarnLock, IYarnLockParsed, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
import { yarnLockParsedToRawJSON, yarnLockParsedV1ToRawJSON, yarnLockParsedV2ToRawJSON } from '../index';

before(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{
	const parsedObject: IYarnLockParsed = {
		verType: void 0,
		meta: {
			version: '5',
		},
		data: {

		}
	}

	test(`yarnLockParsedV1ToRawJSON`, (t) =>
	{
		const json: IYarnLockParsedV1 = {
			...(parsedObject as any as IYarnLockParsedV1),
			verType: EnumDetectYarnLock.v1,
		};

		let actual = yarnLockParsedV1ToRawJSON(json);

		t.assert.snapshot(actual);

	});

	test(`yarnLockParsedV2ToRawJSON`, (t) =>
	{
		const json: IYarnLockParsedV2 = {
			...(parsedObject as any as IYarnLockParsedV2),
			verType: EnumDetectYarnLock.v2,
		};

		let actual = yarnLockParsedV2ToRawJSON(json);

		t.assert.snapshot(actual);

	});

	test(`throw`, () => {

		assert.throws(() => yarnLockParsedToRawJSON(parsedObject));

		assert.doesNotThrow(() => yarnLockParsedToRawJSON({
			...(parsedObject as any as IYarnLockParsedV1),
			verType: EnumDetectYarnLock.v1,
		}));

		assert.doesNotThrow(() => yarnLockParsedToRawJSON({
			...(parsedObject as any as IYarnLockParsedV2),
			verType: EnumDetectYarnLock.v2,
		}));

	});

})
