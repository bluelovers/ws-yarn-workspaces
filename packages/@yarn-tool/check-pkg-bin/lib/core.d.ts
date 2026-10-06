/**
 * Created by user on 2020/6/13.
 */
import { IPackageJson } from '@ts-type/package-dts';
/**
 * 判斷任意內容是否含 shebang（`#!`）開頭。
 * 回傳布林值而非直接依賴 truthy，是為了讓「無 shebang」與「比對失敗」都明確視為 false。
 *
 * Detect whether arbitrary content starts with a shebang (`#!`).
 * Returning an explicit boolean keeps "no shebang" and "match failure" both false.
 */
export declare function hasShebang(buf: Buffer | string): boolean;
/**
 * 檢查單一檔案是否存在且含 shebang。
 * 檔案不存在時回傳 undefined（而非 false），讓呼叫方得以區分
 * 「檔案缺少」與「檔案存在但沒有 shebang」兩種不同的失敗原因。
 *
 * Check whether a single file exists and contains a shebang.
 * Returns undefined (not false) when missing, so callers can distinguish
 * "file missing" from "file exists but lacks a shebang".
 */
export declare function checkFile(file: string): boolean;
/**
 * 依 package.json 的 bin 欄位逐檔檢查 shebang，
 * 並以 reduce 累積成固定的明細結構（而非僅回傳布林），
 * 以便 CLI 能對每一支可執行檔顯示檔案路徑與檢查結果。
 *
 * Check every bin entry from package.json for a shebang, accumulating a fixed
 * detail structure via reduce (instead of a bare boolean) so the CLI can show
 * the path and result for each executable.
 *
 * @param pkg 已解析的 package.json 物件 / parsed package.json object
 * @param cwd 套件根目錄，用於將 bin 的相對路徑解析為絕對路徑 /
 *           package root used to resolve relative bin paths to absolute ones
 */
export declare function checkPkgJson(pkg: IPackageJson, cwd: string): {
    file: string;
    filename: string;
    hasShebang: boolean;
}[];
