import { join } from "path";

/**
 * 套件根目錄的絕對路徑，供測試定位專案檔使用；
 * 以 __dirname 往上一層計算，確保在不同 cwd 下執行測試仍正確。
 *
 * Absolute path of the package root, used by tests to locate project files;
 * computed from __dirname one level up so it stays correct regardless of cwd.
 */
export const __ROOT = join(__dirname, '..');

/**
 * 是否為 Windows 平台，供測試分支處理路徑分隔符等平台差異。
 *
 * Whether the platform is Windows; lets tests branch on path-separator and
 * other platform-specific behaviour.
 */
export const isWin = process.platform === "win32";
