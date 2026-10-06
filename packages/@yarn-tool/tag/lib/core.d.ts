/**
 * 標籤選項的驗證與格式化
 * Validation and formatting of tag options
 *
 * 此檔只處理字串與選項，不執行 git；方便單元測試與 CLI/API 共用。
 * Only strings and options are handled here, no git execution, so both the
 * CLI and API can share it with straightforward unit tests.
 */
import { IOptionsPackageTagInput, IPackageJsonWithVersion } from './types';
/**
 * 驗證並補齊標籤選項
 * Validate and fill in tag options
 *
 * @param options - 原始輸入選項 / Raw input options
 * @returns 補齊後的選項 / Completed options
 * @throws Error 當版本或（需要時）名稱缺失時 / When the version or, if required, the name is missing
 */
export declare function handleOptions(options: IOptionsPackageTagInput): {
    cwd: string;
    name: string;
    version: string;
    tagPrefix: string;
    excludeName?: boolean;
    pkg?: IPackageJsonWithVersion;
    message?: string;
    forceGitTag?: boolean;
    signGitTag?: boolean;
    annotated?: boolean;
    target?: string;
};
/**
 * 依選項組出標籤名稱（不執行 git）
 * Build the tag name from options (no git execution)
 *
 * 組裝順序刻意為「版本 → 前綴 → 名稱」，
 * 使 tagPrefix 作用在版本號之前（如 v1.0.0）再冠上 `<name>@`。
 *
 * Assembly order is deliberately version → prefix → name, so the prefix
 * applies before the name is added (e.g. `pkg@v1.0.0`).
 *
 * @param options - 原始輸入選項 / Raw input options
 * @returns 標籤名稱 / Tag name
 * @throws Error 當版本或（需要時）名稱缺失時 / When the version or, if required, the name is missing
 */
export declare function formatPackageTag(options: IOptionsPackageTagInput): string;
