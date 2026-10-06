"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommended = nextVersionRecommended;
/**
 * 核心版本推薦邏輯
 * Core version recommendation logic
 */
const semver_1 = require("semver");
const handleOptions_1 = require("./handleOptions");
/**
 * 依舊版本與選項計算推薦的新版本號
 * Recommend a new version from the old version and options
 *
 * 設計意圖：bump 類型若未明確指定，交給 handleOptions 依舊版本的
 * 預發行資訊與 workspaces 設定推斷，而非一律使用 patch。
 *
 * Design intent: when bump is not given explicitly, handleOptions infers it
 * from the old version's pre-release info and the workspaces setting,
 * instead of always assuming patch.
 *
 * @param oldVersion - 舊版本號 / Old version string
 * @param options - 推薦選項 / Recommendation options
 * @param wsProject - workspaces 專案實例，提供預設 bump / Workspaces project instance providing the default bump
 * @returns 推薦結果（含實際使用的 bump）/ Recommendation result including the bump actually used
 */
function nextVersionRecommended(oldVersion, options, wsProject) {
    var _a;
    options = (0, handleOptions_1.handleOptions)(options, oldVersion, wsProject);
    /** 未指定且無法從舊版本推斷時才退回 patch：這是語意化版本的最小變更類型 / Fall back to patch only when unspecified and underivable: the minimal semver change type */
    let bump = (_a = options.bump) !== null && _a !== void 0 ? _a : 'patch';
    const newVersion = (0, semver_1.inc)(oldVersion, bump, options.preid, options.identifierBase);
    return {
        bump,
        oldVersion,
        newVersion,
    };
}
//# sourceMappingURL=nextVersionRecommended.js.map