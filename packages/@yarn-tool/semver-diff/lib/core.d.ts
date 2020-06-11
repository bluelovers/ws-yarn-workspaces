/**
 * Created by user on 2020/6/11.
 */
import { ITSRequireAtLeastOne } from 'ts-type';
import { IOptionsParseVersionsDiff, IParseVersionsDiffCore } from './types';
export declare function parseVersionsDiffCore(from: string, to: string, options?: IOptionsParseVersionsDiff): IParseVersionsDiffCore;
export declare function colorizeDiffCore(from: string, to: string, options?: ITSRequireAtLeastOne<IOptionsParseVersionsDiff, 'chalk'>): string;
