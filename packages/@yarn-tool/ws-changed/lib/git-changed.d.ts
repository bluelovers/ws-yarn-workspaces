import { IListableRowExtra } from 'ws-pkg-list';
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
    list: IListableRowExtra[];
};
export default wsGitChanged;
