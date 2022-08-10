import { detectYarnLockVersionByObject } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject';
import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import { yarnLockParsedToRawJSON } from '@yarn-tool/yarnlock-parsed-to-json';
import {
	EnumDetectYarnLock,
	IYarnLockParsed,
	IYarnLockRawSourceV1,
	IYarnLockRawSourceV2,
	IYarnLockSource,
} from '@yarn-tool/yarnlock-types';
import { detectYarnLockVersionByParsed } from '@yarn-tool/detect-yarnlock-version';
import { stringifyYarnLockRawV1 } from '@yarn-tool/yarnlock-parse-raw/lib/v1';
import { stringifyYarnLockRawV2 } from '@yarn-tool/yarnlock-parse-raw/lib/v2';

export function yarnLockStringify(yarnlock_old: Record<string, any> | Buffer | string | IYarnLockSource | IYarnLockParsed): string
{
	let verType: EnumDetectYarnLock = detectYarnLockVersionByParsed(yarnlock_old as IYarnLockParsed);

	if (verType)
	{
		yarnlock_old = yarnLockParsedToRawJSON(yarnlock_old as IYarnLockParsed)
	}
	else
	{
		verType = detectYarnLockVersionByObject(yarnlock_old as any);
	}

	if (verType)
	{
		return _yarnLockStringifyRawCore(verType, yarnlock_old as IYarnLockSource).content
	}
	else
	{
		verType = detectYarnLockVersion(yarnlock_old as string);

		if (verType)
		{
			return yarnlock_old.toString()
		}
	}

	throw newYarnLockParsedVersionError()
}

export type IResultYarnLockStringifyRaw = {
	verType: EnumDetectYarnLock.v1;
	fn: typeof stringifyYarnLockRawV1
	json: IYarnLockRawSourceV1;
	content: string;
} | {
	verType: EnumDetectYarnLock.v2;
	fn: typeof stringifyYarnLockRawV2
	json: IYarnLockRawSourceV2;
	content: string;
} | {
	verType: EnumDetectYarnLock.v3;
	fn: typeof stringifyYarnLockRawV2
	json: IYarnLockRawSourceV2;
	content: string;
};

export function _yarnLockStringifyRaw(yarnlockRawJSON: IYarnLockSource)
{
	const verType = detectYarnLockVersionByObject(yarnlockRawJSON)

	return _yarnLockStringifyRawCore(verType, yarnlockRawJSON)
}

export function yarnLockStringifyRaw(yarnlockRawJSON: IYarnLockSource)
{
	return _yarnLockStringifyRaw(yarnlockRawJSON).content
}

export function _yarnLockStringifyRawCore(verType: EnumDetectYarnLock, yarnlockRawJSON: IYarnLockSource): IResultYarnLockStringifyRaw
{
	let fn: typeof stringifyYarnLockRawV2 | typeof stringifyYarnLockRawV1;

	switch (verType)
	{
		case EnumDetectYarnLock.v3:
		case EnumDetectYarnLock.v2:
			fn = stringifyYarnLockRawV2;
			break;
		case EnumDetectYarnLock.v1:
			fn = stringifyYarnLockRawV1;
			break;
		default:
			throw newYarnLockParsedVersionError()
	}

	return {
		verType,
		fn,
		json: yarnlockRawJSON,
		content: fn(yarnlockRawJSON),
	} as IResultYarnLockStringifyRaw
}

export default yarnLockStringify
