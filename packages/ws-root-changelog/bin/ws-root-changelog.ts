#!/usr/bin/env node

import 'v8-compile-cache';
import {
	getWorkspacesRootChangelogPath,
	outputWorkspacesRootChangelog,
	outputWorkspacesRootChangelogAsync,
} from '../index';
import { dirname, resolve } from 'upath2';

let argv = process.argv.slice(2);

let input = resolve(process.cwd(), argv[0] ?? '');

console.log(`input: ${input}`);

const file = getWorkspacesRootChangelogPath(input);

const cwd = dirname(file);

console.log(`target dir: ${cwd}`);

let ret = outputWorkspacesRootChangelog(cwd, file);

console.log(`output file: ${ret.file}`);
