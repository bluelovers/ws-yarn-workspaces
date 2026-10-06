"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitPackageTag = gitPackageTag;
const core_1 = require("./core");
const tag_1 = require("@git-lazy/tag");
const path_is_same_1 = require("path-is-same");
const find_root_1 = require("@yarn-tool/find-root");
const path_1 = require("path");
/**
 * 建立 git tag（非同步）
 * Create a git tag (async)
 *
 * @param options - 標籤選項 / Tag options
 * @param spawnOptions - git 子行程選項 / git subprocess options
 * @returns gitTag 的執行結果，含 exitCode / gitTag result including exitCode
 * @throws Error 於 workspace 根目錄或 cwd 與套件目錄不符時 / When at the workspace root or when cwd differs from the package dir
 */
async function gitPackageTag(options, spawnOptions) {
    var _a, _b;
    let cwd = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    let rootData = (0, find_root_1.findRoot)({
        cwd,
    });
    /**
     * 兩道防護：workspaces 根目錄本身不是可發布套件，
     * 對它打標籤會讓所有成員共用同一個誤標；
     * cwd 與套件目錄不同則代表呼叫端可能指錯資料夾。
     *
     * Two guards: the workspaces root is not a publishable package and
     * tagging it would give every member one wrong tag, while a cwd that
     * differs from the package dir suggests the caller pointed at the
     * wrong folder.
     */
    if (rootData.hasWorkspace && rootData.isWorkspace) {
        throw new Error(`disallow create git tag for workspace root`);
    }
    else if (!(0, path_is_same_1.pathIsSame)(rootData.pkg, cwd)) {
        throw new Error(`cwd must be same as package dir\n${rootData.pkg}\n${cwd}`);
    }
    /**
     * 未提供 pkg 時自動載入，
     * 使用 import() 可同時相容 CJS 與 ESM 的 package.json 讀取
     *
     * Load pkg automatically when absent; import() works with both CJS and
     * ESM package.json shapes
     */
    if (!options.pkg) {
        options.pkg = await Promise.resolve(`${(0, path_1.join)(rootData.pkg, 'package.json')}`).then(s => __importStar(require(s))).then(m => m.default || m);
    }
    /** 後續解析一律以套件目錄為基準，避免 cwd 參數被外部改動影響 / Anchor everything to the package dir so external cwd changes cannot affect it */
    cwd = options.cwd = rootData.pkg;
    options = (0, core_1.handleOptions)(options);
    const tag = (0, core_1.formatPackageTag)(options);
    /** 未指定訊息時以標籤名稱作為 commit/tag 訊息，保持可追溯 / Default the message to the tag name so it stays traceable */
    options.message = (_b = options.message) !== null && _b !== void 0 ? _b : tag;
    spawnOptions = {
        ...spawnOptions,
        cwd,
    };
    return (0, tag_1.gitTag)(tag, options, spawnOptions);
}
exports.default = gitPackageTag;
//# sourceMappingURL=git-tag.js.map