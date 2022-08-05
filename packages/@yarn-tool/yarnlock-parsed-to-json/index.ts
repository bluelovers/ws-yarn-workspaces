import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import { assertYarnLockParsed, isYarnLockParsedV1, isYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse-assert';
import {
	IYarnLockParsed,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
	IYarnLockSource,
	IYarnLockRawSourceV1,
	IYarnLockRawSourceV2,
} from '@yarn-tool/yarnlock-types';

export function yarnLockParsedV1ToRawJSON(parsedObject: IYarnLockParsedV1): IYarnLockRawSourceV1
{
	return {
		...parsedObject.meta,
		object: parsedObject.data,
	} as any
}

export function yarnLockParsedV2ToRawJSON(parsedObject: IYarnLockParsedV2): IYarnLockRawSourceV2
{
	return {
		__metadata: parsedObject.meta,
		...parsedObject.data,
	} as any
}

export interface IOptionsYarnLockParsedToRawJSON
{
	throwError?: boolean,
}

export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV1,
	options?: IOptionsYarnLockParsedToRawJSON,
): IYarnLockRawSourceV1
export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV2,
	options?: IOptionsYarnLockParsedToRawJSON,
): IYarnLockRawSourceV2
export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsed,
	options?: IOptionsYarnLockParsedToRawJSON,
): IYarnLockSource
export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsed, options?: IOptionsYarnLockParsedToRawJSON)
{
	assertYarnLockParsed(parsedObject);

	if (isYarnLockParsedV2(parsedObject))
	{
		return yarnLockParsedV2ToRawJSON(parsedObject)
	}
	else if (isYarnLockParsedV1(parsedObject))
	{
		return yarnLockParsedV1ToRawJSON(parsedObject)
	}

	if (options?.throwError)
	{
		throw newYarnLockParsedVersionError();
	}
}

export default yarnLockParsedToRawJSON
