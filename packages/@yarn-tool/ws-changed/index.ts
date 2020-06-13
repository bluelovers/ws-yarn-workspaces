/**
 * Created by user on 2020/6/8.
 */

import { wsGitChanged } from './lib/git-changed';
import { lernaChanged } from './lib/lerna-changed';
import { IListableRowExtra, IListableRow } from 'ws-pkg-list';

export type { IListableRowExtra }

export { lernaChanged, wsGitChanged }

export function wsChanged(cwd?: string, options?: {
	gitBin?: string,
	lernaBin?: string,
})
{
	let data1 = lernaChanged(cwd ?? process.cwd(), options)

	let data2 = wsGitChanged(data1.cwd, options)

	cwd = data1.cwd;

	return {
		cwd,
		changed: data1.list,
		staged: data2.list,
	}
}

export default wsChanged
