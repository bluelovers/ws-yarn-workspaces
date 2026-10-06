"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._hostedGitInfoToFields = _hostedGitInfoToFields;
exports.fillPkgHostedInfo = fillPkgHostedInfo;
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
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
function _hostedGitInfoToFields(pkg, options) {
    let { targetDir, rootData, branch, hostedGitInfo, overwriteHostedGitInfo } = options;
    let directory;
    // 只有「位於 workspace 內但本身不是 workspace 根節點」才需要 directory；
    // 根節點或非 workspace 專案的相對路徑為空，npm 會忽略空值，
    // 因此刻意不給預設值，避免寫出 directory: "" 這種無意義欄位。
    //
    // directory is only needed when the package sits inside a workspace but is not the
    // workspace root itself; for the root or a standalone project the relative path is
    // empty, and npm ignores it, so no default is assigned to avoid a useless `directory: ""`.
    if ((rootData === null || rootData === void 0 ? void 0 : rootData.hasWorkspace) && !(rootData === null || rootData === void 0 ? void 0 : rootData.isWorkspace)) {
        directory = (0, upath2_1.relative)(rootData.ws, targetDir);
    }
    // 覆寫模式必須一次寫入三個欄位，否則會出現 homepage 已更新、
    // bugs / repository 仍為舊值的不一致狀態。
    //
    // Overwrite mode writes all three fields at once, otherwise homepage would be updated
    // while bugs / repository kept stale values, leaving the manifest inconsistent.
    if (overwriteHostedGitInfo) {
        pkg.homepage = hostedGitInfo.homepage;
        pkg.bugs = {
            url: hostedGitInfo.bugs,
        };
        pkg.repository = {
            "type": "git",
            url: hostedGitInfo.repository,
            directory,
        };
    }
    else {
        // 保留模式採用 ||=：只有欄位不存在時才填入，
        // 讓使用者手動維護的網址優先於自動推斷的結果。
        //
        // Preserve mode uses ||= so hand-maintained URLs always win over auto-detected ones.
        // @ts-ignore
        pkg.homepage || (pkg.homepage = hostedGitInfo.homepage);
        // @ts-ignore
        pkg.bugs || (pkg.bugs = {
            url: hostedGitInfo.bugs,
        });
        // @ts-ignore
        pkg.repository || (pkg.repository = {
            "type": "git",
            url: hostedGitInfo.repository,
            directory,
        });
    }
    // 只有真的算出子套件相對路徑時才改寫 homepage，
    // 否則會把單純的專案首頁誤改成指向 repo 根目錄的 tree 連結。
    //
    // homepage is only rewritten when an actual sub-package path was computed;
    // otherwise a plain project homepage would be turned into a repo-root tree link.
    if (directory === null || directory === void 0 ? void 0 : directory.length) {
        // 使用 ??= 而非 = ：未指定 branch 時才退回預設主分支，
        // 不會覆蓋呼叫端刻意傳入的 branch（包含空字串以外的自訂名稱）。
        //
        // ??= instead of = : the default branch is only used when none was given,
        // never clobbering a caller-provided branch name.
        branch !== null && branch !== void 0 ? branch : (branch = 'master');
        let u = new URL(pkg.homepage);
        // 追加 /tree/<branch>/<directory>，讓 homepage 直接指向套件所在資料夾，
        // 在 GitHub 等平台點開即是該子套件的目錄頁。
        //
        // Appending /tree/<branch>/<directory> makes homepage point at the package folder,
        // which opens the sub-package directory page on hosts like GitHub.
        u.pathname += `/tree/${branch}/` + directory;
        // @ts-ignore
        pkg.homepage = u.toString();
    }
    // 呼叫端傳入的 pkg 可能只是 Partial，這裡以 any 回傳以保留泛型推論。
    //
    // The incoming pkg may be Partial, so it is cast to any to preserve generic inference.
    return pkg;
}
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
function fillPkgHostedInfo(pkg, options) {
    // 早退條件：既非覆寫模式、三個欄位又都齊全時完全不做事，
    // 避免為了「確認沒問題」而白白解析 root 與 Git 資訊（可能觸及檔案系統與 git 指令）。
    //
    // Early exit: when not overwriting and all three fields exist, do nothing at all,
    // avoiding root/git resolution (filesystem and git calls) just to verify what is already there.
    if ((options === null || options === void 0 ? void 0 : options.overwriteHostedGitInfo) || !pkg.homepage || !pkg.bugs || !pkg.repository) {
        let { targetDir, rootData, branch, hostedGitInfo } = options !== null && options !== void 0 ? options : {};
        // 以 ??= 依序補齊依賴：rootData → targetDir → hostedGitInfo。
        // 這個順序是刻意的，因為後者都需要前者的結果作為輸入。
        //
        // ??= fills dependencies in order: rootData → targetDir → hostedGitInfo.
        // The order is deliberate because each one needs the previous result as input.
        rootData !== null && rootData !== void 0 ? rootData : (rootData = (0, find_root_1.findRootLazy)({
            cwd: targetDir,
        }));
        targetDir !== null && targetDir !== void 0 ? targetDir : (targetDir = rootData.pkg);
        hostedGitInfo !== null && hostedGitInfo !== void 0 ? hostedGitInfo : (hostedGitInfo = (0, pkg_git_info_1.npmHostedGitInfoLazy)(targetDir));
        // hostedGitInfo 可能為空（例如目錄不是 Git repo 或無法辨識的託管平台）；
        // 此時寧可維持原樣也不寫入半套欄位，避免產生殘缺的 package.json。
        //
        // hostedGitInfo may be empty (not a git repo, or an unrecognised host);
        // leaving pkg untouched is better than writing a half-filled manifest.
        hostedGitInfo && _hostedGitInfoToFields(pkg, {
            hostedGitInfo,
            rootData,
            branch,
            targetDir,
            overwriteHostedGitInfo: options === null || options === void 0 ? void 0 : options.overwriteHostedGitInfo,
        });
    }
    // 實際欄位已由 _hostedGitInfoToFields 保證，故以 any 回傳維持泛型型別。
    //
    // Fields are guaranteed by _hostedGitInfoToFields, so any is used to keep the generic type.
    return pkg;
}
/**
 * 預設匯出：多數情境只需直接呼叫 fillPkgHostedInfo，命名匯出主要供進階用法。
 *
 * Default export: most callers just use fillPkgHostedInfo directly; the named export
 * exists mainly for advanced usage.
 */
exports.default = fillPkgHostedInfo;
//# sourceMappingURL=index.js.map