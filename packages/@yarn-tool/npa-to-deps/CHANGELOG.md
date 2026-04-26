# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@3.0.5...@yarn-tool/npa-to-deps@3.0.6) (2026-04-26)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [3.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@3.0.4...@yarn-tool/npa-to-deps@3.0.5) (2026-03-09)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [3.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@3.0.3...@yarn-tool/npa-to-deps@3.0.4) (2026-03-09)



### ♻️　Chores

* **deps:** 更新 workspace 依賴版本並新增 CI 安裝腳本 ([fbb5b0b](https://github.com/bluelovers/ws-yarn-workspaces/commit/fbb5b0b32cab8cdd34c1f5b5f9a6f8c54213e738))



## [3.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@3.0.2...@yarn-tool/npa-to-deps@3.0.3) (2026-03-02)


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

* **npa-to-deps:** 新增名稱與規格相同時的查詢標記邏輯 ([6baa8eb](https://github.com/bluelovers/ws-yarn-workspaces/commit/6baa8eb5b1900ae548e459f5756eb4155f2842f2))


### ✨　Features

* **npm-package-arg-util:** 新增空值與特殊輸入檢測功能 ([c5e9acc](https://github.com/bluelovers/ws-yarn-workspaces/commit/c5e9acccc49e1c544f8e5aefa1532a35f5e99a9d))


### 🛠　Build System

* **semver-parse,npm-package-arg-util:** 支援部分版本並新增輸入檢測功能 ([e824769](https://github.com/bluelovers/ws-yarn-workspaces/commit/e8247696151c6ffcd146eacdb46be0ee721ebefd))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* 更新 Jest 快照連結並增強類型定義與文件 ([b663b97](https://github.com/bluelovers/ws-yarn-workspaces/commit/b663b97d78d223dc8b3927ea2433938350144de7))
* remove empty resolutions and redundant packageManager fields ([65b5c5f](https://github.com/bluelovers/ws-yarn-workspaces/commit/65b5c5f929aae82474408b2b46cfc5a471c919f6))
* add __root.ts test utility to workspace packages ([a771727](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7717278883c86d9ed8ab89f42070d3385c173a7))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))



## [3.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@3.0.1...@yarn-tool/npa-to-deps@3.0.2) (2025-09-07)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [3.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@3.0.0...@yarn-tool/npa-to-deps@3.0.1) (2024-05-03)



### 🛠　Build System

* update typescript ([ffa656a](https://github.com/bluelovers/ws-yarn-workspaces/commit/ffa656aefe53966db445d52234eb0efe4651e3dd))



# [3.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.11...@yarn-tool/npa-to-deps@3.0.0) (2023-10-10)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [2.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.10...@yarn-tool/npa-to-deps@2.0.11) (2022-12-09)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [2.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.9...@yarn-tool/npa-to-deps@2.0.10) (2022-11-14)



### 📌　Dependencies

* update deps ([faff44f](https://github.com/bluelovers/ws-yarn-workspaces/commit/faff44f1f5ad5066c747ea8d5d66fa10049c17fe))



## [2.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.8...@yarn-tool/npa-to-deps@2.0.9) (2022-10-28)



### 🚨　Tests

* add more test ([0cf3ef8](https://github.com/bluelovers/ws-yarn-workspaces/commit/0cf3ef8cdd2c761e11f1d3137ad27765d0fbc008))



## [2.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.7...@yarn-tool/npa-to-deps@2.0.8) (2022-10-01)



### 🔖　Miscellaneous

* . ([777d61a](https://github.com/bluelovers/ws-yarn-workspaces/commit/777d61af255146b2b1b1f364587c36a0f5bfc00c))



## [2.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.6...@yarn-tool/npa-to-deps@2.0.7) (2022-09-29)



### 🔖　Miscellaneous

* . ([6035e23](https://github.com/bluelovers/ws-yarn-workspaces/commit/6035e2399f4f5a5f5e5ac56309b6dc37ffe91389))



## [2.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.5...@yarn-tool/npa-to-deps@2.0.6) (2022-09-27)



### 🔖　Miscellaneous

* . ([5a4bc19](https://github.com/bluelovers/ws-yarn-workspaces/commit/5a4bc19a0a279a49e752d776279165e14c402427))



## [2.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.4...@yarn-tool/npa-to-deps@2.0.5) (2022-09-06)



### 📚　Documentation

* add directory ([442a552](https://github.com/bluelovers/ws-yarn-workspaces/commit/442a55232619f7fe2b9bad6f8eccfffc4f8f47d2))


### 🔖　Miscellaneous

* . ([3a7fdc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/3a7fdc924ada93b1d0ac0160f8d77e46ff060588))



## [2.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.3...@yarn-tool/npa-to-deps@2.0.4) (2022-08-26)



### 🚨　Tests

* **snapshot:** snapshots updated ([50bff7c](https://github.com/bluelovers/ws-yarn-workspaces/commit/50bff7c13e1b01eb551c9b2252cfe3d971da8db8))


### 🔖　Miscellaneous

* . ([157d5dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/157d5dc8959261d9326f6e633987182898ae9670))



## [2.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.2...@yarn-tool/npa-to-deps@2.0.3) (2022-08-19)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [2.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.1...@yarn-tool/npa-to-deps@2.0.2) (2022-08-13)


### 🚨　Tests

* update jest.config.js and deps ([d1d501b](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1d501ba059130bd8f90e6eaa266084110698011))





## [2.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@2.0.0...@yarn-tool/npa-to-deps@2.0.1) (2022-07-31)


### 🚨　Tests

* **preset:** use `@bluelovers/jest-config` ([e239ecf](https://github.com/bluelovers/ws-yarn-workspaces/commit/e239ecf606d82930c6036ec1241bf3b4a1095423))





# [2.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.18...@yarn-tool/npa-to-deps@2.0.0) (2022-07-07)


### ♻️　Dependencies

* update deps ([aff04a4](https://github.com/bluelovers/ws-yarn-workspaces/commit/aff04a47e24f963121cf893a03a5b92dfcb6b720))





## [1.0.18](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.17...@yarn-tool/npa-to-deps@1.0.18) (2022-06-28)


### 🔖　Miscellaneous

* . ([80be3f2](https://github.com/bluelovers/ws-yarn-workspaces/commit/80be3f28b36c30cad697d291a26b4c4fa523efc5))





## [1.0.17](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.16...@yarn-tool/npa-to-deps@1.0.17) (2022-05-11)


### ♻️　Chores

* update deps ([6f226ac](https://github.com/bluelovers/ws-yarn-workspaces/commit/6f226acfd22f0b213eaa8a84886f8391284b1fcf))





## [1.0.16](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.15...@yarn-tool/npa-to-deps@1.0.16) (2022-03-16)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.15](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.14...@yarn-tool/npa-to-deps@1.0.15) (2022-03-14)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.14](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.12...@yarn-tool/npa-to-deps@1.0.14) (2022-02-27)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.13](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.12...@yarn-tool/npa-to-deps@1.0.13) (2022-02-27)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.12](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.11...@yarn-tool/npa-to-deps@1.0.12) (2022-02-12)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.10...@yarn-tool/npa-to-deps@1.0.11) (2022-02-05)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.9...@yarn-tool/npa-to-deps@1.0.10) (2022-02-01)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.8...@yarn-tool/npa-to-deps@1.0.9) (2022-01-25)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.7...@yarn-tool/npa-to-deps@1.0.8) (2022-01-13)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.6...@yarn-tool/npa-to-deps@1.0.7) (2021-12-16)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.5...@yarn-tool/npa-to-deps@1.0.6) (2021-12-06)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.4...@yarn-tool/npa-to-deps@1.0.5) (2021-12-06)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.3...@yarn-tool/npa-to-deps@1.0.4) (2021-12-06)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.2...@yarn-tool/npa-to-deps@1.0.3) (2021-11-30)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## [1.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npa-to-deps@1.0.1...@yarn-tool/npa-to-deps@1.0.2) (2021-11-28)

**Note:** Version bump only for package @yarn-tool/npa-to-deps





## 1.0.1 (2021-11-23)


### 🔖　Miscellaneous

* `@yarn-tool/npa-to-deps-query` ([c288090](https://github.com/bluelovers/ws-yarn-workspaces/commit/c2880907ca72c74307f093e503e3d10d21778e01))
