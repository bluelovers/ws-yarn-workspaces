"use strict";
/**
 * @fileoverview Initialization helper that keeps existing dependencies
 * @description 初始化套件並保留既有依賴項的輔助模組
 *
 * 本模組負責呼叫套件管理器執行 init，並在成功後把舊的依賴欄位寫回新建的 package.json。
 * This module runs the package manager's init and writes the old dependency fields back into
 * the freshly created package.json afterwards.
 *
 * @module npm-init2/lib/initWithPreserveDeps
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWithPreserveDeps = initWithPreserveDeps;
const cross_spawn_extra_1 = require("cross-spawn-extra");
const npm_package_json_loader_1 = require("npm-package-json-loader");
/**
 * 執行 npm/yarn 初始化並保留舊專案的依賴項
 * Run npm/yarn init while preserving the previous project's dependencies
 *
 * 初始化指令會重建 package.json 並清掉依賴欄位，因此在子行程成功後，
 * 再把 old_pkg 的 dependencies / devDependencies 寫回，避免既有依賴遺失。
 *
 * The init command rebuilds package.json and drops its dependency fields, so once the child
 * process succeeds the `dependencies` / `devDependencies` of `old_pkg` are written back to
 * avoid losing existing dependencies.
 *
 * @param {object} options - 初始化選項 / initialization options
 *
 * @param {string} options.npmClient - 執行的套件管理器 / package manager to run
 * @param {string} options.cwd - 執行目錄 / working directory of the child process
 * @param {string[]} options.args - 傳給套件管理器的參數 / arguments passed to the package manager
 * @param {IPackageJson} options.old_pkg - 初始化前的 package.json / the previous package.json
 * @param {string} options.pkg_file_path - 目標 package.json 路徑 / path of the target package.json
 *
 * @returns {{ cp }} 子行程結果；cp.error 存在代表失敗 / child process result; a truthy `cp.error` means failure
 *
 * @example
 * const { cp } = initWithPreserveDeps({
 *   npmClient: 'npm',
 *   cwd: targetDir,
 *   args: ['init', '-y'],
 *   old_pkg,
 *   pkg_file_path: join(targetDir, 'package.json'),
 * });
 */
function initWithPreserveDeps({ npmClient, cwd, args, old_pkg, pkg_file_path }) {
    /**
     * 以 stdio: inherit 讓子行程直接沿用目前終端的輸入輸出；
     * 關閉顏色（FORCE_COLOR=0、NO_COLOR=1）避免控制碼污染後續輸出
     *
     * `stdio: inherit` lets the child reuse the current terminal's input/output; colors are
     * disabled (FORCE_COLOR=0, NO_COLOR=1) so escape sequences do not pollute later output
     */
    const cp = (0, cross_spawn_extra_1.sync)(npmClient, args, {
        stdio: 'inherit',
        cwd,
        env: {
            FORCE_COLOR: "0",
            NO_COLOR: "1",
        }
    });
    /**
     * 只有初始化成功且有舊資料時才還原依賴；
     * 失敗時不碰 package.json，讓呼叫端能取得原始錯誤狀態
     *
     * Restore dependencies only when init succeeded and old data exists; the package.json is
     * left untouched on failure so the caller sees the original error state
     */
    if (!cp.error && old_pkg) {
        let pkg = new npm_package_json_loader_1.PackageJsonLoader(pkg_file_path);
        /**
         * 檔案確實存在才寫入，避免初始化失敗時憑空建立 package.json
         * Write only when the file exists, so a failed init does not conjure up a package.json
         */
        if (pkg.exists()) {
            /**
             * 只還原依賴欄位；其餘舊欄位由呼叫端（index.ts）另行合併
             * Only the dependency fields are restored here; the caller (index.ts) merges the
             * other legacy fields separately
             */
            pkg.data.dependencies = old_pkg.dependencies;
            pkg.data.devDependencies = old_pkg.devDependencies;
            pkg.writeOnlyWhenLoaded();
        }
    }
    return { cp };
}
/**
 * 預設匯出 initWithPreserveDeps，讓 `import initWithPreserveDeps from '...'` 可直接使用
 * Default-export initWithPreserveDeps so `import initWithPreserveDeps from '...'` works directly
 */
exports.default = initWithPreserveDeps;
//# sourceMappingURL=initWithPreserveDeps.js.map