import { IListableRow, IListableRowExtra } from 'ws-pkg-list';
export declare function lernaChanged(cwd?: string, options?: {
    lernaBin?: string;
}): {
    cwd: string;
    list: IListableRowExtra<IListableRow>[];
};
export default lernaChanged;
