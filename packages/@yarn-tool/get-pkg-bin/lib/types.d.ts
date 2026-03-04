/**
 * Created by user on 2020/6/13.
 *
 * 類型定義模組
 * Type definitions module
 *
 * 此模組定義了 get-pkg-bin 使用的所有類型，
 * 包括選項配置、package.json 結構等。
 */
import { IPackageJson } from '@ts-type/package-dts';
import { IOptionsRequireResolve } from '@yarn-tool/resolve-package';
/**
 * 類似 package.json 的物件類型
 * Package.json-like object type
 *
 * @description
 * 接受標準的 IPackageJson 或任意物件。這種彈性設計允許：
 * - 使用完整的 IPackageJson 類型（來自 @ts-type/package-dts）
 * - 使用簡化的物件（僅包含必要的欄位如 name, bin）
 * - 使用任意物件（方便測試和特殊場景）
 *
 * @example
 * ```typescript
 * // 完整 package.json
 * const pkg1: IPackageJsonLike = {
 *   name: 'my-cli',
 *   version: '1.0.0',
 *   bin: './cli.js'
 * };
 *
 * // 簡化物件
 * const pkg2: IPackageJsonLike = {
 *   name: 'my-cli',
 *   bin: { 'my-cli': './cli.js' }
 * };
 * ```
 */
export type IPackageJsonLike = IPackageJson | Record<string, any>;
/**
 * 擴充解析選項介面（與 @yarn-tool/require-resolve 相容）
 * Extended resolution options interface (compatible with @yarn-tool/require-resolve)
 *
 * @description
 * 此介面從 @yarn-tool/resolve-package 中選取常用的解析選項，
 * 讓 get-pkg-bin 可以控制套件解析的行為。
 *
 * 包含的選項：
 * - includeGlobal: 是否搜尋全域 node_modules
 * - includeCurrentDirectory: 是否搜尋當前目錄
 * - cwd: 指定當前工作目錄
 * - paths: 額外的模組搜尋路徑
 */
export interface IOptionsResolveExtended extends Pick<IOptionsRequireResolve, 'includeGlobal' | 'includeCurrentDirectory' | 'cwd' | 'paths'> {
}
/**
 * get-pkg-bin 的選項配置
 * Options configuration for get-pkg-bin
 *
 * @description
 * 此類型定義了取得套件 bin 腳本時所需的選項，
 * 繼承自 IOptionsResolveExtended 以支援模組解析選項。
 *
 * 設計原則：
 * - 必須提供 `name` 或 `pkg` 其中之一作為套件識別方式
 * - 提供靈活的路徑解析選項（usePathResolve）
 * - 支援與 @yarn-tool/require-resolve 相同的擴充選項
 *
 * 使用場景：
 * 1. 已知套件名稱：使用 name + includeGlobal 搜尋全域套件
 * 2. 已有 package.json：直接傳入 pkg 物件
 * 3. 自訂解析行為：使用 usePathResolve 控制路徑解析方式
 *
 * @example
 * ```typescript
 * // 使用套件名稱（最常用）
 * const options: IOptions = { name: 'ts-node' };
 *
 * // 使用 package.json 物件（避免額外檔案系統操作）
 * const options: IOptions = { pkg: require('./package.json') };
 *
 * // 搜尋全域安裝的套件
 * const options: IOptions = {
 *   name: 'typescript',
 *   includeGlobal: true,
 * };
 *
 * // 兩者都提供（name 優先於 pkg.name）
 * const options: IOptions = {
 *   name: 'my-package',
 *   pkg: { name: 'my-package', bin: './cli.js' },
 *   pkgRoot: '/path/to/package',
 * };
 *
 * // 使用路徑解析（而非 require.resolve）
 * const options: IOptions = {
 *   name: 'my-local-pkg',
 *   pkgRoot: '/path/to/pkg',
 *   usePathResolve: true,
 * };
 * ```
 */
export type IOptions = IOptionsResolveExtended & {
    /**
     * 套件根目錄路徑
     * Package root directory path
     *
     * @description
     * 指定套件的根目錄路徑，用於解析 bin 腳本的相對路徑。
     *
     * 若未提供：
     * - 當使用 name 時，會自動從套件名稱解析
     * - 當使用 pkg 時，若無 pkgRoot 則無法解析為絕對路徑
     *
     * @example
     * ```typescript
     * { pkgRoot: '/path/to/node_modules/my-package' }
     * ```
     */
    pkgRoot?: string;
    /**
     * 是否使用路徑解析而非 require.resolve
     * Whether to use path resolution instead of require.resolve
     *
     * @description
     * 控制路徑解析的策略：
     *
     * - true：使用 upath2.resolve(pkgRoot, bin) 進行相對路徑解析
     *   適用於已知道確切套件位置的情況
     *
     * - false（預設）：使用 require.resolve(bin, { paths: [pkgRoot] })
     *   適用於需要完整 Node.js 模組解析演算法的情況
     */
    usePathResolve?: boolean;
} & ({
    /**
     * 套件名稱（可選，若有提供 pkg）
     * Package name (optional if pkg is provided)
     *
     * @description
     * 當提供 pkg 時，name 可作為覆寫值或備用值。
     * 若未提供，會從 pkg.name 自動取得。
     */
    name?: string;
    /**
     * package.json 物件（必須）
     * package.json object (required)
     *
     * @description
     * 直接提供 package.json 內容，避免額外的檔案系統操作。
     * 必須包含 name 和 bin 欄位才能正確取得 bin 腳本。
     */
    pkg: IPackageJsonLike;
} | {
    /**
     * 套件名稱（必須）
     * Package name (required)
     *
     * @description
     * 套件名稱，用於通過 Node.js 模組解析演算法尋找套件。
     * 支援 scope 套件（如 @scope/name）。
     */
    name: string;
    /**
     * package.json 物件（可選，若提供 name 則自動解析）
     * package.json object (optional, auto-resolved if name is provided)
     *
     * @description
     * 若已載入 package.json，可提供以避免重複解析。
     * 若未提供，會根據 name 自動解析取得。
     */
    pkg?: IPackageJsonLike;
});
