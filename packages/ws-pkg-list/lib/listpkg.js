"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspacesPackagesList = workspacesPackagesList;
const tslib_1 = require("tslib");
const core_1 = tslib_1.__importDefault(require("find-yarn-workspace-root2/core"));
const workspaces_config_1 = require("workspaces-config");
const upath2_1 = require("upath2");
const fast_glob_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob"));
function workspacesPackagesList(cwd, absolute) {
    // 第一個參數為布林值時，代表舊版只有 absolute 的呼叫形式，需重新對應參數位置。
    // When the first argument is a boolean it represents the legacy `absolute`-only call form, so remap the parameters.
    if (typeof cwd === 'boolean') {
        // @ts-ignore
        [cwd, absolute] = [null, cwd];
    }
    cwd = cwd || process.cwd();
    // 以 not_absolute 標記是否要轉成相對路徑，避免在迴圈內重複比對 absolute 的多種 falsy 值。
    // Track `not_absolute` once so the loop does not re-evaluate the several falsy forms of `absolute`.
    let not_absolute = absolute === false;
    // 從 cwd 向上尋找工作區根目錄；找不到時 find-yarn-workspace-root2 會回傳 null，交由 getConfig 處理。
    // Walk up from `cwd` to find the workspace root; if not found `find-yarn-workspace-root2` returns null and `getConfig` handles it.
    let root = (0, core_1.default)(cwd);
    // 將 workspaces 設定的 glob 展開成每個套件的 package.json 路徑。
    // Expand the configured workspace globs into a `package.json` path per package.
    let ps = (0, workspaces_config_1.getConfig)(root).packages.map(function (v) {
        return (0, upath2_1.join)(v, 'package.json');
    });
    // 同步比對所有 package.json 並取其所在資料夾；absolute:false 時轉為相對路徑。
    // Glob-match every `package.json` synchronously and reduce to its folder; convert to relative paths when `absolute:false`.
    return fast_glob_1.default.sync(ps, {
        cwd: root,
        absolute: true,
    }).map(function (v) {
        let p = (0, upath2_1.dirname)(v);
        if (not_absolute) {
            p = (0, upath2_1.relative)(cwd, p);
            // relative() 在相同目錄時回傳空字串，改以 '.' 表示根套件本身，方便直接拼接路徑。
            // `relative()` returns an empty string for the same directory; use '.' for the root package so paths can be concatenated directly.
            if (p == '') {
                p = '.';
            }
        }
        return p;
    });
}
exports.default = workspacesPackagesList;
//# sourceMappingURL=listpkg.js.map