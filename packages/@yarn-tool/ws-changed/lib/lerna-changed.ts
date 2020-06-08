import crossSpawn from 'cross-spawn-extra';
import console from 'debug-color2/logger';
import { IListableRow, IListableRowExtra } from 'ws-pkg-list';
import { normalize } from 'upath2';
import { findRoot } from '@yarn-tool/find-root';
import { normalizeListableExtra } from 'ws-pkg-list/lib/util';

export function lernaChanged(cwd?: string, options?: {
	lernaBin?: string,
})
{
	cwd = findRoot({
		cwd: cwd ?? process.cwd(),
		throwError: true,
	}).root;

	let cp = crossSpawn.sync(options?.lernaBin ?? 'lerna', [
		'changed',
		'--loglevel=silent',
		'--json',
	], {
		cwd,
		stripAnsi: true,
	})

	let list = JSON.parse(cp.stdout.toString()) as IListableRowExtra[];

	list = normalizeListableExtra(list, cwd)

	return {
		cwd,
		list,
	}
}

export default lernaChanged
