/**
 * Created by user on 2020/6/11.
 */
import { ITSRequireAtLeastOne } from 'ts-type';
import { IOptionsParseVersionsDiff, IOptionsParseVersionsDiffPlus } from './types';
export declare function colorizeDiff(from: string, to: string, options: ITSRequireAtLeastOne<IOptionsParseVersionsDiff, keyof IOptionsParseVersionsDiffPlus>): string;
