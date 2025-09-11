import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { findRootLazy } from '@yarn-tool/find-root';
import { getModulesDir } from '@yarn-tool/node-modules/lib/util';
import { ensureSymlinkSync, lstatSync, pathExists, pathExistsSync, realpathSync, unlinkSync, renameSync } from 'fs-extra';
import { join } from 'path';
import { fsSameRealpath } from 'path-is-same';
import { isSymbolicLinkSync } from 'fs-stat';
import { fsSymlinkSync } from 'fs-symlink-extra';

export function fixWorkspacesPackageLinks(cwd?: string)
{
	const rootData = findRootLazy({
		cwd,
	});

	const node_modules = getModulesDir(rootData.root);

	const listable = wsPkgListable(rootData.root);

	return listable.filter((entry) => {

		let target = join(node_modules, entry.name);

		if (!pathExistsSync(target) || !isSymbolicLinkSync(target) && !fsSameRealpath(target, entry.location))
		{
			if (pathExistsSync(target))
			{
				renameSync(target, target + '.old_' + Math.random())
			}

			fsSymlinkSync(entry.location, target, {
				overwrite: true,
			});

			return true
		}
	})
}

export default fixWorkspacesPackageLinks
