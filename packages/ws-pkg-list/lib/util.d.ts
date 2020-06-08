/**
 * Created by user on 2020/6/8.
 */
import { IListableRow, IListableRowExtra } from './types';
export declare function normalizeListableRow(row: IListableRow): IListableRow;
export declare function normalizeListable(list: IListableRow[]): IListableRow[];
export declare function normalizeListableRowExtra(_row: IListableRow, root: string): IListableRowExtra;
export declare function normalizeListableExtra(list: IListableRow[], root: string): IListableRowExtra[];
