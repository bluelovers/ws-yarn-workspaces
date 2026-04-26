# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.10...@yarn-tool/node-modules-is-alias@3.0.11) (2026-04-26)



### 📚　Documentation

* update deps ([fd5a55c](https://github.com/bluelovers/ws-yarn-workspaces/commit/fd5a55cfd5668cbc6275d44f360b0aeb9bfbf42d))



## [3.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.9...@yarn-tool/node-modules-is-alias@3.0.10) (2026-04-26)


### BREAKING CHANGES

* **static-file:** Introduce `__root-core` for standardized root path resolution and `__TEST_TEMP`



### 📦　Code Refactoring

* **static-file:** Introduce `__root-core` for standardized root path resolution and `__TEST_TEMP` ([a7a598b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7a598bd481003a7e92170433cfd1b1e03604ef9))


### ♻️　Chores

* 大範圍更新依賴版本並優化腳本執行與路徑解析 ([221eb35](https://github.com/bluelovers/ws-yarn-workspaces/commit/221eb352b31a00d5ffea5e2c8323b50863508f2c))



## [3.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.8...@yarn-tool/node-modules-is-alias@3.0.9) (2026-03-12)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [3.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.7...@yarn-tool/node-modules-is-alias@3.0.8) (2026-03-10)


### BREAKING CHANGES

* **detect-package-manager:** 過濾 npmClients 陣列中的 null、undefined 和空值



### 🐛　Bug Fixes

* **detect-package-manager:** 過濾 npmClients 陣列中的 null、undefined 和空值 ([c19b988](https://github.com/bluelovers/ws-yarn-workspaces/commit/c19b988b4a1c06fd5e319d4655d9f64b77fd73df))



## [3.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.6...@yarn-tool/node-modules-is-alias@3.0.7) (2026-03-09)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [3.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.5...@yarn-tool/node-modules-is-alias@3.0.6) (2026-03-09)



### ♻️　Chores

* **deps:** 更新 workspace 依賴版本並新增 CI 安裝腳本 ([fbb5b0b](https://github.com/bluelovers/ws-yarn-workspaces/commit/fbb5b0b32cab8cdd34c1f5b5f9a6f8c54213e738))



## [3.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.4...@yarn-tool/node-modules-is-alias@3.0.5) (2026-03-04)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [3.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.3...@yarn-tool/node-modules-is-alias@3.0.4) (2026-03-04)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [3.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.2...@yarn-tool/node-modules-is-alias@3.0.3) (2026-03-02)


### BREAKING CHANGES

* **release:** 核心工具鏈套件升級
- @lazy-node/semver-simple-parse v4.0.0
- @yarn-tool/require-resolve v4.0.0
- @yarn-tool/resolve-package v3.0.0
- @yarn-tool/get-pkg-bin v3.0.0
- @yarn-tool/check-pkg-bin v4.0.0

更新所有工作區套件以使用相容的主要版本，並重構
npm-package-arg-util 以抽離 _parsePackageNameCore 核心函式。



### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* remove empty resolutions and redundant packageManager fields ([65b5c5f](https://github.com/bluelovers/ws-yarn-workspaces/commit/65b5c5f929aae82474408b2b46cfc5a471c919f6))
* add __root.ts test utility to workspace packages ([a771727](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7717278883c86d9ed8ab89f42070d3385c173a7))
* **deps:** 升級路徑與檔案系統相關依賴版本 ([78d395b](https://github.com/bluelovers/ws-yarn-workspaces/commit/78d395b5469feecc85f250ca2d8b4977161e7618))
* **deps:** 更新依賴版本並將腳本執行從 yarn 遷移至 node --run ([389e581](https://github.com/bluelovers/ws-yarn-workspaces/commit/389e581a07cf803dc34c8402b4d3f69af0016b8c))
* **deps:** 升級多項依賴套件版本 ([1382602](https://github.com/bluelovers/ws-yarn-workspaces/commit/1382602ca94ff236b251fd1481b6332468de4621))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))


### 🔖　Miscellaneous

* . ([d0a2adc](https://github.com/bluelovers/ws-yarn-workspaces/commit/d0a2adca7732fe14da2977d24e148f42b10bdd1c))



## [3.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.1...@yarn-tool/node-modules-is-alias@3.0.2) (2025-09-07)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [3.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@3.0.0...@yarn-tool/node-modules-is-alias@3.0.1) (2024-05-03)



### 🛠　Build System

* update typescript ([ffa656a](https://github.com/bluelovers/ws-yarn-workspaces/commit/ffa656aefe53966db445d52234eb0efe4651e3dd))



# [3.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.14...@yarn-tool/node-modules-is-alias@3.0.0) (2023-10-10)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [2.0.14](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.13...@yarn-tool/node-modules-is-alias@2.0.14) (2022-12-09)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [2.0.13](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.12...@yarn-tool/node-modules-is-alias@2.0.13) (2022-11-14)



### 📌　Dependencies

* update deps ([faff44f](https://github.com/bluelovers/ws-yarn-workspaces/commit/faff44f1f5ad5066c747ea8d5d66fa10049c17fe))



## [2.0.12](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.11...@yarn-tool/node-modules-is-alias@2.0.12) (2022-10-28)



### 📌　Dependencies

* update deps ([00de9bf](https://github.com/bluelovers/ws-yarn-workspaces/commit/00de9bf62a49f5de21e60c6a120fc4d3e6e058e3))


### 🔖　Miscellaneous

* . ([6eaff42](https://github.com/bluelovers/ws-yarn-workspaces/commit/6eaff42a32ef2237b770c48ccc42576a4f9934ee))



## [2.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.10...@yarn-tool/node-modules-is-alias@2.0.11) (2022-10-01)



### 🔖　Miscellaneous

* . ([777d61a](https://github.com/bluelovers/ws-yarn-workspaces/commit/777d61af255146b2b1b1f364587c36a0f5bfc00c))



## [2.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.9...@yarn-tool/node-modules-is-alias@2.0.10) (2022-09-29)



### 🔖　Miscellaneous

* . ([6035e23](https://github.com/bluelovers/ws-yarn-workspaces/commit/6035e2399f4f5a5f5e5ac56309b6dc37ffe91389))



## [2.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.8...@yarn-tool/node-modules-is-alias@2.0.9) (2022-09-28)



### 📌　Dependencies

* update deps ([1d6bcad](https://github.com/bluelovers/ws-yarn-workspaces/commit/1d6bcad8d8cf45daeab2360144383208b2ea6b9d))



## [2.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.7...@yarn-tool/node-modules-is-alias@2.0.8) (2022-09-27)



### 🔖　Miscellaneous

* . ([5a4bc19](https://github.com/bluelovers/ws-yarn-workspaces/commit/5a4bc19a0a279a49e752d776279165e14c402427))



## [2.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.6...@yarn-tool/node-modules-is-alias@2.0.7) (2022-09-27)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [2.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.5...@yarn-tool/node-modules-is-alias@2.0.6) (2022-09-06)



### 📚　Documentation

* add directory ([442a552](https://github.com/bluelovers/ws-yarn-workspaces/commit/442a55232619f7fe2b9bad6f8eccfffc4f8f47d2))


### 🔖　Miscellaneous

* . ([3a7fdc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/3a7fdc924ada93b1d0ac0160f8d77e46ff060588))



## [2.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.4...@yarn-tool/node-modules-is-alias@2.0.5) (2022-08-26)



### 🔖　Miscellaneous

* . ([157d5dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/157d5dc8959261d9326f6e633987182898ae9670))



## [2.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.3...@yarn-tool/node-modules-is-alias@2.0.4) (2022-08-19)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [2.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.2...@yarn-tool/node-modules-is-alias@2.0.3) (2022-08-13)


### 💎　Styles

* normalize deps semver ([245f3cf](https://github.com/bluelovers/ws-yarn-workspaces/commit/245f3cf34408c3c7e0628a6e18127122dd3e0f44))





## [2.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.1...@yarn-tool/node-modules-is-alias@2.0.2) (2022-08-13)


### 🚨　Tests

* update jest.config.js and deps ([d1d501b](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1d501ba059130bd8f90e6eaa266084110698011))





## [2.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@2.0.0...@yarn-tool/node-modules-is-alias@2.0.1) (2022-07-31)


### 🚨　Tests

* **preset:** use `@bluelovers/jest-config` ([e239ecf](https://github.com/bluelovers/ws-yarn-workspaces/commit/e239ecf606d82930c6036ec1241bf3b4a1095423))





# [2.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.14...@yarn-tool/node-modules-is-alias@2.0.0) (2022-07-07)


### ♻️　Dependencies

* update deps ([aff04a4](https://github.com/bluelovers/ws-yarn-workspaces/commit/aff04a47e24f963121cf893a03a5b92dfcb6b720))





## [1.0.14](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.12...@yarn-tool/node-modules-is-alias@1.0.14) (2022-06-28)


### 🔖　Miscellaneous

* . ([80be3f2](https://github.com/bluelovers/ws-yarn-workspaces/commit/80be3f28b36c30cad697d291a26b4c4fa523efc5))





## [1.0.12](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.11...@yarn-tool/node-modules-is-alias@1.0.12) (2022-05-11)


### ♻️　Chores

* update deps ([6f226ac](https://github.com/bluelovers/ws-yarn-workspaces/commit/6f226acfd22f0b213eaa8a84886f8391284b1fcf))





## [1.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.10...@yarn-tool/node-modules-is-alias@1.0.11) (2022-03-16)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.9...@yarn-tool/node-modules-is-alias@1.0.10) (2022-03-14)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.7...@yarn-tool/node-modules-is-alias@1.0.9) (2022-02-27)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.7...@yarn-tool/node-modules-is-alias@1.0.8) (2022-02-27)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.6...@yarn-tool/node-modules-is-alias@1.0.7) (2022-02-19)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.5...@yarn-tool/node-modules-is-alias@1.0.6) (2022-02-12)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.4...@yarn-tool/node-modules-is-alias@1.0.5) (2022-01-13)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.3...@yarn-tool/node-modules-is-alias@1.0.4) (2021-12-31)


### 📦　Code Refactoring

* code splitting ([3236306](https://github.com/bluelovers/ws-yarn-workspaces/commit/323630687dcfaa851cd65176d446d55f74a1dd3b))





## [1.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.2...@yarn-tool/node-modules-is-alias@1.0.3) (2021-12-16)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## [1.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/node-modules-is-alias@1.0.1...@yarn-tool/node-modules-is-alias@1.0.2) (2021-12-06)

**Note:** Version bump only for package @yarn-tool/node-modules-is-alias





## 1.0.1 (2021-11-28)


### 🔖　Miscellaneous

* . ([8d7589f](https://github.com/bluelovers/ws-yarn-workspaces/commit/8d7589f597045546a6af24675c325b2b8174e293))
* check given node modules path is alias or not ([857ec51](https://github.com/bluelovers/ws-yarn-workspaces/commit/857ec5120aed04f651697c3f4e30251ebc45d3d4))
