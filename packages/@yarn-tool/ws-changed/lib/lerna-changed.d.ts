import { IListableRow } from 'ws-pkg-list';
export declare function lernaChanged(cwd?: string, options?: {
    lernaBin?: string;
}): {
    cwd: string;
    list: (IListableRow & {
        prefix: string;
    })[];
};
export default lernaChanged;
