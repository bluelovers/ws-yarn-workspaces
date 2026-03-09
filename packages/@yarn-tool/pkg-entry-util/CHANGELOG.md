# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@3.0.6...@yarn-tool/pkg-entry-util@3.0.7) (2026-03-08)



### ✨　Features

* **scripts:** 重構 `ci:install` 腳本並新增 pnpm 支援 ([547029b](https://github.com/bluelovers/ws-yarn-workspaces/commit/547029b2d83d86b2ef8227d06d95a824e10d0eaf))


### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))



## [3.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@3.0.5...@yarn-tool/pkg-entry-util@3.0.6) (2026-03-04)


### BREAKING CHANGES

* 在 test、lint 及 lerna 相關腳本結尾添加 `--` 以確保額外參數能正確傳遞。
* **fix-all:** 自動移除未指定測試的佔位符腳本



### 🐛　Bug Fixes

* 在 test、lint 及 lerna 相關腳本結尾添加 `--` 以確保額外參數能正確傳遞。 ([88b7b15](https://github.com/bluelovers/ws-yarn-workspaces/commit/88b7b1535bbda94526591cbb4231b6040df11d4e))
* **fix-all:** 自動移除未指定測試的佔位符腳本 ([fb7f8d9](https://github.com/bluelovers/ws-yarn-workspaces/commit/fb7f8d9cc8e725652b4d81a6087d3b71f8265ed2))



## [3.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@3.0.4...@yarn-tool/pkg-entry-util@3.0.5) (2026-03-04)

**Note:** Version bump only for package @yarn-tool/pkg-entry-util





## [3.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@3.0.3...@yarn-tool/pkg-entry-util@3.0.4) (2026-03-02)


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

* **pkg-entry-util:** 將預設腳本執行從 yarn run 遷移至 node --run 並新增 pnpm 支援 ([9a414f0](https://github.com/bluelovers/ws-yarn-workspaces/commit/9a414f0b9b8f2970b539ee6ef45708285af29e13))


### 📚　Documentation

* 為 fix-all、pkg-entry-util、node-package-json-loader 添加完整的 JSDoc 文檔註釋 ([92d17e5](https://github.com/bluelovers/ws-yarn-workspaces/commit/92d17e5866c9330c4ee66e78b34a7318bb7d3203))
* **pkg-entry-util,create-yarn-workspaces,npm-init2:** 新增完整雙語文件與 JSDoc 註解 ([c1786e6](https://github.com/bluelovers/ws-yarn-workspaces/commit/c1786e6785abe484c95ee3dee8b8a16358c3904b))


### 🛠　Build System

* update build ([51d49ad](https://github.com/bluelovers/ws-yarn-workspaces/commit/51d49adaa1f1fbfac4a299007dbf406d7ee7a4c7))
* **pkg-entry-util:** 將腳本執行從 yarn run 遷移至 node --run 並新增 pnpm 支援 ([a2e0302](https://github.com/bluelovers/ws-yarn-workspaces/commit/a2e0302758049af2067e4d0f67f7cc8792f56df2))
* **pkg-entry-util,create-yarn-workspaces,npm-init2:** 新增完整雙語文件與 JSDoc 註解 ([087d6d6](https://github.com/bluelovers/ws-yarn-workspaces/commit/087d6d6e560c70ed68a79ad73c8eb05868ec4203))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* add __root.ts test utility to workspace packages ([a771727](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7717278883c86d9ed8ab89f42070d3385c173a7))
* **deps:** 升級路徑與檔案系統相關依賴版本 ([78d395b](https://github.com/bluelovers/ws-yarn-workspaces/commit/78d395b5469feecc85f250ca2d8b4977161e7618))
* **deps:** 更新依賴版本並將腳本執行從 yarn 遷移至 node --run ([389e581](https://github.com/bluelovers/ws-yarn-workspaces/commit/389e581a07cf803dc34c8402b4d3f69af0016b8c))
* **deps:** 升級多項依賴套件版本 ([1382602](https://github.com/bluelovers/ws-yarn-workspaces/commit/1382602ca94ff236b251fd1481b6332468de4621))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))



## [3.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@3.0.2...@yarn-tool/pkg-entry-util@3.0.3) (2025-09-07)

**Note:** Version bump only for package @yarn-tool/pkg-entry-util





## [3.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@3.0.1...@yarn-tool/pkg-entry-util@3.0.2) (2024-05-03)



### 🛠　Build System

* update typescript ([ffa656a](https://github.com/bluelovers/ws-yarn-workspaces/commit/ffa656aefe53966db445d52234eb0efe4651e3dd))



## [3.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@3.0.0...@yarn-tool/pkg-entry-util@3.0.1) (2024-02-28)



### ✨　Features

* sort semver release type ([df4aec1](https://github.com/bluelovers/ws-yarn-workspaces/commit/df4aec11272e125af14776937a549fa3b1715ae7))


### 📌　Dependencies

* update deps ([d48c90a](https://github.com/bluelovers/ws-yarn-workspaces/commit/d48c90a1f35e626fb9a4dcbb7bad5c5e1164dce1))



# [3.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.25...@yarn-tool/pkg-entry-util@3.0.0) (2023-10-10)



### ✨　Features

* add scripts ([6d201e2](https://github.com/bluelovers/ws-yarn-workspaces/commit/6d201e212aa1849af867e7c68da284ad4270815e))


### 📌　Dependencies

* update deps ([8db6bc0](https://github.com/bluelovers/ws-yarn-workspaces/commit/8db6bc0189457346924022f9c38f4ae8162c5a5e))



## [2.0.25](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.24...@yarn-tool/pkg-entry-util@2.0.25) (2022-12-09)



### 📌　Dependencies

* update deps ([fe41874](https://github.com/bluelovers/ws-yarn-workspaces/commit/fe41874d6fd01f5f2b773aa085b80ee2d0683edc))



## [2.0.24](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.23...@yarn-tool/pkg-entry-util@2.0.24) (2022-11-14)

**Note:** Version bump only for package @yarn-tool/pkg-entry-util





## [2.0.23](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.22...@yarn-tool/pkg-entry-util@2.0.23) (2022-11-04)



### ✨　Features

* update default scripts ([34a8007](https://github.com/bluelovers/ws-yarn-workspaces/commit/34a80070bca51daf8097a17c83fe692477dbe63d))



## [2.0.22](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.21...@yarn-tool/pkg-entry-util@2.0.22) (2022-10-28)



### 📌　Dependencies

* update deps ([dcd795b](https://github.com/bluelovers/ws-yarn-workspaces/commit/dcd795b251e73ffdbade2a4086f360241cb4cb03))
* update deps ([00de9bf](https://github.com/bluelovers/ws-yarn-workspaces/commit/00de9bf62a49f5de21e60c6a120fc4d3e6e058e3))


### 🔖　Miscellaneous

* . ([7f92ce5](https://github.com/bluelovers/ws-yarn-workspaces/commit/7f92ce51ae10641c0714d1413d1f4a0fb5b8688e))



## [2.0.21](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.20...@yarn-tool/pkg-entry-util@2.0.21) (2022-10-01)



### 🔖　Miscellaneous

* . ([777d61a](https://github.com/bluelovers/ws-yarn-workspaces/commit/777d61af255146b2b1b1f364587c36a0f5bfc00c))



## [2.0.20](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.19...@yarn-tool/pkg-entry-util@2.0.20) (2022-09-30)



### ✨　Features

* move `ws:fix-all` to shared root ([c833c6d](https://github.com/bluelovers/ws-yarn-workspaces/commit/c833c6d09145058aba4455c2e6c338697eab5ac0))



## [2.0.19](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.18...@yarn-tool/pkg-entry-util@2.0.19) (2022-09-29)



### 🔖　Miscellaneous

* . ([6035e23](https://github.com/bluelovers/ws-yarn-workspaces/commit/6035e2399f4f5a5f5e5ac56309b6dc37ffe91389))



## [2.0.18](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.17...@yarn-tool/pkg-entry-util@2.0.18) (2022-09-28)



### 📌　Dependencies

* update deps ([1d6bcad](https://github.com/bluelovers/ws-yarn-workspaces/commit/1d6bcad8d8cf45daeab2360144383208b2ea6b9d))



## [2.0.17](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.16...@yarn-tool/pkg-entry-util@2.0.17) (2022-09-27)



### 🔖　Miscellaneous

* . ([5a4bc19](https://github.com/bluelovers/ws-yarn-workspaces/commit/5a4bc19a0a279a49e752d776279165e14c402427))



## [2.0.16](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.15...@yarn-tool/pkg-entry-util@2.0.16) (2022-09-27)



### 🐛　Bug Fixes

* resolve exports ([39a8f85](https://github.com/bluelovers/ws-yarn-workspaces/commit/39a8f85ad96679173723eaeb88c432e665fd83ea))


### ✨　Features

* update script ([cb56d8a](https://github.com/bluelovers/ws-yarn-workspaces/commit/cb56d8a03cfff3222b00394716c5de533209e04c))



## [2.0.15](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.14...@yarn-tool/pkg-entry-util@2.0.15) (2022-09-06)



### 📚　Documentation

* add directory ([442a552](https://github.com/bluelovers/ws-yarn-workspaces/commit/442a55232619f7fe2b9bad6f8eccfffc4f8f47d2))


### 🔖　Miscellaneous

* . ([3a7fdc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/3a7fdc924ada93b1d0ac0160f8d77e46ff060588))



## [2.0.14](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.13...@yarn-tool/pkg-entry-util@2.0.14) (2022-08-26)



### 🔖　Miscellaneous

* . ([157d5dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/157d5dc8959261d9326f6e633987182898ae9670))
* . ([dafc19c](https://github.com/bluelovers/ws-yarn-workspaces/commit/dafc19c43afb42c904b6e7dcc49d93567897c092))



## [2.0.13](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.10...@yarn-tool/pkg-entry-util@2.0.13) (2022-08-25)



### 📦　Code Refactoring

* update script ([cd1016d](https://github.com/bluelovers/ws-yarn-workspaces/commit/cd1016ddcd93d1c1df4795ea4228ec45a76822c3))


### 🚨　Tests

* **snapshot:** snapshots updated ([50bff7c](https://github.com/bluelovers/ws-yarn-workspaces/commit/50bff7c13e1b01eb551c9b2252cfe3d971da8db8))
* **snapshot:** snapshots updated ([ed29b43](https://github.com/bluelovers/ws-yarn-workspaces/commit/ed29b437ae8bc9502d117d6a02fd40c9c24f1e33))


### 🔖　Miscellaneous

* . ([7636d5d](https://github.com/bluelovers/ws-yarn-workspaces/commit/7636d5df9ecb9858107ba6a7ab097d9c948ea7df))



## [2.0.12](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.10...@yarn-tool/pkg-entry-util@2.0.12) (2022-08-25)



### 📦　Code Refactoring

* update script ([cd1016d](https://github.com/bluelovers/ws-yarn-workspaces/commit/cd1016ddcd93d1c1df4795ea4228ec45a76822c3))


### 🚨　Tests

* **snapshot:** snapshots updated ([ed29b43](https://github.com/bluelovers/ws-yarn-workspaces/commit/ed29b437ae8bc9502d117d6a02fd40c9c24f1e33))


### 🔖　Miscellaneous

* . ([7636d5d](https://github.com/bluelovers/ws-yarn-workspaces/commit/7636d5df9ecb9858107ba6a7ab097d9c948ea7df))



## [2.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.10...@yarn-tool/pkg-entry-util@2.0.11) (2022-08-25)



### 📦　Code Refactoring

* update script ([cd1016d](https://github.com/bluelovers/ws-yarn-workspaces/commit/cd1016ddcd93d1c1df4795ea4228ec45a76822c3))


### 🔖　Miscellaneous

* . ([7636d5d](https://github.com/bluelovers/ws-yarn-workspaces/commit/7636d5df9ecb9858107ba6a7ab097d9c948ea7df))



## [2.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.9...@yarn-tool/pkg-entry-util@2.0.10) (2022-08-19)


### 🐛　Bug Fixes

* skip check './src/*' ([e2c48e2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e2c48e2ef7a32700a6208e60766d0e43af623f45))





## [2.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.8...@yarn-tool/pkg-entry-util@2.0.9) (2022-08-18)


### ✨　Features

* add `install:frozenLockfile` ([d7797f1](https://github.com/bluelovers/ws-yarn-workspaces/commit/d7797f13050343208b499895859924eecda42550))





## [2.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.7...@yarn-tool/pkg-entry-util@2.0.8) (2022-08-13)

**Note:** Version bump only for package @yarn-tool/pkg-entry-util





## [2.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.6...@yarn-tool/pkg-entry-util@2.0.7) (2022-08-13)


### ✨　Features

* update preset scripts ([a286355](https://github.com/bluelovers/ws-yarn-workspaces/commit/a286355a578654937a660f7ad04d190a21f29e92))


### 🚨　Tests

* update jest.config.js and deps ([d1d501b](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1d501ba059130bd8f90e6eaa266084110698011))


### 📌　Dependencies

* update deps ([58501f9](https://github.com/bluelovers/ws-yarn-workspaces/commit/58501f97494eb624779dffea7ac9d68e45e5e978))
* update deps ([c968045](https://github.com/bluelovers/ws-yarn-workspaces/commit/c96804598f63a5cd06507e3eaaa2e8b569b14b65))
* update deps ([a0b8755](https://github.com/bluelovers/ws-yarn-workspaces/commit/a0b875582efdc9829b0cdb6c9c819cace8b76e90))





## [2.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.5...@yarn-tool/pkg-entry-util@2.0.6) (2022-07-31)


### 🚨　Tests

* **preset:** use `@bluelovers/jest-config` ([e239ecf](https://github.com/bluelovers/ws-yarn-workspaces/commit/e239ecf606d82930c6036ec1241bf3b4a1095423))





## [2.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.4...@yarn-tool/pkg-entry-util@2.0.5) (2022-07-29)


### 🐛　Bug Fixes

* missing `-u` ([1cb0341](https://github.com/bluelovers/ws-yarn-workspaces/commit/1cb03415837f0ac9bcd75865c100b08524ef2300))





## [2.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.3...@yarn-tool/pkg-entry-util@2.0.4) (2022-07-29)


### ✨　Features

* add cli options ([8e4d528](https://github.com/bluelovers/ws-yarn-workspaces/commit/8e4d528c3975400902929144ea5142598d1a1d1c))





## [2.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.2...@yarn-tool/pkg-entry-util@2.0.3) (2022-07-29)


### 📌　Dependencies

* update deps ([1c8ebb1](https://github.com/bluelovers/ws-yarn-workspaces/commit/1c8ebb1aac482280e369bd92387ee1d18fa6b073))





## [2.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.1...@yarn-tool/pkg-entry-util@2.0.2) (2022-07-14)


### 📌　Dependencies

* update deps ([2064a27](https://github.com/bluelovers/ws-yarn-workspaces/commit/2064a272e9549de6b0d77d9aefeca0fcbaf1182e))





## [2.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@2.0.0...@yarn-tool/pkg-entry-util@2.0.1) (2022-07-14)


### ✨　Features

* change ws run test ([9a6e394](https://github.com/bluelovers/ws-yarn-workspaces/commit/9a6e39415344eb970f7df5f90fa668803a782855))





# [2.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.11...@yarn-tool/pkg-entry-util@2.0.0) (2022-07-07)


### ♻️　Dependencies

* update deps ([aff04a4](https://github.com/bluelovers/ws-yarn-workspaces/commit/aff04a47e24f963121cf893a03a5b92dfcb6b720))





## [1.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.10...@yarn-tool/pkg-entry-util@1.0.11) (2022-05-11)


### ✨　Features

* add `test:jest:clearCache` ([1ac9dfd](https://github.com/bluelovers/ws-yarn-workspaces/commit/1ac9dfdceec5fbc701c60e6a77ccf913306cb762))


### ♻️　Chores

* update deps ([6f226ac](https://github.com/bluelovers/ws-yarn-workspaces/commit/6f226acfd22f0b213eaa8a84886f8391284b1fcf))





## [1.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.9...@yarn-tool/pkg-entry-util@1.0.10) (2022-03-29)

**Note:** Version bump only for package @yarn-tool/pkg-entry-util





## [1.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.8...@yarn-tool/pkg-entry-util@1.0.9) (2022-03-14)


### ✨　Features

* add `--inline-declare-global` ([414532f](https://github.com/bluelovers/ws-yarn-workspaces/commit/414532f51569b858ab2b367a420b73b6c529c6e6))





## [1.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.6...@yarn-tool/pkg-entry-util@1.0.8) (2022-02-27)


### ♻️　Chores

* **deps:** update deps ([109c9d1](https://github.com/bluelovers/ws-yarn-workspaces/commit/109c9d1b437063d069a9aaf5f5b9b15da4d5c76f))





## [1.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.6...@yarn-tool/pkg-entry-util@1.0.7) (2022-02-27)


### ♻️　Chores

* **deps:** update deps ([109c9d1](https://github.com/bluelovers/ws-yarn-workspaces/commit/109c9d1b437063d069a9aaf5f5b9b15da4d5c76f))





## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.5...@yarn-tool/pkg-entry-util@1.0.6) (2022-01-25)


### ♻️　Chores

* **deps:** update deps ([9d91e96](https://github.com/bluelovers/ws-yarn-workspaces/commit/9d91e960a0e02ec2896b791cb5933f47d86b0bc5))





## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.4...@yarn-tool/pkg-entry-util@1.0.5) (2022-01-13)


### 📦　Code Refactoring

* move to shared preset ([158218f](https://github.com/bluelovers/ws-yarn-workspaces/commit/158218f4e58cfb97a40bed485a46deec8978f454))


### ♻️　Chores

* **deps:** update deps ([7658604](https://github.com/bluelovers/ws-yarn-workspaces/commit/7658604e5cabfa61ed92c2579ecae3d37d3fd737))





## [1.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.3...@yarn-tool/pkg-entry-util@1.0.4) (2022-01-01)


### 📦　Code Refactoring

* code splitting ([fa83e8f](https://github.com/bluelovers/ws-yarn-workspaces/commit/fa83e8f47a10a5ad7ed1ac5337d8a2d20c556df9))





## [1.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.2...@yarn-tool/pkg-entry-util@1.0.3) (2021-12-31)


### 📦　Code Refactoring

* code splitting ([3236306](https://github.com/bluelovers/ws-yarn-workspaces/commit/323630687dcfaa851cd65176d446d55f74a1dd3b))





## [1.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/pkg-entry-util@1.0.1...@yarn-tool/pkg-entry-util@1.0.2) (2021-12-26)

**Note:** Version bump only for package @yarn-tool/pkg-entry-util





## 1.0.1 (2021-12-19)


### 📦　Code Refactoring

* `@yarn-tool/pkg-entry-util` ([b450ad0](https://github.com/bluelovers/ws-yarn-workspaces/commit/b450ad0e274785b6d4d76e8b1bc47a1eeb65fc37))
