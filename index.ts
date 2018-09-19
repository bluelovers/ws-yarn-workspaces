/**
 * Created by user on 2018/9/20/020.
 */

import * as findYarnWorkspaceRoot from 'find-yarn-workspace-root';
import * as path from 'path';
import * as pkgDir from 'pkg-dir';
import * as fs from 'fs-extra';
import getConfig, { parseStaticPackagesPaths } from 'workspaces-config';
import * as crossSpawn from 'cross-spawn';

export function yarnListLink(cwd: string)
{
	let root = pkgDir.sync(cwd);

	if (!root || !fs.existsSync(root))
	{
		throw new Error(`can't found current package root`);
	}

	let file = path.join(root, 'node_modules', '.yarn-integrity');

	let ls: string[];

	if (fs.existsSync(file))
	{
		ls = fs.readJSONSync(file).linkedModules
	}

	return ls || null;
}

export default yarnListLink;

// @ts-ignore
Object.assign(yarnListLink, exports, {
	yarnListLink,
});

// @ts-ignore
export = yarnListLink;
