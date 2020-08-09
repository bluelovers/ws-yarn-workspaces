import Bluebird from 'bluebird';
import { IOptions } from './types';
export declare function getCacheRoot(_options?: IOptions | string): string;
export declare function getCacheRootAsync(options?: IOptions | string): Bluebird<string>;
