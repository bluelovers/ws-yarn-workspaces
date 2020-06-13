/**
 * Created by user on 2020/6/8.
 */
import { wsGitChanged } from './lib/git-changed';
import { lernaChanged } from './lib/lerna-changed';
import { IListableRowExtra, IListableRow } from 'ws-pkg-list';
export type { IListableRowExtra };
export { lernaChanged, wsGitChanged };
export declare function wsChanged(cwd?: string, options?: {
    gitBin?: string;
    lernaBin?: string;
}): {
    cwd: string;
    changed: (IListableRow & {
        prefix: string;
    })[];
    staged: (IListableRow & {
        prefix: string;
    })[];
};
export default wsChanged;
