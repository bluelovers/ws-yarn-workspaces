#!/usr/bin/env node
"use strict";
/**
 * yarn-list-link 指令列入口
 * yarn-list-link command line entry
 *
 * 以目前工作目錄為起點列出工作區內的 yarn link，
 * 並將結果逐行印出；無連結時以結束碼 1 結束，
 * 方便 shell script 直接判斷成功與否。
 * Starting from the current working directory it lists the workspace's yarn links,
 * printing one per line; when there are none it exits with code 1,
 * so shell scripts can branch on success directly.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
let cwd = process.cwd();
let ls = (0, core_1.yarnListLink)(cwd);
/**
 * 空陣列與 undefined 都視為「沒有連結」：
 * yarnListLinkCore 在 integrity 檔案缺席時會回傳 undefined
 * Both an empty array and undefined count as "no links":
 * yarnListLinkCore returns undefined when the integrity file is absent
 */
if (ls && ls.length) {
    ls.forEach(v => console.log(v));
}
else {
    console.error(`not exists any yarn link in path '${cwd}'`);
    process.exit(1);
}
//# sourceMappingURL=yarn-list-link.js.map