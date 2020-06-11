/**
 * Created by user on 2020/6/11.
 */
/// <reference types="node" />
import { IYarnLockfileParseObject, IYarnLockfileParseFull, IYarnLockfileParseObjectRow } from './types';
export declare function parseFull(text: string | Buffer): IYarnLockfileParseFull;
export declare function parse(text: string | Buffer): Record<string, IYarnLockfileParseObjectRow<string[]>>;
export declare function stringify(json: IYarnLockfileParseObject): string;
