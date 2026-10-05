import { join } from "path";

/**
 * 套件根目錄的絕對路徑；以 __dirname 往上一層計算，
 * 確保測試在任何 cwd 下執行都能定位到套件根目錄。
 *
 * Absolute path of the package root, computed one level above __dirname so tests
 * can locate the package root regardless of the current working directory.
 */
export const __ROOT = join(__dirname, '..');

/**
 * 是否為 Windows 平台，供測試分支處理路徑分隔符等平台差異。
 *
 * Whether the platform is Windows; lets tests branch on path-separator and
 * other platform-specific behaviour.
 */
export const isWin = process.platform === "win32";

/**
 * 測試根目錄（__ROOT/test）。
 *
 * Test root directory (__ROOT/test).
 */
export const __TEST_ROOT = join(__ROOT, 'test');

/**
 * fixtures 根目錄；集中存放測試用的假套件，
 * 讀取時一律由此常量出發，避免各測試各自硬編碼路徑。
 *
 * Fixtures root; test packages live here in one place, and every test derives
 * paths from this constant instead of hard-coding its own.
 */
export const __TEST_FIXTURES = join(__TEST_ROOT, 'fixtures');
