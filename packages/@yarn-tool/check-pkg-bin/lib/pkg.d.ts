/**
 * Created by user on 2020/6/13.
 */
/**
 * 讀取指定目錄的 package.json，並檢查其所有 bin 檔案是否含 shebang。
 * 預設使用 process.cwd()，讓 CLI 與 API 在未指定路徑時行為一致。
 *
 * Read the package.json of a directory and check whether all of its bin files
 * contain a shebang. Defaults to process.cwd() so CLI and API behave the same
 * when no path is given.
 *
 * @param pkgDir 套件根目錄 / package root directory
 */
export declare function checkPkgDir(pkgDir?: string): {
    name: string;
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    pkgDir: string;
    result: {
        file: string;
        filename: string;
        hasShebang: boolean;
    }[];
    valid: boolean;
};
