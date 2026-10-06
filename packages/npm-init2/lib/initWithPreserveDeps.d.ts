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
import { IPackageJson } from '@ts-type/package-dts';
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
export declare function initWithPreserveDeps({ npmClient, cwd, args, old_pkg, pkg_file_path }: {
    npmClient: string;
    cwd: string;
    args: string[];
    old_pkg: IPackageJson;
    pkg_file_path: string;
}): {
    cp: import("cross-spawn-extra").SpawnSyncReturns<Buffer<ArrayBufferLike>>;
};
/**
 * 預設匯出 initWithPreserveDeps，讓 `import initWithPreserveDeps from '...'` 可直接使用
 * Default-export initWithPreserveDeps so `import initWithPreserveDeps from '...'` works directly
 */
export default initWithPreserveDeps;
