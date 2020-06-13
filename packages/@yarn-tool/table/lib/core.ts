/**
 * Created by user on 2020/6/11.
 */

import Table, { TableConstructorOptions } from 'cli-table3';

export function createDependencyTable(options?: TableConstructorOptions)
{
	return new Table({
		colAligns: ['left', 'right', 'right', 'right'],
		//colAligns: ['left', 'center', 'center', 'center'],
		chars: {
			top: '',
			'top-mid': '',
			'top-left': '',
			'top-right': '',
			bottom: '',
			'bottom-mid': '',
			'bottom-left': '',
			'bottom-right': '',
			left: '',
			'left-mid': '',
			mid: '',
			'mid-mid': '',
			right: '',
			'right-mid': '',
			middle: '',
		},
		...options,
	});
}
