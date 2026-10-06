#!/usr/bin/env node
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
export {};
