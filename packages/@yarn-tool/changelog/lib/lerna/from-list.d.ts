import { IListableRow } from 'ws-pkg-list';
import { IOptionsWithType, IOptionsUpdateChangelog } from '../types';
export declare function updateChangelogByCwd(cwd?: string, options?: Partial<IOptionsWithType<IOptionsUpdateChangelog>>): Promise<{
    cwd: string;
    rootPath: string;
    options: Partial<IOptionsWithType<IOptionsUpdateChangelog>>;
    pkg: IListableRow;
    logPath: string;
    newEntry: string;
    version: string;
}>;
export default updateChangelogByCwd;
