/**
 * Created by user on 2020/4/9.
 */
export interface IPackedTarballInfo {
    /**
     * pkg-a@1.0.0
     */
    id: string;
    name: string;
    version: string;
    size: number;
    unpackedSize: number;
    shasum: string;
    integrity: any;
    filename: string;
    files: {
        path: string;
        size: number;
        mode: number;
    }[];
    entryCount: number;
    bundled: [];
    tarFilePath: string;
}
