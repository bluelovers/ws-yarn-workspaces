import { reDoubleVerticalBar, separatorDoubleVerticalBar } from '../lib/const';

export function _replaceDoubleVerticalBar(expected: string)
{
	if (expected != null)
	{
		return expected.replace(reDoubleVerticalBar, separatorDoubleVerticalBar)
	}

	return expected
}
