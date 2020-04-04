/**
 * Created by user on 2018/5/14/014.
 */

import findYarnWorkspaceRoot = require('find-yarn-workspace-root2');
import path = require('path');

function findWorkspacePackageJson(cwd?: string)
{
	let ws = findYarnWorkspaceRoot(cwd || process.cwd());

	if (ws)
	{
		return path.join(ws, 'package.json');
	}

	return null;
}

findWorkspacePackageJson.findPkg = findWorkspacePackageJson;
findWorkspacePackageJson.default = findWorkspacePackageJson;

export = findWorkspacePackageJson
