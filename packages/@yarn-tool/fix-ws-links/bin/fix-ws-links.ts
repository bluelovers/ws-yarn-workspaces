#!/usr/bin/env node

import fixYarnWorkspaceLinks from '../index';

let cwd = process.cwd();

console.log(`check and try fix links from: ${cwd}`)
fixYarnWorkspaceLinks(cwd, {
	verbose: true,
})
