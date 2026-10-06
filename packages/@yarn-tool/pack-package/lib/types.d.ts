/**
 * Created by user on 2020/4/9.
 */
/**
 * 已打包 tarball 的詳細資訊結構。
 * 欄位對應 @lerna/get-packed 的回傳值，供 tarball() 與報表列印共用。
 *
 * Detailed info of a packed tarball. Fields mirror what @lerna/get-packed
 * returns, shared by tarball() and the report printer.
 */
export interface IPackedTarballInfo {
    /**
     * 形如 `pkg-a@1.0.0` 的套件識別字串。
     * Identifier string in the form `pkg-a@1.0.0`.
     */
    id: string;
    /** 套件名稱 / package name */
    name: string;
    /** 套件版本 / package version */
    version: string;
    /** 壓縮檔大小（位元組）/ compressed size in bytes */
    size: number;
    /** 解壓後大小（位元組）/ unpacked size in bytes */
    unpackedSize: number;
    /** SHA-1 校驗和 / SHA-1 checksum */
    shasum: string;
    /** 完整性校驗字串（SRI 格式）/ integrity hash string (SRI format) */
    integrity: any;
    /** tarball 檔名 / tarball filename */
    filename: string;
    /** 收錄檔案明細（路徑、大小、權限）/ included file details (path, size, mode) */
    files: {
        path: string;
        size: number;
        mode: number;
    }[];
    /** 收錄項目總數 / total number of included entries */
    entryCount: number;
    /** 打包時被 bundle 的項目（目前固定為空）/ bundled entries (currently always empty) */
    bundled: [];
    /** tarball 的檔案系統路徑 / filesystem path of the tarball */
    tarFilePath: string;
}
