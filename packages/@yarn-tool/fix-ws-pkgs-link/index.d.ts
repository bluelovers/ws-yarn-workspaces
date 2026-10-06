/**
 * 修復 workspace 套件的符號連結
 * Fix symlinks for workspace packages
 *
 * 對每個套件檢查 `<node_modules>/<套件名>`：
 * 1. 連結不存在 → 直接建立
 * 2. 是實體檔案/目錄但 realpath 與套件路徑不同 → 先改名備份再建立連結
 * 3. 已是正確連結 → 略過（不列入回傳值）
 *
 * Checks `<node_modules>/<name>` for each package:
 * 1. Link missing → create it directly
 * 2. Real file/dir whose realpath differs from the package location →
 *    rename it as a backup, then create the link
 * 3. Already a correct link → skipped (not included in the return value)
 *
 * 以 rename 而非刪除保留既有檔案，避免使用者自製連結或實體安裝被永久破壞
 * Uses rename instead of delete to preserve existing files, so handmade
 * links or real installations are not destroyed permanently
 *
 * @param {string} [cwd] - 起始目錄，預設由 findRootLazy() 解析 / Starting directory; resolved by findRootLazy() when omitted
 * @returns 實際重建連結的套件項目 / Entries whose links were actually rebuilt
 */
export declare function fixWorkspacesPackageLinks(cwd?: string): import("ws-pkg-list/lib/types").IListableRow[];
export default fixWorkspacesPackageLinks;
