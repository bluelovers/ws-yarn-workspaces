# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/get-global-dirs@1.0.1...@yarn-tool/get-global-dirs@1.0.2) (2026-03-09)

**Note:** Version bump only for package @yarn-tool/get-global-dirs





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



### ✨　Features

* **get-global-dirs:** 新增獲取全局安裝目錄工具模組 ([40cb295](https://github.com/bluelovers/ws-yarn-workspaces/commit/40cb29589d9311c28096659af22a563844f29abb))


### 🛠　Build System

* Introduce new utility packages for semantic versioning and Yarn tooling, and add CI/CD workflows. ([905a979](https://github.com/bluelovers/ws-yarn-workspaces/commit/905a9795333addd0fe802cad8068d5c5b414a992))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))
