/**
 * Created by user on 2018/9/20/020.
 */

import path = require('path');
import pkgDir = require('pkg-dir');
import fs = require('fs-extra');

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
