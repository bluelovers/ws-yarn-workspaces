import { IFindRootReturnType } from '../..';
import { _normalizePathForSnapshot } from '../../../../../test/lib/normalizePathForSnapshot';



export function _sanitizationFindRootReturn(result: IFindRootReturnType)
{
	if (!result)
	{
		return result;
	}

	return {
		...result,
		cwd: _normalizePathForSnapshot(result.cwd),
		pkg: _normalizePathForSnapshot(result.pkg),
		ws: _normalizePathForSnapshot(result.ws),
		root: _normalizePathForSnapshot(result.root),
	};
}
