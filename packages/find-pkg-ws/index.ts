/**
 * Created by user on 2018/5/14/014.
 */

import { findWorkspaceRoot as findYarnWorkspaceRoot } from 'find-yarn-workspace-root2/core';
import { join } from 'path';

function findWorkspacePackageJson(cwd?: string)
{
	let ws = findYarnWorkspaceRoot(cwd || process.cwd());

	if (ws)
	{
		return join(ws, 'package.json');
	}

	return null;
}

findWorkspacePackageJson.findPkg = findWorkspacePackageJson;
findWorkspacePackageJson.default = findWorkspacePackageJson;

export = findWorkspacePackageJson
