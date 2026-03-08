"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fixLernaJsonCore = _fixLernaJsonCore;
exports._fixLernaDeprecatedCore = _fixLernaDeprecatedCore;
exports._fixLernaJson = _fixLernaJson;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const lodash_1 = require("lodash");
const __root_1 = require("@yarn-tool/static-file/__root");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const array_hyper_unique_1 = require("array-hyper-unique");
const package_1 = require("@yarn-tool/require-resolve/lib/package");
const semver_1 = require("semver");
/**
 * 合併 Lerna 設定核心邏輯
 * Core logic for merging Lerna configuration
 *
 * 將模板中的命令設定與現有設定進行深度合併，並處理 publish.ignoreChanges 的清單合併與去重
 * Performs deep merge of command settings from template with existing config, and handles merging and deduplication of publish.ignoreChanges list
 *
 * @param currentLernaJson - 當前的 lerna.json 設定物件 / Current lerna.json configuration object
 * @param tpl - 模板 lerna.json 設定物件 / Template lerna.json configuration object
 * @returns 合併後的 lerna.json 設定物件 / Merged lerna.json configuration object
 */
function _fixLernaJsonCore(currentLernaJson, tpl) {
    // 使用 defaultsDeep 進行命令設定的深度合併，確保現有設定優先，缺失值從模板補充
    // Use defaultsDeep for deep merging command settings, ensuring existing config takes precedence while filling missing values from template
    currentLernaJson.command = (0, lodash_1.defaultsDeep)(currentLernaJson.command, tpl.command);
    // 合併 publish.ignoreChanges 陣列：將模板的忽略規則附加到現有規則之後
    // Merge publish.ignoreChanges arrays: append template ignore rules after existing rules
    currentLernaJson.command.publish['ignoreChanges'] = currentLernaJson.command.publish['ignoreChanges'].concat(tpl.command.publish['ignoreChanges']);
    // 對合併後的 ignoreChanges 進行去重處理，避免重複的忽略規則
    // Deduplicate the merged ignoreChanges to avoid duplicate ignore rules
    (0, array_hyper_unique_1.array_unique_overwrite)(currentLernaJson.command.publish['ignoreChanges']);
    return currentLernaJson;
}
/**
 * 處理 Lerna 已棄用屬性的核心邏輯
 * Core logic for handling deprecated Lerna properties
 *
 * 檢測 Lerna 版本，若為 7.0.0 以上版本則移除 useWorkspaces 屬性
 * Detects Lerna version and removes useWorkspaces property if version is 7.0.0 or higher
 *
 * Lerna 7.0.0 開始強制使用 workspaces，useWorkspaces 屬性已無意義
 * Since Lerna 7.0.0, workspaces are mandatory and useWorkspaces property is no longer meaningful
 *
 * @param options - 修復選項，包含 rootData 資訊 / Fix options containing rootData information
 * @param currentLernaJson - 當前的 lerna.json 設定物件 / Current lerna.json configuration object
 * @returns 處理後的 lerna.json 設定物件 / Processed lerna.json configuration object
 */
function _fixLernaDeprecatedCore(options, currentLernaJson) {
    try {
        // 解析本機或全域安裝的 lerna 套件資訊
        // Resolve locally or globally installed lerna package information
        let result = (0, package_1.resolvePackage)('lerna', {
            includeGlobal: true,
            includeCurrentDirectory: true,
        });
        // 若 Lerna 版本 >= 7.0.0，移除 useWorkspaces 屬性
        // Remove useWorkspaces property if Lerna version >= 7.0.0
        if ((0, semver_1.gte)(result.pkg.version, '7.0.0')) {
            delete currentLernaJson['useWorkspaces'];
        }
    }
    // 若無法解析 lerna 套件（未安裝），靜默忽略錯誤
    // Silently ignore error if lerna package cannot be resolved (not installed)
    catch (e) { }
    return currentLernaJson;
}
/**
 * 修復專案中的 lerna.json 檔案
 * Fix lerna.json file in the project
 *
 * 讀取專案根目錄的 lerna.json，與模板進行合併，並處理已棄用的屬性
 * Reads lerna.json from project root, merges with template, and handles deprecated properties
 *
 * @param options - 修復選項，必須包含 rootData.root（專案根目錄） / Fix options, must contain rootData.root (project root directory)
 */
function _fixLernaJson(options) {
    // 組合 lerna.json 的完整路徑
    // Compose the full path to lerna.json
    const file = (0, path_1.resolve)(options.rootData.root, 'lerna.json');
    // 只有當 lerna.json 存在時才進行處理
    // Only process if lerna.json exists
    if ((0, fs_extra_1.existsSync)(file)) {
        // 讀取現有的 lerna.json
        // Read existing lerna.json
        let currentLernaJson = (0, fs_extra_1.readJSONSync)(file);
        // 讀取靜態模板檔案作為合併基準
        // Read static template file as merge baseline
        let json2 = (0, fs_extra_1.readJSONSync)((0, path_1.resolve)(__root_1.__STATIC_ROOT, 'file/lerna.json.tpl'));
        // 執行核心合併邏輯
        // Execute core merge logic
        currentLernaJson = _fixLernaJsonCore(currentLernaJson, json2);
        // 處理已棄用的屬性
        // Handle deprecated properties
        currentLernaJson = _fixLernaDeprecatedCore(options, currentLernaJson);
        // 將合併後的結果寫回檔案
        // Write merged result back to file
        (0, write_package_json_1.writePackageJSONSync)(file, currentLernaJson);
    }
}
//# sourceMappingURL=lerna.js.map