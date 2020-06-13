/**
 * Created by user on 2020/6/13.
 */
import { Table } from 'cli-table3';

export function applyStyleBorderless(table: Table)
{
	Object.assign(table.options, {
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
	})

	return table
}
