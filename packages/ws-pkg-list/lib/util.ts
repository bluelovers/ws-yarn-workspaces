/**
 * Created by user on 2020/6/8.
 */

import { normalize, relative } from 'upath2';
import { IListableRow, IListableRowExtra } from './types';

export function normalizeListableRow(row: IListableRow)
{
	row.location = normalize(row.location);

	return row
}

export function normalizeListable(list: IListableRow[])
{
	return list.map((row: IListableRow) =>
	{
		return normalizeListableRow(row)
	})
}

export function normalizeListableRowExtra(_row: IListableRow, root: string): IListableRowExtra
{
	let row = normalizeListableRow(_row) as IListableRowExtra;

	row.prefix = relative(root, row.location)

	return row
}

export function normalizeListableExtra(list: IListableRow[], root: string): IListableRowExtra[]
{
	return list.map((row: IListableRow) =>
	{
		return normalizeListableRowExtra(row, root)
	})
}
