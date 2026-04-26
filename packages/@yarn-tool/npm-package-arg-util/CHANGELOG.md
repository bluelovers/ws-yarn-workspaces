# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@2.0.6...@yarn-tool/npm-package-arg-util@2.0.7) (2026-04-26)



### 📚　Documentation

* update deps ([fd5a55c](https://github.com/bluelovers/ws-yarn-workspaces/commit/fd5a55cfd5668cbc6275d44f360b0aeb9bfbf42d))



## [2.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@2.0.5...@yarn-tool/npm-package-arg-util@2.0.6) (2026-04-26)



### ♻️　Chores

* 大範圍更新依賴版本並優化腳本執行與路徑解析 ([221eb35](https://github.com/bluelovers/ws-yarn-workspaces/commit/221eb352b31a00d5ffea5e2c8323b50863508f2c))



## [2.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@2.0.4...@yarn-tool/npm-package-arg-util@2.0.5) (2026-03-09)

**Note:** Version bump only for package @yarn-tool/npm-package-arg-util





## [2.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@2.0.3...@yarn-tool/npm-package-arg-util@2.0.4) (2026-03-09)



### 📦　Code Refactoring

* **npm-package-arg-util:** 提取核心解析邏輯為獨立內部函數並完善文件 ([7456e90](https://github.com/bluelovers/ws-yarn-workspaces/commit/7456e9063920825a51c158650fdf415e4fe73357))
* **test:** add _lazyParsePackageName helper for combined parsing results ([ad22041](https://github.com/bluelovers/ws-yarn-workspaces/commit/ad2204197737d2c6f9d238028dd169f5abcbe317))


### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))



## [2.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@2.0.2...@yarn-tool/npm-package-arg-util@2.0.3) (2026-03-02)


### BREAKING CHANGES

* **release:** 核心工具鏈套件升級
- @lazy-node/semver-simple-parse v4.0.0
- @yarn-tool/require-resolve v4.0.0
- @yarn-tool/resolve-package v3.0.0
- @yarn-tool/get-pkg-bin v3.0.0
- @yarn-tool/check-pkg-bin v4.0.0

更新所有工作區套件以使用相容的主要版本，並重構
npm-package-arg-util 以抽離 _parsePackageNameCore 核心函式。
* **npm-package-arg-util:** 升級 npm-package-arg 依賴至 ^13.0.2 新增完整雙語文檔並增加測試覆蓋率



### ✨　Features

* **npm-package-arg-util:** 新增空值與特殊輸入檢測功能 ([c5e9acc](https://github.com/bluelovers/ws-yarn-workspaces/commit/c5e9acccc49e1c544f8e5aefa1532a35f5e99a9d))
* **npm-package-arg-util:** 新增 EnumResultType 枚舉並完善類型文件與 JSDoc ([34e46e1](https://github.com/bluelovers/ws-yarn-workspaces/commit/34e46e1844b3708d5f6b147b7b8aa993a5d7194f))
* **npm-package-arg-util:** 增強類型定義與斷言函數驗證 ([88fb780](https://github.com/bluelovers/ws-yarn-workspaces/commit/88fb78054588d32196e7ca6a611ecd383129a8f3))


### 📦　Code Refactoring

* **npm-package-arg-util:** 新增靈活驗證選項與 npa2/npaTry2 函數 ([c468023](https://github.com/bluelovers/ws-yarn-workspaces/commit/c4680239532d8e26e7520f8b71c357dfd091ecaf))
* **npm-package-arg-util:** 重構斷言邏輯並改進測試工具函數 ([6099ef8](https://github.com/bluelovers/ws-yarn-workspaces/commit/6099ef8ff70d8377259d4e1862575dac77cac5a9))


### 📚　Documentation

* **npm-package-arg-util:** 升級 npm-package-arg 依賴至 ^13.0.2 新增完整雙語文檔並增加測試覆蓋率 ([9a1d212](https://github.com/bluelovers/ws-yarn-workspaces/commit/9a1d21235fa59ccb1d075638a1a5401b7624cbcd))


### 🚨　Tests

* **npm-package-arg-util:** 新增 npa 基礎測試案例並更新快照 ([6794a97](https://github.com/bluelovers/ws-yarn-workspaces/commit/6794a977d93b2824a75dbac2ce49705c3429e680))
* **npm-package-arg-util:** 使用彈性匹配器改善測試可移植性 ([eca73ab](https://github.com/bluelovers/ws-yarn-workspaces/commit/eca73abbdea5459ff2c3e8785632ddf885ddad10))


### 🛠　Build System

* add npa2 functions with flexible parsing options ([b336639](https://github.com/bluelovers/ws-yarn-workspaces/commit/b33663948394ec33d567964d8b82318a6c41b52a))
* **semver-parse,npm-package-arg-util:** 支援部分版本並新增輸入檢測功能 ([e824769](https://github.com/bluelovers/ws-yarn-workspaces/commit/e8247696151c6ffcd146eacdb46be0ee721ebefd))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* add __root.ts test utility to workspace packages ([a771727](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7717278883c86d9ed8ab89f42070d3385c173a7))
* **assert:** improve validation logic and error messages ([82e5e06](https://github.com/bluelovers/ws-yarn-workspaces/commit/82e5e06ffc90ddf92d4ffd98a2b78f607de990da))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))



## [2.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@2.0.1...@yarn-tool/npm-package-arg-util@2.0.2) (2025-09-07)



### 📌　Dependencies

* fix and update deps avoid use yargs@18 ([5ed9a5c](https://github.com/bluelovers/ws-yarn-workspaces/commit/5ed9a5cd953eeebd28d4ee970e99bed6fb966317))



## [2.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@2.0.0...@yarn-tool/npm-package-arg-util@2.0.1) (2024-05-03)



### 🛠　Build System

* update typescript ([ffa656a](https://github.com/bluelovers/ws-yarn-workspaces/commit/ffa656aefe53966db445d52234eb0efe4651e3dd))


### 📌　Dependencies

* update deps ([f731d88](https://github.com/bluelovers/ws-yarn-workspaces/commit/f731d88db6e63d180e2db2e493beb42e84eb8e16))



# [2.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.39...@yarn-tool/npm-package-arg-util@2.0.0) (2023-10-10)



### 📌　Dependencies

* update deps ([8db6bc0](https://github.com/bluelovers/ws-yarn-workspaces/commit/8db6bc0189457346924022f9c38f4ae8162c5a5e))



## [1.0.39](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.38...@yarn-tool/npm-package-arg-util@1.0.39) (2022-12-09)



### 📌　Dependencies

* update deps ([fe41874](https://github.com/bluelovers/ws-yarn-workspaces/commit/fe41874d6fd01f5f2b773aa085b80ee2d0683edc))



## [1.0.38](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.37...@yarn-tool/npm-package-arg-util@1.0.38) (2022-11-14)



### 📌　Dependencies

* update deps ([faff44f](https://github.com/bluelovers/ws-yarn-workspaces/commit/faff44f1f5ad5066c747ea8d5d66fa10049c17fe))



## [1.0.37](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.36...@yarn-tool/npm-package-arg-util@1.0.37) (2022-10-28)



### 📌　Dependencies

* update deps ([dcd795b](https://github.com/bluelovers/ws-yarn-workspaces/commit/dcd795b251e73ffdbade2a4086f360241cb4cb03))



## [1.0.36](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.35...@yarn-tool/npm-package-arg-util@1.0.36) (2022-10-01)



### 🔖　Miscellaneous

* . ([777d61a](https://github.com/bluelovers/ws-yarn-workspaces/commit/777d61af255146b2b1b1f364587c36a0f5bfc00c))



## [1.0.35](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.34...@yarn-tool/npm-package-arg-util@1.0.35) (2022-09-29)



### 🔖　Miscellaneous

* . ([6035e23](https://github.com/bluelovers/ws-yarn-workspaces/commit/6035e2399f4f5a5f5e5ac56309b6dc37ffe91389))



## [1.0.34](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.33...@yarn-tool/npm-package-arg-util@1.0.34) (2022-09-27)



### 🔖　Miscellaneous

* . ([5a4bc19](https://github.com/bluelovers/ws-yarn-workspaces/commit/5a4bc19a0a279a49e752d776279165e14c402427))



## [1.0.33](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.32...@yarn-tool/npm-package-arg-util@1.0.33) (2022-09-06)



### 📚　Documentation

* add directory ([442a552](https://github.com/bluelovers/ws-yarn-workspaces/commit/442a55232619f7fe2b9bad6f8eccfffc4f8f47d2))


### 🔖　Miscellaneous

* . ([3a7fdc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/3a7fdc924ada93b1d0ac0160f8d77e46ff060588))



## [1.0.32](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.31...@yarn-tool/npm-package-arg-util@1.0.32) (2022-08-26)



### 🚨　Tests

* **snapshot:** snapshots updated ([50bff7c](https://github.com/bluelovers/ws-yarn-workspaces/commit/50bff7c13e1b01eb551c9b2252cfe3d971da8db8))


### 🔖　Miscellaneous

* . ([157d5dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/157d5dc8959261d9326f6e633987182898ae9670))



## [1.0.31](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.30...@yarn-tool/npm-package-arg-util@1.0.31) (2022-08-19)


### 📦　Code Refactoring

* @yarn-tool/pkg-name-util ([f1f9eed](https://github.com/bluelovers/ws-yarn-workspaces/commit/f1f9eeda368678d4972235e40518491496a5cf95))





## [1.0.30](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.29...@yarn-tool/npm-package-arg-util@1.0.30) (2022-08-13)


### 🚨　Tests

* update jest.config.js and deps ([d1d501b](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1d501ba059130bd8f90e6eaa266084110698011))


### 🛠　Build System

* update typescript ([b69b593](https://github.com/bluelovers/ws-yarn-workspaces/commit/b69b593d511d9d4e246513dc1d69721150b9cfe8))





## [1.0.29](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.28...@yarn-tool/npm-package-arg-util@1.0.29) (2022-07-31)


### 🚨　Tests

* **preset:** use `@bluelovers/jest-config` ([e239ecf](https://github.com/bluelovers/ws-yarn-workspaces/commit/e239ecf606d82930c6036ec1241bf3b4a1095423))





## [1.0.28](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.25...@yarn-tool/npm-package-arg-util@1.0.28) (2022-06-28)


### 🚨　Tests

* **snapshots:** update snapshots ([c30ad89](https://github.com/bluelovers/ws-yarn-workspaces/commit/c30ad89b503ee1a4b7c4ecb5a54de00909c2a684))


### 🔖　Miscellaneous

* . ([80be3f2](https://github.com/bluelovers/ws-yarn-workspaces/commit/80be3f28b36c30cad697d291a26b4c4fa523efc5))
* . ([a28d30b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a28d30bbb9879efbf0483c362b56eb6fd1f1108b))
* . ([a0e3432](https://github.com/bluelovers/ws-yarn-workspaces/commit/a0e3432865c19812d08f4bd481f9835a097d1158))





## [1.0.27](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.25...@yarn-tool/npm-package-arg-util@1.0.27) (2022-06-28)


### 🚨　Tests

* **snapshots:** update snapshots ([c30ad89](https://github.com/bluelovers/ws-yarn-workspaces/commit/c30ad89b503ee1a4b7c4ecb5a54de00909c2a684))


### 🔖　Miscellaneous

* . ([a28d30b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a28d30bbb9879efbf0483c362b56eb6fd1f1108b))
* . ([a0e3432](https://github.com/bluelovers/ws-yarn-workspaces/commit/a0e3432865c19812d08f4bd481f9835a097d1158))





## [1.0.26](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.25...@yarn-tool/npm-package-arg-util@1.0.26) (2022-06-28)


### 🚨　Tests

* **snapshots:** update snapshots ([c30ad89](https://github.com/bluelovers/ws-yarn-workspaces/commit/c30ad89b503ee1a4b7c4ecb5a54de00909c2a684))


### 🔖　Miscellaneous

* . ([a0e3432](https://github.com/bluelovers/ws-yarn-workspaces/commit/a0e3432865c19812d08f4bd481f9835a097d1158))





## [1.0.25](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.24...@yarn-tool/npm-package-arg-util@1.0.25) (2022-05-11)


### ♻️　Chores

* update deps ([6f226ac](https://github.com/bluelovers/ws-yarn-workspaces/commit/6f226acfd22f0b213eaa8a84886f8391284b1fcf))





## [1.0.24](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.23...@yarn-tool/npm-package-arg-util@1.0.24) (2022-03-16)


### ♻️　Chores

* **deps:** update deps ([560c950](https://github.com/bluelovers/ws-yarn-workspaces/commit/560c9509821b9c7b8e2f63779e4a88f53a1f2d2f))





## [1.0.23](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.22...@yarn-tool/npm-package-arg-util@1.0.23) (2022-02-12)


### ♻️　Chores

* **deps:** update deps ([478dfbf](https://github.com/bluelovers/ws-yarn-workspaces/commit/478dfbfbe7b9424d6a7068a4a578acd2d75fa07d))





## [1.0.22](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.21...@yarn-tool/npm-package-arg-util@1.0.22) (2021-12-16)


### 🔖　Miscellaneous

* . ([104475f](https://github.com/bluelovers/ws-yarn-workspaces/commit/104475f2baa62e53dcc4cd6f3fb3a425cba1c88d))





## [1.0.21](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.19...@yarn-tool/npm-package-arg-util@1.0.21) (2021-11-23)


### 🐛　Bug Fixes

* check npa result exists name ([9c183e8](https://github.com/bluelovers/ws-yarn-workspaces/commit/9c183e85116f63c04a23cf9a77c51edb8b7a51c0))


### 🚨　Tests

* check npa result exists name ([112bf87](https://github.com/bluelovers/ws-yarn-workspaces/commit/112bf8721dd4e0e3605a958a5a1c0cacc89f8cd3))


### 🔖　Miscellaneous

* . ([8a56e2f](https://github.com/bluelovers/ws-yarn-workspaces/commit/8a56e2fcef7e287e56f0a9de997a1dc473dbe188))





## [1.0.20](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.19...@yarn-tool/npm-package-arg-util@1.0.20) (2021-11-23)


### 🐛　Bug Fixes

* check npa result exists name ([9c183e8](https://github.com/bluelovers/ws-yarn-workspaces/commit/9c183e85116f63c04a23cf9a77c51edb8b7a51c0))


### 🚨　Tests

* check npa result exists name ([112bf87](https://github.com/bluelovers/ws-yarn-workspaces/commit/112bf8721dd4e0e3605a958a5a1c0cacc89f8cd3))





## [1.0.19](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.18...@yarn-tool/npm-package-arg-util@1.0.19) (2021-08-13)


### ♻️　Chores

* **deps:** update deps ([cc53689](https://github.com/bluelovers/ws-yarn-workspaces/commit/cc53689dadd1334672807d4737c0e6400b15aba0))





## [1.0.18](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.16...@yarn-tool/npm-package-arg-util@1.0.18) (2021-07-11)


### 📦　Code Refactoring

* update SemverRange ([941c169](https://github.com/bluelovers/ws-yarn-workspaces/commit/941c169f1ca7b379c44dc40c5f40388060d79d15))


### 🛠　Build System

* use tslib ([a172f5b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a172f5b85b6b74256ebc8707435e0756adfd533a))


### 🔖　Miscellaneous

* . ([992892b](https://github.com/bluelovers/ws-yarn-workspaces/commit/992892bbf110cad2a8ee559521fc64506700e228))





## [1.0.17](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.16...@yarn-tool/npm-package-arg-util@1.0.17) (2021-07-11)


### 📦　Code Refactoring

* update SemverRange ([941c169](https://github.com/bluelovers/ws-yarn-workspaces/commit/941c169f1ca7b379c44dc40c5f40388060d79d15))


### 🛠　Build System

* use tslib ([a172f5b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a172f5b85b6b74256ebc8707435e0756adfd533a))





## [1.0.16](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.15...@yarn-tool/npm-package-arg-util@1.0.16) (2021-06-21)


### 📦　Code Refactoring

* add `npaTry` ([f6cf50c](https://github.com/bluelovers/ws-yarn-workspaces/commit/f6cf50ca06978a2baf9cba6f1904221513da61ee))


### ♻️　Chores

* **deps:** update deps ([32a3cff](https://github.com/bluelovers/ws-yarn-workspaces/commit/32a3cff85a28c9c7e26ab9e13860c025f9c32b1c))





## [1.0.15](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.14...@yarn-tool/npm-package-arg-util@1.0.15) (2021-06-07)


### ♻️　Chores

* update deps ([79639b4](https://github.com/bluelovers/ws-yarn-workspaces/commit/79639b44f56e8c9fb7abd64249f77750fdc51127))





## [1.0.14](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.13...@yarn-tool/npm-package-arg-util@1.0.14) (2021-06-02)


### 🔖　Miscellaneous

* . ([a7f9153](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7f9153a83d7cb055a7a52f4ece7a9429126890d))





## [1.0.13](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.11...@yarn-tool/npm-package-arg-util@1.0.13) (2021-05-17)


### ♻️　Chores

* update deps ([65356d0](https://github.com/bluelovers/ws-yarn-workspaces/commit/65356d095752ea1c9b5524380e1fcee659871562))





## [1.0.12](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.11...@yarn-tool/npm-package-arg-util@1.0.12) (2021-05-17)


### ♻️　Chores

* update deps ([65356d0](https://github.com/bluelovers/ws-yarn-workspaces/commit/65356d095752ea1c9b5524380e1fcee659871562))





## [1.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.10...@yarn-tool/npm-package-arg-util@1.0.11) (2021-02-08)


### 🛠　Build System

* **typescript:** update build files ([16e37c7](https://github.com/bluelovers/ws-yarn-workspaces/commit/16e37c7b0692fe4a156f793618a3487b6aa81c56))





## [1.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.9...@yarn-tool/npm-package-arg-util@1.0.10) (2020-12-10)


### ♻️　Chores

* update deps ([42c0cea](https://github.com/bluelovers/ws-yarn-workspaces/commit/42c0cea71062526ba664c8b5cf0888c0d15a1359))





## [1.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.8...@yarn-tool/npm-package-arg-util@1.0.9) (2020-09-23)


### 🛠　Build System

* update build js ([217f6de](https://github.com/bluelovers/ws-yarn-workspaces/commit/217f6ded5e656fa91c530b032ced00a3f2d50d4d))





## [1.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.7...@yarn-tool/npm-package-arg-util@1.0.8) (2020-09-04)


### ♻️　Chores

* **deps:** update deps ([34bfa51](https://github.com/bluelovers/ws-yarn-workspaces/commit/34bfa51ebe13e7d6b9289001c16cf3cfb33d477d))





## [1.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.6...@yarn-tool/npm-package-arg-util@1.0.7) (2020-08-19)


### 🔖　Miscellaneous

* . ([83babc2](https://github.com/bluelovers/ws-yarn-workspaces/commit/83babc26a7386390b3ced7e33a69d4242af7ebae))





## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.5...@yarn-tool/npm-package-arg-util@1.0.6) (2020-08-17)


### 🔖　Miscellaneous

* . ([77f0ed9](https://github.com/bluelovers/ws-yarn-workspaces/commit/77f0ed9f56bfa5c774df593c117be964e1136e73))





## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/npm-package-arg-util@1.0.4...@yarn-tool/npm-package-arg-util@1.0.5) (2020-08-17)


### 🐛　Bug Fixes

* ``@types/typescript` should be same ([2eea803](https://github.com/bluelovers/ws-yarn-workspaces/commit/2eea8038252f24f0bad2f11d69b9009b8a4c3c05))


### 📦　Code Refactoring

* code splitting ([adf8db9](https://github.com/bluelovers/ws-yarn-workspaces/commit/adf8db933ceca6c55629910194cd236b5b962299))


### 🔖　Miscellaneous

* . ([2c41bb7](https://github.com/bluelovers/ws-yarn-workspaces/commit/2c41bb70e56bdde67d24747b850f83b9df913247))





## 1.0.4 (2020-08-12)


### ✨　Features

* use @yarn-tool/npm-package-arg-util ([8b006c1](https://github.com/bluelovers/ws-yarn-workspaces/commit/8b006c127a6b65766c2ce656c9e405fa213fff0c))


### 📦　Code Refactoring

* code splitting ([b3980b5](https://github.com/bluelovers/ws-yarn-workspaces/commit/b3980b5128d144e05e5f012eeb6efe5527bb0a21))


### 🔖　Miscellaneous

* . ([7d4b7df](https://github.com/bluelovers/ws-yarn-workspaces/commit/7d4b7df38006b018eef185784d22f30171bcd435))
* . ([32d2ba2](https://github.com/bluelovers/ws-yarn-workspaces/commit/32d2ba2d3e9b0f0d3d77496a39e225868b28f892))





## 1.0.3 (2020-08-12)


### ✨　Features

* use @yarn-tool/npm-package-arg-util ([8b006c1](https://github.com/bluelovers/ws-yarn-workspaces/commit/8b006c127a6b65766c2ce656c9e405fa213fff0c))


### 📦　Code Refactoring

* code splitting ([b3980b5](https://github.com/bluelovers/ws-yarn-workspaces/commit/b3980b5128d144e05e5f012eeb6efe5527bb0a21))


### 🔖　Miscellaneous

* . ([7d4b7df](https://github.com/bluelovers/ws-yarn-workspaces/commit/7d4b7df38006b018eef185784d22f30171bcd435))
* . ([32d2ba2](https://github.com/bluelovers/ws-yarn-workspaces/commit/32d2ba2d3e9b0f0d3d77496a39e225868b28f892))





## 1.0.2 (2020-08-12)


### ✨　Features

* use @yarn-tool/npm-package-arg-util ([8b006c1](https://github.com/bluelovers/ws-yarn-workspaces/commit/8b006c127a6b65766c2ce656c9e405fa213fff0c))


### 📦　Code Refactoring

* code splitting ([b3980b5](https://github.com/bluelovers/ws-yarn-workspaces/commit/b3980b5128d144e05e5f012eeb6efe5527bb0a21))


### 🔖　Miscellaneous

* . ([32d2ba2](https://github.com/bluelovers/ws-yarn-workspaces/commit/32d2ba2d3e9b0f0d3d77496a39e225868b28f892))





## 1.0.1 (2020-08-12)


### ✨　Features

* use @yarn-tool/npm-package-arg-util ([8b006c1](https://github.com/bluelovers/ws-yarn-workspaces/commit/8b006c127a6b65766c2ce656c9e405fa213fff0c))


### 📦　Code Refactoring

* code splitting ([b3980b5](https://github.com/bluelovers/ws-yarn-workspaces/commit/b3980b5128d144e05e5f012eeb6efe5527bb0a21))
