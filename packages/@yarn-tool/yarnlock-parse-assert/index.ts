import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import { detectYarnLockVersionByParsed } from '@yarn-tool/detect-yarnlock-version';
import {
	EnumDetectYarnLock,
	IYarnLockDataRecord,
	IYarnLockDataRowBase,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockParsed,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
} from '@yarn-tool/yarnlock-types';

export function isYarnLockParsed(parsedObject: IYarnLockParsed): parsedObject is IYarnLockParsed
{
	return detectYarnLockVersionByParsed(parsedObject) > 0
}

export function assertYarnLockParsed(parsedObject: IYarnLockParsed): asserts parsedObject is IYarnLockParsed
{
	if (!detectYarnLockVersionByParsed(parsedObject))
	{
		throw newYarnLockParsedVersionError();
	}
}

export function isYarnLockParsedV1<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>>(data): data is IYarnLockParsedV1<T>
{
	return (data as IYarnLockParsedV1).verType === EnumDetectYarnLock.v1
}

export function isYarnLockParsedV2<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>>(data): data is IYarnLockParsedV2<T>
{
	return (data as IYarnLockParsedV2).verType === EnumDetectYarnLock.v2 || (data as IYarnLockParsedV2).verType === EnumDetectYarnLock.v3
}

interface IAssertYarnLockParsedIsSupportedCB<T extends IYarnLockParsedV1 | IYarnLockParsedV2>
{
	(verType: EnumDetectYarnLock.v1, parsedOldPackage: Extract<T, IYarnLockParsedV1>): any

	(verType: EnumDetectYarnLock.v2, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any

	(verType: EnumDetectYarnLock.v3, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any

	(verType: EnumDetectYarnLock, parsedOldPackage: T): any
}

export function assertYarnLockParsedIsSupported<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(parsedOldPackage: T,
	cb?: IAssertYarnLockParsedIsSupportedCB<T>,
): asserts parsedOldPackage is T
{
	if (isYarnLockParsedV1(parsedOldPackage))
	{
		return cb?.(EnumDetectYarnLock.v1, parsedOldPackage)
	}
	else if (isYarnLockParsedV2(parsedOldPackage))
	{
		return cb?.(EnumDetectYarnLock.v3, parsedOldPackage)
	}

	throw newYarnLockParsedVersionError()
}
