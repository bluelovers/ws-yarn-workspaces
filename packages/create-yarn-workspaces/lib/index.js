"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultPackageJson = getDefaultPackageJson;
exports.getDefaultTsconfig = getDefaultTsconfig;
const tslib_1 = require("tslib");
const ws_root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy");
const package_demo_json_1 = require("./package.demo.json");
const package_json_1 = tslib_1.__importDefault(require("../package.json"));
/**
 * 取得新專案根目錄的預設 package.json 內容。
 * Build the default root `package.json` content for a new project.
 *
 * @param name 套件名稱；未提供時保留 undefined 交由呼叫端補上。Package name; left `undefined` when absent for the caller to fill in.
 * @returns 含預設 scripts 與依賴的 package.json 物件。A `package.json` object with default scripts and dependencies.
 */
function getDefaultPackageJson(name) {
    let json = {
        "name": name,
        "version": "1.0.0",
        "private": true,
        // "packageManager": "yarn@1.22.19",
        "workspaces": [
            "packages/*",
        ],
        // 預設標記建立來源，方便日後辨識此專案由 yarn-tool 產生。
        // Mark the origin by default so the project can later be recognized as created by yarn-tool.
        keywords: [
            "create-by-yarn-tool",
        ],
        "scripts": (0, ws_root_scripts_1.defaultWorkspaceRootScripts)(),
        dependencies: package_demo_json_1.dependencies,
        devDependencies: package_demo_json_1.devDependencies,
        peerDependencies: package_demo_json_1.peerDependencies,
        // "resolutions": {},
    };
    // 以本套件自身的依賴版本覆寫範本版本，確保產生的專案與工具列版本一致。
    // Override the template versions with this package's own dependency versions so the generated project matches the toolchain.
    for (const deps of ['dependencies', 'devDependencies', 'peerDependencies']) {
        let keys = Object.keys(json[deps]);
        // 範本沒有該依賴欄位、或本套件也未宣告時略過，避免憑空新增空的依賴區塊。
        // Skip when the template lacks the field or this package does not declare it, avoiding empty dependency blocks out of nowhere.
        if (!keys.length || !package_json_1.default[deps]) {
            continue;
        }
        // 複製一份再改寫，避免直接動到匯入的範本物件（其為模組快取中的共享實例）。
        // Copy before mutating so we do not edit the imported template object (a shared instance in the module cache).
        json[deps] = {
            ...json[deps],
        };
        keys
            .forEach(function (key) {
            // 只覆寫本套件也宣告了的鍵，其餘保留範本預設版本。
            // Only overwrite keys also declared by this package; keep template defaults for the rest.
            if (package_json_1.default[deps][key]) {
                json[deps][key] = package_json_1.default[deps][key];
            }
        });
    }
    // 補上 workspaces 專用的預設腳本（已存在的腳本不會被覆蓋）。
    // Fill in workspace-specific default scripts (existing scripts are not overwritten).
    (0, dummy_1.fillDummyScripts)(json.scripts, 'workspaces');
    return json;
}
/**
 * 取得新專案根目錄的預設 tsconfig 內容。
 * Build the default root `tsconfig` content for a new project.
 *
 * @returns 繼承 @bluelovers/tsconfig 的 tsconfig 物件。A `tsconfig` object extending `@bluelovers/tsconfig`.
 */
function getDefaultTsconfig() {
    return {
        extends: "@bluelovers/tsconfig/esm/mapfile.json",
    };
}
//# sourceMappingURL=index.js.map