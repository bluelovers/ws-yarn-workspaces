//@noUnusedParameters:false

import { basename, extname } from 'path';
import { EnumDetectYarnLock, IYarnLockParsed, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
import { yarnLockParsedToRawJSON, yarnLockParsedV1ToRawJSON, yarnLockParsedV2ToRawJSON } from '../index';

beforeAll(async () =>
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

	test(`yarnLockParsedV1ToRawJSON`, () =>
	{
		const json: IYarnLockParsedV1 = {
			...(parsedObject as any as IYarnLockParsedV1),
			verType: EnumDetectYarnLock.v1,
		};

		let actual = yarnLockParsedV1ToRawJSON(json);

		expect(actual).toMatchSnapshot();

	});

	test(`yarnLockParsedV2ToRawJSON`, () =>
	{
		const json: IYarnLockParsedV2 = {
			...(parsedObject as any as IYarnLockParsedV2),
			verType: EnumDetectYarnLock.v2,
		};

		let actual = yarnLockParsedV2ToRawJSON(json);

		expect(actual).toMatchSnapshot();

	});

	test(`throw`, () => {

		expect(() => yarnLockParsedToRawJSON(parsedObject)).toThrowError();

		expect(() => yarnLockParsedToRawJSON({
			...(parsedObject as any as IYarnLockParsedV1),
			verType: EnumDetectYarnLock.v1,
		})).not.toThrowError();

		expect(() => yarnLockParsedToRawJSON({
			...(parsedObject as any as IYarnLockParsedV2),
			verType: EnumDetectYarnLock.v2,
		})).not.toThrowError();

	});

})
