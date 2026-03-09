# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/fnm-detect@1.0.1...@yarn-tool/fnm-detect@1.0.3) (2026-03-09)



### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))


### 🔖　Miscellaneous

* . ([cae7515](https://github.com/bluelovers/ws-yarn-workspaces/commit/cae7515d4a8befe93ca0baee8f6aeb9ae7cbad79))



## [1.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/fnm-detect@1.0.1...@yarn-tool/fnm-detect@1.0.2) (2026-03-08)



### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))



## 1.0.1 (2026-03-02)


### BREAKING CHANGES

* **release:** 核心工具鏈套件升級
- @lazy-node/semver-simple-parse v4.0.0
- @yarn-tool/require-resolve v4.0.0
- @yarn-tool/resolve-package v3.0.0
- @yarn-tool/get-pkg-bin v3.0.0
- @yarn-tool/check-pkg-bin v4.0.0

更新所有工作區套件以使用相容的主要版本，並重構
npm-package-arg-util 以抽離 _parsePackageNameCore 核心函式。



### 🐛　Bug Fixes

* **fnm-detect:** 新增 FNM_MULTISHELL_PATH 的空值檢查，避免傳入 undefined 參數導致錯誤 ([7477b57](https://github.com/bluelovers/ws-yarn-workspaces/commit/7477b57d4c2f64ffc30c76bfd83887a42762ce6d))


### 📦　Code Refactoring

* **require-resolve:** split into modular lib/ structure with enhanced resolution options ([c327a9a](https://github.com/bluelovers/ws-yarn-workspaces/commit/c327a9a9916f072a9121d9ec197e4fa754d99e6e))


### 📚　Documentation

* add bilingual documentation and JSDoc comments to multiple packages ([bb47d30](https://github.com/bluelovers/ws-yarn-workspaces/commit/bb47d309c3258006d5261e4d62c2f82c690d452a))
* **fnm-detect:** improve docs ([9c2abc5](https://github.com/bluelovers/ws-yarn-workspaces/commit/9c2abc57fe5f26dd22ce83d2a07b1b6d3db7e766))


### 🚨　Tests

* **fnm-detect:** correct alias props and update dependencies ([21d1c54](https://github.com/bluelovers/ws-yarn-workspaces/commit/21d1c54c60ae64fb2117eae1e2b86bb42c8b6070))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* 更新 Jest 快照連結並增強類型定義與文件 ([b663b97](https://github.com/bluelovers/ws-yarn-workspaces/commit/b663b97d78d223dc8b3927ea2433938350144de7))
* **deps:** 升級路徑與檔案系統相關依賴版本 ([78d395b](https://github.com/bluelovers/ws-yarn-workspaces/commit/78d395b5469feecc85f250ca2d8b4977161e7618))
* **deps:** 更新依賴版本並將腳本執行從 yarn 遷移至 node --run ([389e581](https://github.com/bluelovers/ws-yarn-workspaces/commit/389e581a07cf803dc34c8402b4d3f69af0016b8c))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))


### 🔖　Miscellaneous

* . ([d0a2adc](https://github.com/bluelovers/ws-yarn-workspaces/commit/d0a2adca7732fe14da2977d24e148f42b10bdd1c))
* **@yarn-tool/fnm-detect:** add a new package to detect Fast Node Manager (fnm) environments ([e1b0cfb](https://github.com/bluelovers/ws-yarn-workspaces/commit/e1b0cfb6edae973ec9633ec2d95f966897d56973))
