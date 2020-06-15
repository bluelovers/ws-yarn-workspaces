/**
 * Created by user on 2020/6/8.
 */

import { normalize, relative, join } from 'upath2';
import { IListableRow, IListableRowExtra } from './types';

export function normalizeListableRow<T extends IListableRow>(row: T)
{
	row.location = normalize(row.location);

	if (typeof row.manifestLocation === 'undefined')
	{
		row.manifestLocation = join(row.location, 'package.json');
	}

	return row
}

export function normalizeListable<T extends IListableRow>(list: T[])
{
	return list.map((row: T) =>
	{
		return normalizeListableRow(row)
	})
}

export function normalizeListableRowExtra<T extends IListableRow>(_row: T, root: string): IListableRowExtra<T>
{
	let row = normalizeListableRow(_row) as IListableRowExtra<T>;

	row.prefix = relative(root, row.location)

	return row
}

export function normalizeListableExtra<T extends IListableRow>(list: T[], root: string): IListableRowExtra<T>[]
{
	return list.map((row: T) =>
	{
		return normalizeListableRowExtra(row, root)
	})
}

export function listableToRecord<T extends IListableRow>(list: T[])
{
	return list.reduce((a, row) =>
	{
		a[row.name] = row
		return a
	}, {} as Record<string, T>)
}
