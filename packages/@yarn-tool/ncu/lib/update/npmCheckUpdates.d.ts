import { IOptionsNpmCheckUpdates } from '../types';
import { IWrapDedupeCache } from '@yarn-tool/yarnlock/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type/index';
export declare function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>, ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>): Promise<Omit<IOptionsNpmCheckUpdates, "json_old" | "packageData"> & import("ts-type/index").ITSRequiredPick<IOptionsNpmCheckUpdates, "json_old"> & import("ts-type/index").ITSPartialPick<IOptionsNpmCheckUpdates, "packageData">>;
