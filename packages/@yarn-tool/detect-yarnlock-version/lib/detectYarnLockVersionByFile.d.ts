/**
 * 開啟指定檔案並只讀取前 160 bytes 來判斷 lockfile 格式，
 * 因此不必把整份 lockfile 載入記憶體。
 *
 * Opens the given file and detects the lockfile format from its first 160
 * bytes, so the whole lockfile never has to be loaded into memory.
 *
 * @param file yarn.lock 檔案路徑 / path of the yarn.lock file
 * @returns 偵測到的版本列舉，無法判定時為 `unknown` /
 * the detected version enum, or `unknown` when undetectable
 */
export declare function detectYarnLockVersionByFile(file: string): import("@yarn-tool/yarnlock-types").EnumDetectYarnLock;
/**
 * 以目錄下的 `yarn.lock` 進行偵測，方便呼叫端直接傳入專案目錄。
 *
 * Detects from the `yarn.lock` inside the given directory, so callers can
 * pass a project directory directly.
 *
 * @param dir 目錄路徑，須包含 `yarn.lock` / directory path expected to contain `yarn.lock`
 * @returns 偵測到的版本列舉 / the detected version enum
 */
export declare function detectYarnLockVersionByDir(dir: string): import("@yarn-tool/yarnlock-types").EnumDetectYarnLock;
/**
 * 以檔案路徑偵測作為預設匯出，呼應最常見的使用情境。
 *
 * Default export keyed on the file-path detector, matching the most common
 * usage.
 */
export default detectYarnLockVersionByFile;
