import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { INpmHostedGitInfo } from '@yarn-tool/pkg-git-info';
import { ITSPickExtra } from 'ts-type/lib/type/record';
/**
 * 填入 package.json 託管 Git 資訊時的選項；
 * 除了 targetDir 之外皆可省略，由函式在需要時自行惰性推斷（Lazy Resolution），
 * 以免呼叫端為了單一欄位就必須先解析整個 workspace 根目錄。
 *
 * Options used when filling hosted git info into package.json.
 * Everything except targetDir is optional and derived lazily inside the function,
 * so callers do not need to resolve the whole workspace root for a single field.
 */
export interface IFillPkgHostedInfoOptions {
    /** 套件所在目錄，作為推斷 workspace 相對路徑與 Git 資訊的起點 / Package directory used as the starting point for relative paths and git info */
    targetDir?: string;
    /** 已解析的根目錄資料；先提供可避免重複查找 / Pre-resolved root data; providing it avoids redundant lookups */
    rootData?: IFindRootReturnType;
    /** 組成 homepage 時使用的分支名稱，預設 master / Branch name used to build homepage, defaults to master */
    branch?: string;
    /** 已取得的託管平台資訊；先提供則不再重新推斷 / Already-resolved hosted git info; skips re-detection when provided */
    hostedGitInfo?: INpmHostedGitInfo;
    /**
     * true 時無條件覆寫既有欄位；false 只補上缺漏欄位。
     * 預設 false 是為了尊重使用者手動撰寫的 homepage / bugs / repository。
     *
     * When true, overwrites existing fields unconditionally; when false, only fills missing ones.
     * Defaults to false so hand-written homepage / bugs / repository are preserved.
     */
    overwriteHostedGitInfo?: boolean;
}
/**
 * fillPkgHostedInfo 回傳值中保證存在的欄位，
 * 對應 npm package.json 的官方欄位定義，方便後續程式碼安全取用。
 *
 * Fields guaranteed to exist on the return value of fillPkgHostedInfo;
 * mirrors the official npm package.json fields for safe downstream access.
 */
export type IFillPkgHostedInfoFields = {
    /** 套件首頁網址 / Package homepage URL */
    homepage: string;
    /** 缺陷回報網址 / Bug report URL */
    bugs: {
        url: string;
    };
    repository: {
        /** 版控種類，npm 約定為 git / Version control kind, npm expects `git` */
        type: string | 'git';
        /** Git 倉庫網址 / Git repository URL */
        url: string;
        /**
         * monorepo 中子套件的相對路徑；非 workspace 情境會缺省，
         * 因為 npm 會忽略空值，寫入 directory: "" 反而製造雜訊。
         *
         * Relative path of the sub-package inside a monorepo; omitted for non-workspace
         * projects because npm ignores empty values and `directory: ""` only adds noise.
         *
         * @see https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository
         */
        directory: string;
    };
};
/**
 * 把已取得的託管 Git 資訊轉換成 package.json 的 homepage / bugs / repository 欄位。
 * 採用「必要選項」型別，表示此函式不負責推斷，推斷責任留在 fillPkgHostedInfo，
 * 讓兩層各自單純、也方便單元測試直接注入假資料。
 *
 * Converts already-resolved hosted git info into the homepage / bugs / repository fields.
 * Its options are required (no lazy detection here); detection lives in fillPkgHostedInfo,
 * which keeps both layers simple and lets tests inject fixtures directly.
 *
 * @param pkg 目標 package.json 物件，會被就地修改 / Target package.json object, mutated in place
 * @param options 必填的來源資料 / Required source data
 */
export declare function _hostedGitInfoToFields<P extends Partial<IPackageJson>>(pkg: P, options: ITSPickExtra<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'targetDir'>): P & IFillPkgHostedInfoFields;
/**
 * 依託管 Git 資訊補齊 package.json 的 homepage / bugs / repository 欄位（本套件預設匯出）。
 *
 * Fills the homepage / bugs / repository fields of package.json from hosted git info
 * (the package's default export).
 *
 * @param pkg 目標 package.json 物件，會被就地修改 / Target package.json object, mutated in place
 * @param options 選項；全部皆可省略並自動推斷 / Optional; everything can be derived automatically
 * @returns 與 pkg 為同一個物件，且保證具備 IFillPkgHostedInfoFields 欄位
 *          The same object as pkg, guaranteed to carry the IFillPkgHostedInfoFields fields
 *
 * @example
 * fillPkgHostedInfo({ name: 'foo' }, { branch: 'main' });
 */
export declare function fillPkgHostedInfo<P extends IPackageJson>(pkg: P, options?: IFillPkgHostedInfoOptions): P & IFillPkgHostedInfoFields;
/**
 * 預設匯出：多數情境只需直接呼叫 fillPkgHostedInfo，命名匯出主要供進階用法。
 *
 * Default export: most callers just use fillPkgHostedInfo directly; the named export
 * exists mainly for advanced usage.
 */
export default fillPkgHostedInfo;
