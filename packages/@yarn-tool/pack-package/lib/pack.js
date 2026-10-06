"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.packlist = packlist;
exports.packTargetDirectory = packTargetDirectory;
exports.packTargetPackage = packTargetPackage;
const tslib_1 = require("tslib");
const npm_packlist_1 = tslib_1.__importDefault(require("npm-packlist"));
const tar_1 = require("tar");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
const arborist_1 = tslib_1.__importDefault(require("@npmcli/arborist"));
/**
 * 以 npm 的打包規則計算欲收錄的檔案清單。
 * 先由 Arborist 載入實際的 node_modules 樹，再交給 npm-packlist
 * 決定收錄內容（Why：與 `npm pack` 的判斷邏輯保持一致）。
 *
 * Compute the file list to pack using npm's packing rules. Arborist loads the
 * actual node_modules tree first, then npm-packlist decides what is included
 * (Why: keeps the behavior identical to `npm pack`).
 *
 * @param options.path 套件目錄 / package directory
 */
function packlist(options) {
    const arborist = new arborist_1.default(options);
    return arborist.loadActual().then(npm_packlist_1.default);
}
/**
 * 將套件目錄打包為 tarball。
 *
 * mtime 固定為 1985-10-26 是 tar 的 portable 慣例（Why：讓同一份內容
 * 產出位元相同的壓縮檔，以利重現建置 Reproducible Build）。
 * prefix 固定 'package/' 與 npm tarball 結構一致。
 *
 * Pack a package directory into a tarball. The fixed mtime (1985-10-26, the
 * tar portability convention) keeps byte-identical output for identical input
 * (Why: reproducible builds). The `package/` prefix matches npm tarballs.
 *
 * @param options.packageDir 套件目錄 / package directory
 * @param options.packageTarball tarball 輸出路徑 / output tarball path
 */
function packTargetDirectory({ packageDir, packageTarball, }) {
    return packlist({ path: packageDir })
        .then(async (files) => {
        //console.dir(files)
        await (0, tar_1.create)({
            prefix: 'package/',
            cwd: packageDir,
            file: packageTarball,
            gzip: true,
            portable: true,
            mtime: new Date("1985-10-26T08:15:00.000Z"),
        }, files.map(f => `./${f}`));
        return files;
    });
}
/**
 * 打包指定套件並回傳打包上下文（pkg、目錄、tarball 路徑、檔案清單）。
 *
 * realpathSync 展開符號連結 (Symlink)（Why：cwd 為 symlink 時
 * tar 內的相對路徑會失準，必須以真實路徑為基準）。
 * 未提供 pkg 時才讀檔，避免呼叫者已載入 package.json 時的重複 I/O。
 *
 * Pack the given package and return the packing context (pkg, dir, tarball
 * path, file list). realpathSync resolves symlinks (Why: when cwd is a symlink
 * the relative paths inside the tarball would otherwise be wrong). package.json
 * is only read when pkg is not supplied, avoiding duplicate I/O.
 *
 * @param options 打包選項 / packing options
 */
function packTargetPackage(options) {
    let { pkg, packageDir } = options;
    packageDir = (0, fs_1.realpathSync)(packageDir);
    // 未提供 pkg 時，從原始 packageDir 讀取 package.json；
    // 使用 options.packageDir 而非已 realpath 的變數，與既有行為保持一致。
    // Read package.json from the original packageDir when pkg is omitted; uses
    // options.packageDir (not the realpath-ed variable) to preserve existing
    // behavior.
    if (!pkg) {
        pkg = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(options.packageDir, 'package.json')).toString());
    }
    // 未指定 packageTarball 時依 pkg 名稱與版本推導預設檔名，
    // 再解析為絕對路徑，讓 tar 的 file 選項不受 cwd 影響。
    // Fall back to a name/version-derived filename when packageTarball is
    // omitted, then resolve it to an absolute path so tar's file option does
    // not depend on the cwd.
    let packageTarball = options.packageTarball || (0, util_1.getTarballName)(pkg, options.versionPrefix);
    packageTarball = (0, path_1.resolve)(packageDir, packageTarball);
    return packTargetDirectory({
        //...options,
        packageDir,
        packageTarball,
    })
        .then((files) => {
        return {
            ...options,
            pkg,
            packageDir,
            packageTarball,
            files,
        };
    });
}
/**
 * 預設匯出打包函式。
 *
 * Default export of the pack function.
 */
exports.default = packTargetPackage;
//# sourceMappingURL=pack.js.map