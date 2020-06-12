import { IOptions } from './lib/types';
export * from './lib/types';
export * from './util';
export declare function normalizePackageBins(options: IOptions): Record<string, string>;
export declare function defaultPackageBin(options: IOptions, defaultKey?: string): string;
export default normalizePackageBins;
