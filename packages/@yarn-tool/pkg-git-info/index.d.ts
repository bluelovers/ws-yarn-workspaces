/**
 * Created by user on 2019/6/4.
 */
import HostedGitInfo from 'hosted-git-info';
import { parseConfig } from '@git-lazy/info';
/**
 * 由已解析的 Git 設定內容取得 `hosted-git-info` 實例。
 * 先用 filterRemoteUrl 去除可能存在的 `git+`、結尾 `.git` 等雜訊，
 * 因為 `HostedGitInfo.fromUrl()` 對網址格式相當挑剔。
 *
 * Gets a `hosted-git-info` instance from parsed git config content.
 * filterRemoteUrl strips noise such as a leading `git+` or trailing `.git` first,
 * because `HostedGitInfo.fromUrl()` is quite strict about the url shape.
 *
 * @param o `@git-lazy/info` 的 parseConfig() 結果 / Result of parseConfig() from @git-lazy/info
 */
export declare function getHostedGitInfo(o: ReturnType<typeof parseConfig>): HostedGitInfo;
/**
 * 可直接填入 package.json 的託管 Git 資訊欄位。
 *
 * Hosted git info fields that can be written straight into package.json.
 */
export interface INpmHostedGitInfo {
    /** 缺陷回報網址（純字串）/ Bug report url as a plain string */
    bugs: string;
    /** 遠端仓库網址 / Remote repository url */
    repository: string;
    /** 套件首頁網址 / Package homepage url */
    homepage: string;
    /** 原始 HostedGitInfo 實例，保留給進階用法 / Raw HostedGitInfo instance kept for advanced usage */
    _: HostedGitInfo;
}
/**
 * 惰性版本的解析入口：任何錯誤都吞掉並回傳 undefined。
 * 刻意不記錄錯誤，因為「目錄不是 Git repo」在此類工具中屬於正常情境，
 * 呼叫端多半只是想盡力補上欄位，失敗並不需要中斷流程。
 *
 * Lazy resolution entry: swallows every error and returns undefined.
 * Errors are intentionally silent — "not a git repo" is an expected case here;
 * callers usually just want best-effort fields and should not be interrupted.
 *
 * @param cwd 起始目錄，預設目前工作目錄 / Starting directory, defaults to the current working directory
 */
export declare function npmHostedGitInfoLazy(cwd?: string): INpmHostedGitInfo;
/**
 * 從 cwd 向上尋找 Git 設定檔並解析遠端網址，回傳可填入 package.json 的欄位。
 * 找不到設定檔時回傳 undefined 而非丟出例外，讓呼叫端可以簡單地用 `&&` 判空。
 *
 * Walks up from cwd to find the git config, parses the remote url and returns
 * package.json-ready fields. Returns undefined instead of throwing when no config
 * exists, so callers can guard with a simple `&&`.
 *
 * @param cwd 起始目錄 / Starting directory
 */
export declare function npmHostedGitInfo(cwd?: string): INpmHostedGitInfo;
/**
 * 把 HostedGitInfo 實例轉成三個純字串欄位。
 * 一律帶 noCommittish: true，避免 homepage / bugs / repository 被加上
 * commit、branch 或 tag，導致連結指向隨版本變動的位置。
 *
 * Converts a HostedGitInfo instance into three plain string fields.
 * noCommittish: true is always passed so homepage / bugs / repository never get a
 * commit, branch or tag appended, which would point the links at a moving target.
 *
 * @param info hosted-git-info 實例 / A hosted-git-info instance
 */
export declare function npmHostedGitInfoCore(info: HostedGitInfo): INpmHostedGitInfo;
/**
 * 預設匯出：多數情境直接呼叫 npmHostedGitInfo 即可。
 *
 * Default export: npmHostedGitInfo covers most use cases.
 */
export default npmHostedGitInfo;
