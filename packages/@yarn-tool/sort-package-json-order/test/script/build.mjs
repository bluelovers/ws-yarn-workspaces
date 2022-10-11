import { sortOrder } from 'sort-package-json';
import { outputFile } from 'fs-extra';
import { resolve } from 'path';
import { __ROOT } from '../__root.js';
import { LF } from 'crlf-normalize';

let file = resolve(__ROOT, 'src', 'sort-order.ts');

/**
 * @type {string[]}
 */
let lines = [''];

let _sortOrder = sortOrder.slice();

if (!_sortOrder.includes('tsd'))
{
	_sortOrder.splice(_sortOrder.indexOf('tap') + 1, 0, 'tsd');
}

lines.push(`export const sortOrder = [`);
lines.push(`\t'` + _sortOrder.join(`',\n\t'`) + `',`);
lines.push(`] as const;`);
lines.push(``);
lines.push(``);

await outputFile(file, lines.join(LF))

