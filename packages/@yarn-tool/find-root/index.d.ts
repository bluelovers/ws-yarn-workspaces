/**
 * Monorepo Workspace Root Directory Finder
 *
 * 此模組提供尋找 workspace 根目錄的進階功能，
 * 包含路徑驗證、錯誤處理和斷言函數。
 */
import { ITSPickExtra } from 'ts-type/lib/type/record';
/**
 * findRoot 函數的返回類型
 *
 * 包含 workspace 相關的所有路徑資訊和狀態標記。
 */
export interface IFindRootReturnType {
    /** Current working directory (the given input path) */
    cwd: string;
    /** Nearest package root directory found above cwd */
    pkg: string;
    /** Workspace root directory found from cwd */
    ws: string;
    /** Whether cwd is located inside a workspace */
    hasWorkspace: boolean;
    /** Whether the nearest package root is the workspace root */
    isWorkspace: boolean;
    /** Project root (workspace root if present, otherwise package root) */
    root: string;
    /** Whether the nearest package root is the project root */
    isRoot: boolean;
    /** Whether the nearest package root exists and is not the workspace root */
    isPkg: boolean;
}
/**
 * findRoot 函數的選項配置
 */
export interface IFindRootOptions {
    /** 當前工作目錄 */
    cwd: string;
    /** 是否跳過 workspace 檢查 */
    skipCheckWorkspace?: boolean | string;
    /** 找不到時是否拋出錯誤 */
    throwError?: boolean;
    /** 是否要求必須位於 workspace */
    shouldHasWorkspaces?: boolean;
    /** 是否要求最近的套件根目錄不能是 workspace 根目錄 */
    shouldNotWorkspacesRoot?: boolean;
}
/**
 * 提供更方便的呼叫方式，選項參數皆為可選。
 *
 * @param {Partial<IFindRootOptions>} [options] - 選項配置（部分可選）
 * @param {boolean} [_throwError] - 是否在找不到時拋出錯誤
 * @returns {IFindRootReturnType|null} 根目錄資訊物件，若找不到則返回 null
 *
 * @example
 * const rootData = findRootLazy();
 * console.log(rootData?.root); // 專案根目錄
 */
export declare function findRootLazy(options?: Partial<IFindRootOptions>, _throwError?: boolean): IFindRootReturnType;
/**
 * 尋找 workspace 根目錄的核心函數
 *
 * 此函數會分析指定目錄，返回包含 workspace 相關資訊的完整物件。
 * 支援多種驗證選項和錯誤處理模式。
 *
 * @param {IFindRootOptions} options - 完整的選項配置
 * @param {boolean} [_throwError] - 是否在找不到時拋出錯誤
 * @returns {IFindRootReturnType|null} 根目錄資訊物件，若找不到則返回 null
 * @throws {RangeError} 當 options.cwd 為空或無效時
 * @throws {RangeError} 當同時啟用 shouldHasWorkspaces 和 skipCheckWorkspace 時
 * @throws {RangeError} 當找不到套件根目錄且啟用 throwError 時
 */
export declare function findRoot(options: IFindRootOptions, _throwError?: boolean): IFindRootReturnType;
/**
 * 建立虛擬的根目錄資料物件
 *
 * 此函數用於基於現有的 rootData 建立新的資料物件，
 * 可覆寫部分屬性並自動重新計算 isRoot、isWorkspace 和 isPkg。
 *
 * @param {IFindRootReturnType} rootData - 原始的根目錄資料
 * @param {ITSPickExtra<IFindRootReturnType, 'pkg'>} input - 要覆寫的屬性
 * @returns {IFindRootReturnType} 新的根目錄資料物件
 *
 * @example
 * const newRootData = newFakeRootData(rootData, { pkg: '/new/pkg/path' });
 */
export declare function newFakeRootData(rootData: IFindRootReturnType, input: ITSPickExtra<IFindRootReturnType, 'pkg'>): IFindRootReturnType;
/**
 * 斷言當前目錄位於 workspace 內
 *
 * 若 hasWorkspace 不為 true，則拋出錯誤。
 *
 * @template T - IFindRootReturnType 的子類型
 * @param {T} rootData - 要檢查的根目錄資料
 * @throws {RangeError} 當不在 workspace 內時
 */
export declare function assertHasWorkspaces<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
    hasWorkspace: true;
};
/**
 * 斷言最近的套件根目錄不是 workspace 根目錄
 *
 * 若 isWorkspace 為 true，則拋出錯誤。
 *
 * @template T - IFindRootReturnType 的子類型
 * @param {T} rootData - 要檢查的根目錄資料
 * @throws {RangeError} 最近的套件根目錄為 workspace 根目錄時
 */
export declare function assertNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
    isWorkspace: false;
};
/**
 * 斷言 cwd 位於 workspace 內，且最近的套件根目錄不是 workspace 根目錄
 *
 * 組合 assertHasWorkspaces 和 assertNotWorkspacesRoot 的檢查。
 *
 * @template T - IFindRootReturnType 的子類型
 * @param {T} rootData - 要檢查的根目錄資料
 * @throws {RangeError} 當不在 workspace 內或最近的套件根目錄為 workspace 根目錄時
 */
export declare function assertHasAndNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
    hasWorkspace: true;
    isWorkspace: false;
};
/**
 * 列出符合指定路徑的 workspace 模式
 *
 * 此函數會分析 workspace 根目錄的 workspaces 配置，
 * 找出所有符合指定套件路徑的 glob 模式。
 *
 * @param {string} ws - Workspace 根目錄路徑
 * @param {string} pkg - 套件目錄路徑
 * @returns {string[]} 符合的 workspace 模式陣列
 * @throws {RangeError} 當 ws 不是有效的 workspace 根目錄時
 * @throws {RangeError} 當 pkg 與 ws 相同時
 *
 * @example
 * const patterns = listMatchedPatternByPath('/workspace/root', '/workspace/root/packages/pkg-a');
 * // 可能返回 ['packages/*'] / Might return ['packages/*']
 */
export declare function listMatchedPatternByPath(ws: string, pkg: string): any;
export default findRoot;
