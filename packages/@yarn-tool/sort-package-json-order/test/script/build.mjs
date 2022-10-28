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

insertAfter(_sortOrder, 'tap', 'tsd');
insertAfter(_sortOrder, 'license', 'licenses');

lines.push(`export const sortOrder = [`);
lines.push(`\t'` + _sortOrder.join(`',\n\t'`) + `',`);
lines.push(`] as const;`);
lines.push(``);
lines.push(``);

await outputFile(file, lines.join(LF))

function insertAfter(arr, where, value)
{
	if (!arr.includes(value))
	{
		let index = arr.indexOf(where);
		if (index === -1)
		{
			throw new Error(`'${where}' is not exists`)
		}
		arr.splice(index + 1, 0, value);
	}
	return arr
}
