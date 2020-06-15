import { IListableRow } from 'ws-pkg-list';
import { IOptionsWithType, IOptionsUpdateChangelog } from '../types';
export declare function updateChangelogByCwd(cwd?: string, options?: Partial<IOptionsWithType<IOptionsUpdateChangelog>>): Promise<{
    cwd: string;
    rootPath: string;
    options: Partial<import("../types").IOptionsBase & Pick<import("../types").IOptionsBaseCore, never> & import("ts-type").ITSRequiredPick<import("../types").IOptionsBaseCore, "changelogPreset"> & import("ts-type").ITSPartialPick<import("../types").IOptionsBaseCore, "rootPath"> & {
        version?: string;
    } & {
        type?: string;
    }> | Partial<import("../types").IOptionsBase & Pick<import("../types").IOptionsBaseCore, never> & import("ts-type").ITSRequiredPick<import("../types").IOptionsBaseCore, "rootPath"> & import("ts-type").ITSPartialPick<import("../types").IOptionsBaseCore, "changelogPreset"> & {
        version?: string;
    } & {
        type?: string;
    }>;
    pkg: IListableRow;
    logPath: string;
    newEntry: string;
}>;
export default updateChangelogByCwd;
