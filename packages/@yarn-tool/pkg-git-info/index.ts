/**
 * Created by user on 2019/6/4.
 */

import HostedGitInfo from 'hosted-git-info';
import { parseConfig, filterRemoteUrl, findConfigPathLocal } from '@git-lazy/info';

export function getHostedGitInfo(o: ReturnType<typeof parseConfig>)
{
	return HostedGitInfo.fromUrl(filterRemoteUrl(o))
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

export function npmHostedGitInfoCore(info: HostedGitInfo)
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
