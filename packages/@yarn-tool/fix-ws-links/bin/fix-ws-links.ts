#!/usr/bin/env node

import { fixYarnWorkspaceLinks } from '../index';
import { fixWorkspacesPackageLinks } from '@yarn-tool/fix-ws-pkgs-link';

let cwd = process.cwd();

console.log(`check and try fix links from: ${cwd}`)
fixYarnWorkspaceLinks(cwd, {
	verbose: true,
	runYarnAfter: process.argv.includes('--runYarnAfter'),
})

let wsp = fixWorkspacesPackageLinks(cwd)

if (wsp.length)
{
	console.log(`node_modules links fixed`)
	wsp.forEach(r => r.name)
}
