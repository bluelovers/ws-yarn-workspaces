/**
 * Created by user on 2019/6/4.
 */

import HostedGitInfo from 'hosted-git-info';
import { filterRemoteUrl, findConfigPathLocal, parseConfig } from '@git-lazy/info';

export function getHostedGitInfo(o: ReturnType<typeof parseConfig>)
{
	return HostedGitInfo.fromUrl(filterRemoteUrl(o))
}

export interface INpmHostedGitInfo
{
	bugs: string;
	repository: string;
	homepage: string;
	_: HostedGitInfo;
}

export function npmHostedGitInfoLazy(cwd?: string)
{
	try
	{
		return npmHostedGitInfo(cwd)
	}
	catch (e)
	{

	}
}

export function npmHostedGitInfo(cwd?: string)
{
	let file = findConfigPathLocal(cwd)

	if (file != null)
	{
		let o = parseConfig(file)

		let info = getHostedGitInfo(o)

		return npmHostedGitInfoCore(info)
	}
}

export function npmHostedGitInfoCore(info: HostedGitInfo): INpmHostedGitInfo
{
	return {
		homepage: info.docs({
			noCommittish: true,
		}),
		bugs: info.bugs({
			noCommittish: true,
		}),
		repository: info.https({
			noCommittish: true,
		}),

		_: info,
	}
}

export default npmHostedGitInfo
