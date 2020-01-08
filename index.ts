/**
 * Created by user on 2020/1/8.
 */

import { workspacesPackagesList } from 'ws-pkg-list';
import findRoot from '@yarn-tool/find-root';
import fs from 'fs-extra';
import path from 'path';

let cwd = `G:\\Users\\The Project\\nodejs-yarn\\ws-create-yarn-workspaces`;

syncLockfile(cwd, {
	print: true,
})

export function syncLockfile(cwd: string, options: {
	print?: boolean
} = {})
{
	const { print } = options;

	const ws = findRoot({
		cwd
	});

	if (!ws.hasWorkspace)
	{
		throw new RangeError(`target dir not a yarn workspaces, ${ws.root}`)
	}

	const lockfile = `yarn.lock`;
	const lockfile_root = path.join(ws.root, lockfile);

	if (!fs.pathExistsSync(lockfile_root))
	{
		throw new RangeError(`yarn.lock not exists`)
	}

	print && console.log(`workspaces:`, ws.root, '\n');

	const label = `copy done`;

	print && console.time(label);

	workspacesPackagesList(ws.root, true)
		.forEach(pkg_dir => {

			print && console.log(`copy to... ${path.relative(ws.root, pkg_dir)}`);

			fs.copySync(lockfile_root, path.join(pkg_dir, lockfile), {
				overwrite: true,
				preserveTimestamps: true,
				dereference: true,
			})

		})
	;

	print && console.timeEnd(label);
}

export default syncLockfile
