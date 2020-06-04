/**
 * Created by user on 2020/6/5.
 */

import { existsSync, readJSONSync } from 'fs-extra';
import { join, normalize } from "upath2";
import findWorkspaceRoot from 'find-yarn-workspace-root2/core';

export function getYarnIntegrityPath(cwd: string)
{
	return join(cwd, 'node_modules', '.yarn-integrity')
}

export function yarnListLinkCore(cwd: string): string[]
{
	const file = getYarnIntegrityPath(cwd);

	if (existsSync(file))
	{
		let { linkedModules = [] as string[] } = readJSONSync(file).linkedModules
		return linkedModules
			.map(v => normalize(v))
		;
	}
}

export function yarnListLink(cwd: string): string[]
{
	let root = findWorkspaceRoot(cwd);

	if (!root || !existsSync(root))
	{
		throw new Error(`can't found current package root`);
	}

	return yarnListLinkCore(root)
}

yarnListLink.yarnListLink = yarnListLink;
yarnListLink.default = yarnListLink;

export default yarnListLink;
