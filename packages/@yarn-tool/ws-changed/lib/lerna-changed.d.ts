import { IListableRowExtra } from 'ws-pkg-list';
export declare function lernaChanged(cwd?: string, options?: {
    lernaBin?: string;
}): {
    cwd: string;
    list: IListableRowExtra[];
};
export default lernaChanged;
