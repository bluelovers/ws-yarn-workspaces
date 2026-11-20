"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
exports.releaseTypesIsPre = releaseTypesIsPre;
exports.detectPreidByVersion = detectPreidByVersion;
/**
 * 選項正規化與預發行偵測
 */
const types_1 = require("./types");
const semver_1 = require("semver");
/**
 * 正規化版本推薦選項
 *
 * 將布林旗標轉為 bump、依舊版本推斷預發行資訊，最後才交由呼叫端指定值優先。
 *
 * @param options - 原始選項
 * @param oldVersion - 舊版本號，用於預發行偵測
 * @param wsProject - workspaces 專案，提供預設 bump
 * @returns 正規化後的選項（必定含 bump）
 */
function handleOptions(options, oldVersion, wsProject) {
    var _a, _b, _c;
    /**
     * 複製一份再修改：避免改到呼叫端傳入的物件
     * （呼叫端可能重複使用同一 options 物件）
     */
    options = {
        ...options,
    };
    /** 空字串視為未指定，交由旗標與推斷決定 */
    let bump = ((_a = options.bump) === null || _a === void 0 ? void 0 : _a.length) ? options.bump : void 0;
    /**
     * 未指定 bump 時掃描布林旗標（如 { minor: true }）；
     * releaseTypes 的順序決定多個旗標同時為 true 時的優先順序
     */
    if (!bump) {
        for (let type of types_1.releaseTypes) {
            if (options[type] === true) {
                bump = type;
                break;
            }
        }
    }
    /**
     * 只有在「舊版本可解析」且「bump 未指定或為預發行類型」時才推斷：
     * 已明確要求 major/minor/patch 等正式版 bump 時不得被預發行資訊覆寫
     */
    if ((oldVersion === null || oldVersion === void 0 ? void 0 : oldVersion.length) && (!bump || releaseTypesIsPre(bump))) {
        options.bump = bump;
        const dt = detectPreidByVersion(oldVersion, options);
        if (dt) {
            bump = dt.bump;
            /** ??= 保留呼叫端明確設定的值，只在缺省時補上偵測結果 */
            (_b = options.preid) !== null && _b !== void 0 ? _b : (options.preid = dt.preid);
            (_c = options.identifierBase) !== null && _c !== void 0 ? _c : (options.identifierBase = dt.identifierBase);
        }
        else {
            /** 非預發行版本且尚未指定 bump：改用 workspaces 專案的預設策略 */
            bump !== null && bump !== void 0 ? bump : (bump = wsProject === null || wsProject === void 0 ? void 0 : wsProject.bump);
        }
    }
    options.bump = bump;
    /*
    for (let type of releaseTypes)
    {
        delete options[type]
    }
     */
    return options;
}
/**
 * 判斷 bump 是否為預發行類型
 *
 * 以 `pre` 前綴判定，涵蓋 premajor/preminor/prepatch/prerelease 四種。
 *
 * @param bump - bump 類型
 * @returns 是否為預發行類型
 */
function releaseTypesIsPre(bump) {
    return bump.startsWith('pre');
}
/**
 * 由舊版本的預發行段偵測 bump、preid 與 identifierBase
 *
 * 純數字識別（如 1.0.0-1）若以預設 identifierBase 遞增會重設為 1，
 * 故此處改以 false 讓計數持續遞增。
 *
 * @param oldVersion - 舊版本號
 * @param options - 原始選項，會被 ??= 補上偵測值
 * @returns 偵測結果；非預發行版本回傳 null
 */
function detectPreidByVersion(oldVersion, options) {
    var _a;
    /** 版本字串為空時無法解析，直接視為非預發行 */
    if (oldVersion.length) {
        const sv = (0, semver_1.parse)(oldVersion);
        if ((_a = sv.prerelease) === null || _a === void 0 ? void 0 : _a.length) {
            options !== null && options !== void 0 ? options : (options = {});
            let preid = options.preid;
            let identifierBase = options.identifierBase;
            let prerelease = sv.prerelease[0].toString();
            /**
             * 三種預發行段形態需個別處理：
             * 1. 多段（如 1.0.0-beta.1）→ 取首段當 preid
             * 2. 單段純數字（如 1.0.0-1）→ 關閉 identifierBase 以免計數重置
             * 3. 其他（如 1.0.0-beta）→ 以 defaultPreid 補齊
             */
            if (sv.prerelease.length > 1) {
                preid !== null && preid !== void 0 ? preid : (preid = prerelease);
            }
            else if (/^\d+$/.test(prerelease)) {
                identifierBase !== null && identifierBase !== void 0 ? identifierBase : (identifierBase = false);
            }
            else {
                preid !== null && preid !== void 0 ? preid : (preid = options.defaultPreid);
            }
            let bump = options.bump;
            if (!(bump === null || bump === void 0 ? void 0 : bump.length)) {
                /** 未指定 bump：預發行版本預設只推進 prerelease 段 */
                bump = void 0;
            }
            else if (!releaseTypesIsPre(bump)) {
                /**
                 * 呼叫端要求正式版 bump（如 minor）但舊版本仍在預發行：
                 * 加上 pre 前綴轉為 preminor，避免直接脫離預發行階段
                 */
                bump = 'pre' + bump;
            }
            return {
                bump: (bump !== null && bump !== void 0 ? bump : 'prerelease'),
                preid,
                identifierBase,
            };
        }
    }
    /** 非預發行版本：推斷交回一般流程 */
    return null;
}
//# sourceMappingURL=handleOptions.js.map