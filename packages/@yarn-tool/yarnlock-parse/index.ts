import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import {
	EnumDetectYarnLock,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
	IYarnLockRawSourceV1,
	IYarnLockRawSourceV2,
	IYarnLockSource,
} from '@yarn-tool/yarnlock-types';
import { parseYarnLockRawV1 } from '@yarn-tool/yarnlock-parse-raw/lib/v1';
import { parseYarnLockRawV2 } from '@yarn-tool/yarnlock-parse-raw/lib/v2';

export function _yarnLockParseRawCore<T extends IYarnLockSource = IYarnLockSource>(verType: EnumDetectYarnLock,
	yarnlock_old: Buffer | string,
)
{
	const source = yarnlock_old.toString();

	let parsed: T;

	switch (verType)
	{
		case EnumDetectYarnLock.v3:
		case EnumDetectYarnLock.v2:
			parsed = parseYarnLockRawV2(source) as T;
			break;
		case EnumDetectYarnLock.v1:
			parsed = parseYarnLockRawV1(source) as T;
			break;
		default:
			throw newYarnLockParsedVersionError()
	}

	return {
		verType,
		parsed,
		source,
	}
}

export function yarnLockParseRaw<T extends IYarnLockSource = IYarnLockSource>(yarnlock_old: Buffer | string): T
{
	const verType = detectYarnLockVersion(yarnlock_old as string);
	return _yarnLockParseRawCore<T>(verType, yarnlock_old).parsed;
}

export function yarnLockRawV1ToParsed(rawParsed: IYarnLockRawSourceV1): Omit<IYarnLockParsedV1, 'verType'>
{
	let data;
	let meta;

	({ object: data, ...meta } = rawParsed);

	return {
		meta,
		data,
	} as any
}

export function yarnLockRawV2ToParsed(rawParsed: IYarnLockRawSourceV2): Omit<IYarnLockParsedV2, 'verType'>
{
	let data;
	let meta;

	({ __metadata: meta, ...data } = rawParsed);

	return {
		meta,
		data,
	}
}

export function _yarnLockParseCore<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(inputResult: Pick<ReturnType<typeof _yarnLockParseRawCore>, 'verType' | 'parsed'>): T
{
	let fn: typeof yarnLockRawV2ToParsed | typeof yarnLockRawV1ToParsed;

	switch (inputResult.verType)
	{
		case EnumDetectYarnLock.v3:
		case EnumDetectYarnLock.v2:
			fn = yarnLockRawV2ToParsed;
			break;
		case EnumDetectYarnLock.v1:
			fn = yarnLockRawV1ToParsed;
			break;
		default:
			throw newYarnLockParsedVersionError()
	}

	return {
		verType: inputResult.verType,
		...(fn(inputResult.parsed as any)),
	} as T
}

export function yarnLockParse<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string)
{
	const verType = detectYarnLockVersion(yarnlock_old as string);

	const inputResult = _yarnLockParseRawCore(verType, yarnlock_old);

	return _yarnLockParseCore<T>(inputResult)
}

export default yarnLockParse
