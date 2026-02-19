import { IOptionsNpmCheckUpdates } from '../types';
import { IWrapDedupeCache } from '@yarn-tool/yarnlock/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
export declare function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>, ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>): Promise<Omit<IOptionsNpmCheckUpdates, "packageData" | "json_old"> & import("ts-type").ITSRequiredPick<IOptionsNpmCheckUpdates, "json_old"> & import("ts-type").ITSPartialPick<IOptionsNpmCheckUpdates, "packageData">>;
