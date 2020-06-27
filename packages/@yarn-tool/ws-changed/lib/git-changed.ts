import { wsPkgListableFromPaths } from 'ws-pkg-list/lib/listable';
import { wsGitDiffStagedDir } from './git-util';
import getConfig from 'workspaces-config';
import micromatch from 'micromatch';
import globRegex from 'glob-regex';
import { array_unique_overwrite } from 'array-hyper-unique/core';
import { normalizeListableExtra } from 'ws-pkg-list/lib/util';
import { IListableRowExtra, IListableRow } from 'ws-pkg-list';

export function wsGitChangedPrefix(cwd?: string, options?: {
	gitBin?: string,
})
{
	let data = wsGitDiffStagedDir(cwd ?? process.cwd(), options)

	let config = getConfig(data.cwd);

	let source = config.packages.map(p =>
	{
		let re = globRegex(p)
		let source = re.source.replace(/\$$/, '');
		return source
	}).join('|');

	let re = new RegExp(`(${source})`, 'i');

	let list = data.list
		.map(p => {
		return re.exec(p)?.[0]
	})
		.filter(r => r?.length)
	;

	array_unique_overwrite(list)

	return {
		cwd: data.cwd,
		list,
	}
}

export function wsGitChanged(cwd: string, options?: {
	gitBin?: string,
})
{
	let data = wsGitChangedPrefix(cwd, options);

	let list = wsPkgListableFromPaths(data.list, data.cwd) as IListableRowExtra[]

	list = normalizeListableExtra(list, data.cwd)

	return {
		cwd: data.cwd,
		list,
	}
}

export default wsGitChanged
