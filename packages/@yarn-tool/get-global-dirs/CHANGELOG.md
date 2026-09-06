# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/get-global-dirs@1.0.5...@yarn-tool/get-global-dirs@1.0.6) (2026-09-06)



### 🛠　Build System

* update Static Files ([b2f5d72](https://github.com/bluelovers/ws-yarn-workspaces/commit/b2f5d7216773c53eb35f267ba34f8788543d46a1))


### ♻️　Chores

* **workspace:** 將所有套件的指令從 yarn 改為 pnpm 並更新依賴版本 ([0505892](https://github.com/bluelovers/ws-yarn-workspaces/commit/0505892e5e7c356f8cf59495fefda1aa681499c6))


### 🔖　Miscellaneous

* . ([b545589](https://github.com/bluelovers/ws-yarn-workspaces/commit/b54558925d67304019e2b4f9bb3c4671c429a96e))



## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/get-global-dirs@1.0.4...@yarn-tool/get-global-dirs@1.0.5) (2026-04-26)



### 📚　Documentation

* update deps ([fd5a55c](https://github.com/bluelovers/ws-yarn-workspaces/commit/fd5a55cfd5668cbc6275d44f360b0aeb9bfbf42d))



## [1.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/get-global-dirs@1.0.2...@yarn-tool/get-global-dirs@1.0.4) (2026-03-12)


### BREAKING CHANGES

* **require-resolve:** 移入 Symbol 驗證邏輯至 get-paths-by-type 模組並簡化路徑處理



### ✨　Features

* **get-global-dirs, get-paths-by-type:** 支援全域 Pnpm 路徑檢測與符號導出 ([161783a](https://github.com/bluelovers/ws-yarn-workspaces/commit/161783aee216ba26f69d0a9373d887d5bfcce638))


### 📦　Code Refactoring

* **require-resolve:** 移入 Symbol 驗證邏輯至 get-paths-by-type 模組並簡化路徑處理 ([d966b27](https://github.com/bluelovers/ws-yarn-workspaces/commit/d966b27311b6470c84fecf1b1117296900b0583e))


### 🔖　Miscellaneous

* . ([f5f9cff](https://github.com/bluelovers/ws-yarn-workspaces/commit/f5f9cff68f126b4f34b4c7c07327c2da24db6b89))



## [1.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/get-global-dirs@1.0.2...@yarn-tool/get-global-dirs@1.0.3) (2026-03-12)



### ✨　Features

* **get-global-dirs, get-paths-by-type:** 支援全域 Pnpm 路徑檢測與符號導出 ([161783a](https://github.com/bluelovers/ws-yarn-workspaces/commit/161783aee216ba26f69d0a9373d887d5bfcce638))



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
