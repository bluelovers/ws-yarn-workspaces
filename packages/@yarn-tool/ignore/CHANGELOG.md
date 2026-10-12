# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.0.1 (2026-10-12)


### BREAKING CHANGES

* **static-file:** 支援在重置靜態檔案時自動合併既有的 ignore 規則
* **fix-all:** 重構靜態檔案判定函式名稱以提升語意清晰度
* **ignore:** 重構內部架構並優化換行符號處理邏輯
* **ignore:** IFinalizeIgnoreLinesOptions 的屬性名稱已變更。



### ✨　Features

* **@yarn-tool/ignore:** 完善行模型整理選項與測試快照 ([8a9b28f](https://github.com/bluelovers/ws-yarn-workspaces/commit/8a9b28ff59071b834d5d6208a4de979b8439df8a))
* **ignore:** 引入行解析 (Tokenization) 機制並擴充去重控制選項 ([eaec5e4](https://github.com/bluelovers/ws-yarn-workspaces/commit/eaec5e439ebed6a50d23a54ce3f78e37dd6e1686))
* **ignore:** 擴充 IgnoreFile API 並優化規則處理流程 ([496a0f5](https://github.com/bluelovers/ws-yarn-workspaces/commit/496a0f5455e55c60fec51999e42201af61dbd472))
* **static-file:** 支援在重置靜態檔案時自動合併既有的 ignore 規則 ([11ab7c6](https://github.com/bluelovers/ws-yarn-workspaces/commit/11ab7c6023e142b74694365fe9a0f78e3c000d92))


### 📦　Code Refactoring

* **fix-all:** 重構靜態檔案判定函式名稱以提升語意清晰度 ([f6d2bc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/f6d2bc9f2c4698b23ce2eb86f8fbe4a159b7f15d))
* **ignore:** 建立內部工具以存取 ignore 套件之規則狀態 ([e326ced](https://github.com/bluelovers/ws-yarn-workspaces/commit/e326cedd77a668ff0d0db9cc4b8beafa10198ea3))
* **ignore:** 模組化內部邏輯並統一類型定義 ([63b45c2](https://github.com/bluelovers/ws-yarn-workspaces/commit/63b45c2427cb3d4b745436f93239a418bb9c4f81))
* **ignore:** 重構內部架構並優化換行符號處理邏輯 ([2067ef8](https://github.com/bluelovers/ws-yarn-workspaces/commit/2067ef8fd69a054a040c77c759804c94ab20de8d))
* **ignore:** 重構整理選項命名並為 IgnoreFile 新增比對快取 ([cbe59e1](https://github.com/bluelovers/ws-yarn-workspaces/commit/cbe59e13c038737ccd6caaae942fc1634d3dde45))


### 🚨　Tests

* **@yarn-tool/static-file:** 建立基於分類片段的忽略規則測試架構 ([f0a15c1](https://github.com/bluelovers/ws-yarn-workspaces/commit/f0a15c1f7306c5d61d0779be35e3635504190963))


### 🛠　Build System

* update build ([5fb6966](https://github.com/bluelovers/ws-yarn-workspaces/commit/5fb6966a57ec31ba89d8c20aa676c60755b7b286))
* update build ([1db015f](https://github.com/bluelovers/ws-yarn-workspaces/commit/1db015f41dcbeefe79a00731301d9da6e5bcfe2d))
* update build ([1e5d5d0](https://github.com/bluelovers/ws-yarn-workspaces/commit/1e5d5d03f239e0d4c1229dd0deb21ccf4969736b))
* update build ([70eb8df](https://github.com/bluelovers/ws-yarn-workspaces/commit/70eb8df609482fd879a15ec5b73098b295e3179d))


### 🔖　Miscellaneous

* **@yarn-tool/ignore:** 新增 ignore 檔案處理工具包 ([8776549](https://github.com/bluelovers/ws-yarn-workspaces/commit/8776549e50f046b22a122de86101614ae154a1bb))
