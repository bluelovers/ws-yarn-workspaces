# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.10...@yarn-tool/ncu-ws@2.0.11) (2026-04-26)



### 📚　Documentation

* update deps ([fd5a55c](https://github.com/bluelovers/ws-yarn-workspaces/commit/fd5a55cfd5668cbc6275d44f360b0aeb9bfbf42d))



## [2.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.9...@yarn-tool/ncu-ws@2.0.10) (2026-04-26)


### BREAKING CHANGES

* **static-file:** Introduce `__root-core` for standardized root path resolution and `__TEST_TEMP`



### 📦　Code Refactoring

* **static-file:** Introduce `__root-core` for standardized root path resolution and `__TEST_TEMP` ([a7a598b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7a598bd481003a7e92170433cfd1b1e03604ef9))


### ♻️　Chores

* 大範圍更新依賴版本並優化腳本執行與路徑解析 ([221eb35](https://github.com/bluelovers/ws-yarn-workspaces/commit/221eb352b31a00d5ffea5e2c8323b50863508f2c))



## [2.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.8...@yarn-tool/ncu-ws@2.0.9) (2026-03-09)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [2.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.7...@yarn-tool/ncu-ws@2.0.8) (2026-03-09)



### ♻️　Chores

* **deps:** 更新 workspace 依賴版本並新增 CI 安裝腳本 ([fbb5b0b](https://github.com/bluelovers/ws-yarn-workspaces/commit/fbb5b0b32cab8cdd34c1f5b5f9a6f8c54213e738))
* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))



## [2.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.6...@yarn-tool/ncu-ws@2.0.7) (2026-03-04)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [2.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.5...@yarn-tool/ncu-ws@2.0.6) (2026-03-02)


### BREAKING CHANGES

* **release:** 核心工具鏈套件升級
- @lazy-node/semver-simple-parse v4.0.0
- @yarn-tool/require-resolve v4.0.0
- @yarn-tool/resolve-package v3.0.0
- @yarn-tool/get-pkg-bin v3.0.0
- @yarn-tool/check-pkg-bin v4.0.0

更新所有工作區套件以使用相容的主要版本，並重構
npm-package-arg-util 以抽離 _parsePackageNameCore 核心函式。



### 📚　Documentation

* **ncu:** 新增 NCU 工具模組文件並增強 JSDoc 註解 ([6a7132f](https://github.com/bluelovers/ws-yarn-workspaces/commit/6a7132f1b1fa0ba801b2939675b584270e042cee))
* **ncu-ws,ncu:** 新增完整雙語文件與 JSDoc 註解 ([757f84e](https://github.com/bluelovers/ws-yarn-workspaces/commit/757f84e63303800cd37e933398d695f0a9f3ec4a))


### 🛠　Build System

* update build ([94c3a8e](https://github.com/bluelovers/ws-yarn-workspaces/commit/94c3a8e57b115ac238c3022d95595fbc53931235))
* **ncu:** add JSDoc documentation for ncu packages ([02b2220](https://github.com/bluelovers/ws-yarn-workspaces/commit/02b22204eea616853507a6ad06118aa73f6c4a9b))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* update README installation commands and add JSDoc comments ([2caaee5](https://github.com/bluelovers/ws-yarn-workspaces/commit/2caaee5185b452ec82768faacc27422aec8104b1))
* remove empty resolutions and redundant packageManager fields ([65b5c5f](https://github.com/bluelovers/ws-yarn-workspaces/commit/65b5c5f929aae82474408b2b46cfc5a471c919f6))
* add __root.ts test utility to workspace packages ([a771727](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7717278883c86d9ed8ab89f42070d3385c173a7))
* **deps:** 更新依賴版本並將腳本執行從 yarn 遷移至 node --run ([389e581](https://github.com/bluelovers/ws-yarn-workspaces/commit/389e581a07cf803dc34c8402b4d3f69af0016b8c))
* **deps:** 升級多項依賴套件版本 ([1382602](https://github.com/bluelovers/ws-yarn-workspaces/commit/1382602ca94ff236b251fd1481b6332468de4621))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))



## [2.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.4...@yarn-tool/ncu-ws@2.0.5) (2025-09-11)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [2.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.3...@yarn-tool/ncu-ws@2.0.4) (2025-09-07)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [2.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.2...@yarn-tool/ncu-ws@2.0.3) (2024-05-03)



### 🛠　Build System

* update typescript ([ffa656a](https://github.com/bluelovers/ws-yarn-workspaces/commit/ffa656aefe53966db445d52234eb0efe4651e3dd))



## [2.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.1...@yarn-tool/ncu-ws@2.0.2) (2024-03-01)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [2.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@2.0.0...@yarn-tool/ncu-ws@2.0.1) (2024-02-28)



### 📌　Dependencies

* update deps ([d48c90a](https://github.com/bluelovers/ws-yarn-workspaces/commit/d48c90a1f35e626fb9a4dcbb7bad5c5e1164dce1))



# [2.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.29...@yarn-tool/ncu-ws@2.0.0) (2023-10-10)



### 📌　Dependencies

* update deps ([8db6bc0](https://github.com/bluelovers/ws-yarn-workspaces/commit/8db6bc0189457346924022f9c38f4ae8162c5a5e))


### 🔖　Miscellaneous

* . ([9ee4591](https://github.com/bluelovers/ws-yarn-workspaces/commit/9ee4591c538a82f5890bc8e688354440f2b48a63))



## [1.0.29](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.28...@yarn-tool/ncu-ws@1.0.29) (2023-01-24)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.28](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.27...@yarn-tool/ncu-ws@1.0.28) (2022-12-09)



### 📌　Dependencies

* update deps ([fe41874](https://github.com/bluelovers/ws-yarn-workspaces/commit/fe41874d6fd01f5f2b773aa085b80ee2d0683edc))



## [1.0.27](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.26...@yarn-tool/ncu-ws@1.0.27) (2022-11-14)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.26](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.25...@yarn-tool/ncu-ws@1.0.26) (2022-11-04)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.25](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.24...@yarn-tool/ncu-ws@1.0.25) (2022-10-28)



### 📌　Dependencies

* update deps ([00de9bf](https://github.com/bluelovers/ws-yarn-workspaces/commit/00de9bf62a49f5de21e60c6a120fc4d3e6e058e3))


### 🔖　Miscellaneous

* . ([7f92ce5](https://github.com/bluelovers/ws-yarn-workspaces/commit/7f92ce51ae10641c0714d1413d1f4a0fb5b8688e))
* . ([6eaff42](https://github.com/bluelovers/ws-yarn-workspaces/commit/6eaff42a32ef2237b770c48ccc42576a4f9934ee))



## [1.0.24](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.23...@yarn-tool/ncu-ws@1.0.24) (2022-10-01)



### 🔖　Miscellaneous

* . ([777d61a](https://github.com/bluelovers/ws-yarn-workspaces/commit/777d61af255146b2b1b1f364587c36a0f5bfc00c))



## [1.0.23](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.22...@yarn-tool/ncu-ws@1.0.23) (2022-09-29)



### 🔖　Miscellaneous

* . ([6035e23](https://github.com/bluelovers/ws-yarn-workspaces/commit/6035e2399f4f5a5f5e5ac56309b6dc37ffe91389))



## [1.0.22](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.21...@yarn-tool/ncu-ws@1.0.22) (2022-09-28)



### 📌　Dependencies

* update deps ([1d6bcad](https://github.com/bluelovers/ws-yarn-workspaces/commit/1d6bcad8d8cf45daeab2360144383208b2ea6b9d))



## [1.0.21](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.20...@yarn-tool/ncu-ws@1.0.21) (2022-09-27)



### 🔖　Miscellaneous

* . ([5a4bc19](https://github.com/bluelovers/ws-yarn-workspaces/commit/5a4bc19a0a279a49e752d776279165e14c402427))



## [1.0.20](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.19...@yarn-tool/ncu-ws@1.0.20) (2022-09-27)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.19](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.18...@yarn-tool/ncu-ws@1.0.19) (2022-09-22)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.18](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.17...@yarn-tool/ncu-ws@1.0.18) (2022-09-12)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.17](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.16...@yarn-tool/ncu-ws@1.0.17) (2022-09-10)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.16](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.15...@yarn-tool/ncu-ws@1.0.16) (2022-09-06)



### 📚　Documentation

* add directory ([442a552](https://github.com/bluelovers/ws-yarn-workspaces/commit/442a55232619f7fe2b9bad6f8eccfffc4f8f47d2))


### 🔖　Miscellaneous

* . ([3a7fdc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/3a7fdc924ada93b1d0ac0160f8d77e46ff060588))



## [1.0.15](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.14...@yarn-tool/ncu-ws@1.0.15) (2022-08-28)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.14](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.13...@yarn-tool/ncu-ws@1.0.14) (2022-08-26)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.13](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.12...@yarn-tool/ncu-ws@1.0.13) (2022-08-26)



### 🔖　Miscellaneous

* . ([157d5dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/157d5dc8959261d9326f6e633987182898ae9670))



## [1.0.12](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.11...@yarn-tool/ncu-ws@1.0.12) (2022-08-25)



### 📌　Dependencies

* update deps ([836ee56](https://github.com/bluelovers/ws-yarn-workspaces/commit/836ee56d294d3b6c85ad1f8b209660c779480a80))



## [1.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.10...@yarn-tool/ncu-ws@1.0.11) (2022-08-19)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.9...@yarn-tool/ncu-ws@1.0.10) (2022-08-19)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.8...@yarn-tool/ncu-ws@1.0.9) (2022-08-18)


### ♻️　Chores

* **ncu:** add report totalTime ([f73afe7](https://github.com/bluelovers/ws-yarn-workspaces/commit/f73afe7c3c646c508ef0b5c758da9009766f0159))


### 🔖　Miscellaneous

* . ([93fa19a](https://github.com/bluelovers/ws-yarn-workspaces/commit/93fa19ad510eb723c87dcedb4f259b203087a00c))





## [1.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.7...@yarn-tool/ncu-ws@1.0.8) (2022-08-15)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.6...@yarn-tool/ncu-ws@1.0.7) (2022-08-15)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.5...@yarn-tool/ncu-ws@1.0.6) (2022-08-13)

**Note:** Version bump only for package @yarn-tool/ncu-ws





## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.4...@yarn-tool/ncu-ws@1.0.5) (2022-08-13)


### 📦　Code Refactoring

* update import ([7aa52ac](https://github.com/bluelovers/ws-yarn-workspaces/commit/7aa52ac972f176fd2505df5dac26caa6d8d3ee3e))
* **types:** update import and remove useless type ([4a73f1e](https://github.com/bluelovers/ws-yarn-workspaces/commit/4a73f1e7b06c16081717a14350af9ab91c3e3c87))


### 🚨　Tests

* update jest.config.js and deps ([d1d501b](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1d501ba059130bd8f90e6eaa266084110698011))


### 🛠　Build System

* update typescript ([b69b593](https://github.com/bluelovers/ws-yarn-workspaces/commit/b69b593d511d9d4e246513dc1d69721150b9cfe8))


### 📌　Dependencies

* update deps ([58501f9](https://github.com/bluelovers/ws-yarn-workspaces/commit/58501f97494eb624779dffea7ac9d68e45e5e978))
* update deps ([c968045](https://github.com/bluelovers/ws-yarn-workspaces/commit/c96804598f63a5cd06507e3eaaa2e8b569b14b65))
* update deps ([a0b8755](https://github.com/bluelovers/ws-yarn-workspaces/commit/a0b875582efdc9829b0cdb6c9c819cace8b76e90))


### BREAKING CHANGES

* update import





## [1.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.3...@yarn-tool/ncu-ws@1.0.4) (2022-07-31)


### 🚨　Tests

* **preset:** use `@bluelovers/jest-config` ([e239ecf](https://github.com/bluelovers/ws-yarn-workspaces/commit/e239ecf606d82930c6036ec1241bf3b4a1095423))


### 📌　Dependencies

* update deps ([138af6b](https://github.com/bluelovers/ws-yarn-workspaces/commit/138af6b1e69373e04539badb61127172d9938e55))





## [1.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.2...@yarn-tool/ncu-ws@1.0.3) (2022-07-29)


### 🐛　Bug Fixes

* remove log ([543e340](https://github.com/bluelovers/ws-yarn-workspaces/commit/543e34089e09aa088c4d41d56448e13a485c149d))





## [1.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/ncu-ws@1.0.1...@yarn-tool/ncu-ws@1.0.2) (2022-07-29)


### ✨　Features

* add cli options ([8e4d528](https://github.com/bluelovers/ws-yarn-workspaces/commit/8e4d528c3975400902929144ea5142598d1a1d1c))





## 1.0.1 (2022-07-29)


### ✨　Features

* update log style ([9bba1a9](https://github.com/bluelovers/ws-yarn-workspaces/commit/9bba1a907c918475dfeb182060e903e1a8afbf64))


### 🔖　Miscellaneous

* @yarn-tool/ncu-ws ([6fcb99b](https://github.com/bluelovers/ws-yarn-workspaces/commit/6fcb99b548486e6f2b4037106d7ae5590c90389b))
