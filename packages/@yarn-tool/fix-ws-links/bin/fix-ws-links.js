#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * fix-ws-links CLI 入口點
 * fix-ws-links CLI entry point
 *
 * 依序執行兩種修復：
 * Runs two fixes in order:
 * 1. fixYarnWorkspaceLinks() - 修正 yarn link 與指向錯誤的套件連結
 *    Fix yarn links and links pointing at the wrong location
 * 2. fixWorkspacesPackageLinks() - 修正 node_modules/<套件名> 符號連結
 *    Fix the node_modules/<name> symlinks
 *
 * 僅在第二步確實修復過套件時才輸出提示，
 * 第一步的 verbose 輸出則由 fixYarnWorkspaceLinks() 自行處理
 * Only prints a notice when the second step actually fixed something; the
 * first step's verbose output comes from fixYarnWorkspaceLinks() itself
 */
const index_1 = require("../index");
const fix_ws_pkgs_link_1 = require("@yarn-tool/fix-ws-pkgs-link");
let cwd = process.cwd();
console.log(`check and try fix links from: ${cwd}`);
/**
 * verbose: true 讓 CLI 直接顯示每步驟的判斷與修復結果
 * verbose: true makes the CLI show each check and fix result
 */
(0, index_1.fixYarnWorkspaceLinks)(cwd, {
    verbose: true,
    /**
     * 以命令列旗標決定是否在修復後執行 yarn install
     * CLI flag decides whether to run yarn install after fixing
     */
    runYarnAfter: process.argv.includes('--runYarnAfter'),
});
/**
 * 第二階段：修復套件名對應的 node_modules 符號連結
 * Phase 2: fix node_modules/<name> symlinks
 */
let wsp = (0, fix_ws_pkgs_link_1.fixWorkspacesPackageLinks)(cwd);
if (wsp.length) {
    console.log(`node_modules links fixed`);
    /**
     * 僅列出被修復的套件名稱
     * List only the package names that were fixed
     */
    wsp.forEach(r => r.name);
}
//# sourceMappingURL=fix-ws-links.js.map