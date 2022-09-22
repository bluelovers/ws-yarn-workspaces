import { structUtils } from '@yarnpkg/core';
import { parseResolution } from '@yarn-tool/yarnlock-parse-raw/lib/v2/parseResolution';
import { parseRange } from './lib/parseRange';
import { formatPackageName } from '@yarn-tool/pkg-name-util';

export function parseResolutionOrDescriptor(rawInput: string)
{
	try
	{
		let parsed = parseResolution(rawInput);

		return {
			fullName: parsed.descriptor.fullName,
			description: parsed.descriptor.description,
			isResolution: true as const,
			parsed,
			rawInput,
		}
	}
	catch (e)
	{
		let parsed = structUtils.tryParseDescriptor(rawInput, true);

		if (parsed)
		{
			let parsedRange = parseRange(parsed.range);

			return {
				fullName: formatPackageName(parsed),
				description: parsedRange.params?.version,
				isResolution: false as const,
				parsed,
				parsedRange,
				rawInput,
			}
		}
	}

	return null;
}
