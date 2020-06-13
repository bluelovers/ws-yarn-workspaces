/**
 * Created by user on 2020/6/8.
 */
import { IListableRow, IListableRowExtra } from './types';
export declare function normalizeListableRow<T extends IListableRow>(row: T): T;
export declare function normalizeListable<T extends IListableRow>(list: T[]): T[];
export declare function normalizeListableRowExtra<T extends IListableRow>(_row: T, root: string): IListableRowExtra<T>;
export declare function normalizeListableExtra<T extends IListableRow>(list: T[], root: string): IListableRowExtra<T>[];
export declare function listableToRecord<T extends IListableRow>(list: T[]): Record<string, T>;
