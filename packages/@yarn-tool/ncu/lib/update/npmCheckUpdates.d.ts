import { IOptionsNpmCheckUpdates } from '../types';
import { IWrapDedupeCache } from '@yarn-tool/yarnlock/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type/index';
export declare function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>, ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>): Promise<Pick<IOptionsNpmCheckUpdates, "dep" | "minimal" | "newest" | "packageManager" | "registry" | "silent" | "greatest" | "upgrade" | "semverLevel" | "removeRange" | "dedupe" | "cwd" | "json_new" | "json_changed" | "list_updated" | "loglevel" | "versionTarget" | "current" | "noSafe"> & import("ts-type").ITSRequiredPick<IOptionsNpmCheckUpdates, "json_old"> & import("ts-type").ITSPartialPick<IOptionsNpmCheckUpdates, "packageData">>;
