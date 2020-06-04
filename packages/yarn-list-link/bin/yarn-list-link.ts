#!/usr/bin/env node

import yarnListLink from '..';

let cwd = process.cwd();

let ls = yarnListLink(cwd);

if (ls && ls.length)
{
	ls.forEach(v => console.log(v))
}
else
{
	console.error(`not exists any yarn link in path '${cwd}'`);
	process.exit(1);
}
