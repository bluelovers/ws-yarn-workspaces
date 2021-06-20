
export function newYarnLockParsedVersionError(msg?: string)
{
	return new TypeError(msg ?? 'can\'t detect yarn.lock version')
}

export default newYarnLockParsedVersionError;
