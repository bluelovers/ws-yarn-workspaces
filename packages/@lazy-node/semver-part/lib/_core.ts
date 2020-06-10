
export function _versionUnsafe(part: string, defaultValue?: string)
{
	return `0.0.${part ?? defaultValue ?? 0}`;
}

export function _version(part1: string)
{
	if (/^\d+\.\d+\./.test(part1))
	{
		return part1
	}
	else if (/^\d+\.(?:[^\.]+)$/.test(part1))
	{
		return '0.' + part1
	}

	return _versionUnsafe(part1)
}

export function _part(part1: string, part2: string): [string, string]
{
	if (/^\d+\.\d+\./.test(part1) && /^\d+\.\d+\./.test(part2))
	{
		return [part1, part2]
	}
	else if (/^\d+\.(?:[^\.]+)$/.test(part1) && /^\d+\.(?:[^\.]+)$/.test(part2))
	{
		return ['0.' + part1, '0.' + part2]
	}

	return [_versionUnsafe(part1), _versionUnsafe(part2)]
}

export function partsToVersion(parts: string[])
{
	return parts.join('.')
}

export function versionToParts(version: string): string[]
{
	let parts = version.split('.')

	if (parts.length > 3)
	{
		return [parts[0], parts[1], partsToVersion(parts.slice(2))]
	}

	return parts
}
