import { IOptionsInstallDepsFromQuery, IOptionsInstallDepsFromWorkspaces } from './types';
import npa from '@yarn-tool/npm-package-arg-util';
import { fetchRemoteInfo } from './util/fetchRemoteInfo';

/**
 * @todo implement installDepsFromQuery
 */
export async function installDepsFromQuery<T extends string>(packageNames: T[], options: IOptionsInstallDepsFromQuery = {},
)
{
	throw new Error('not implement')
}
