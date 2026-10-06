/**
 * npm 套件名稱驗證核心規則
 * Core rules of npm package name validation
 *
 * 規則分為兩類：errors 代表名稱完全不合法（無法發布），
 * warnings 代表舊版 npm 曾允許、現在只會被警告的名稱。
 * The rules fall into two kinds: errors mean the name is simply invalid (unpublishable),
 * while warnings flag names old npm allowed but is now only tolerated with a notice.
 *
 * @module @yarn-tool/validate-npm-package-name/lib/validateNpmPackageNameCore
 */
import { IOptions } from './types';
/**
 * 驗證 npm 套件名稱
 * Validate an npm package name
 *
 * @param {string} name - 待驗證的名稱 / The name to validate
 * @param {IOptions} [options] - 黑名單與目標 Node.js 版本等選項 / Options such as blacklist and target Node.js version
 * @returns {IResult} 含 warnings 與 errors 的驗證結果 / A validation result carrying warnings and errors
 *
 * @example
 * validate('some-package'); // { validForNewPackages: true, validForOldPackages: true }
 */
export declare function validate(name: string, options?: IOptions): import("./types").IResult;
export default validate;
