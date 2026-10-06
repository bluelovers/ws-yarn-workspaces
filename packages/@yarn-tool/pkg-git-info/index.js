"use strict";
/**
 * Created by user on 2019/6/4.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostedGitInfo = getHostedGitInfo;
exports.npmHostedGitInfoLazy = npmHostedGitInfoLazy;
exports.npmHostedGitInfo = npmHostedGitInfo;
exports.npmHostedGitInfoCore = npmHostedGitInfoCore;
const tslib_1 = require("tslib");
const hosted_git_info_1 = tslib_1.__importDefault(require("hosted-git-info"));
const info_1 = require("@git-lazy/info");
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
function getHostedGitInfo(o) {
    return hosted_git_info_1.default.fromUrl((0, info_1.filterRemoteUrl)(o));
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
function npmHostedGitInfoLazy(cwd) {
    try {
        return npmHostedGitInfo(cwd);
    }
    catch (e) {
    }
}
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
function npmHostedGitInfo(cwd) {
    let file = (0, info_1.findConfigPathLocal)(cwd);
    // 只有真的找到設定檔才解析；file 為 null 代表此目錄不屬於任何 Git repo。
    //
    // Parse only when a config was found; a null file means the directory
    // does not belong to any git repository.
    if (file != null) {
        let o = (0, info_1.parseConfig)(file);
        let info = getHostedGitInfo(o);
        return npmHostedGitInfoCore(info);
    }
}
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
function npmHostedGitInfoCore(info) {
    return {
        homepage: info.docs({
            noCommittish: true,
        }),
        bugs: info.bugs({
            noCommittish: true,
        }),
        repository: info.https({
            noCommittish: true,
        }),
        _: info,
    };
}
/**
 * 預設匯出：多數情境直接呼叫 npmHostedGitInfo 即可。
 *
 * Default export: npmHostedGitInfo covers most use cases.
 */
exports.default = npmHostedGitInfo;
//# sourceMappingURL=index.js.map