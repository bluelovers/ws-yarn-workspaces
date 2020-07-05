import { IListableRow } from 'ws-pkg-list';
export declare function wsGitChangedPrefix(cwd?: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: string[];
};
export declare function wsGitChanged(cwd: string, options?: {
    gitBin?: string;
}): {
    cwd: string;
    list: (IListableRow & {
        prefix: string;
    })[];
};
export default wsGitChanged;
