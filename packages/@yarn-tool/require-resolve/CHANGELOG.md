# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@4.0.5...@yarn-tool/require-resolve@4.0.6) (2026-03-12)


### BREAKING CHANGES

* **require-resolve:** 移入 Symbol 驗證邏輯至 get-paths-by-type 模組並簡化路徑處理



### 📦　Code Refactoring

* **require-resolve:** 移入 Symbol 驗證邏輯至 get-paths-by-type 模組並簡化路徑處理 ([d966b27](https://github.com/bluelovers/ws-yarn-workspaces/commit/d966b27311b6470c84fecf1b1117296900b0583e))


### 📚　Documentation

* **path-parents:** 新增繁體中文/英文雙語文件說明 ([0561fbe](https://github.com/bluelovers/ws-yarn-workspaces/commit/0561fbe2955bfc2ba10ec00522f71b99bc1dff30))



## [4.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@4.0.4...@yarn-tool/require-resolve@4.0.5) (2026-03-09)

**Note:** Version bump only for package @yarn-tool/require-resolve





## [4.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@4.0.2...@yarn-tool/require-resolve@4.0.4) (2026-03-09)



### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))


### 🔖　Miscellaneous

* . ([cae7515](https://github.com/bluelovers/ws-yarn-workspaces/commit/cae7515d4a8befe93ca0baee8f6aeb9ae7cbad79))



## [4.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@4.0.2...@yarn-tool/require-resolve@4.0.3) (2026-03-08)



### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))



## [4.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@4.0.1...@yarn-tool/require-resolve@4.0.2) (2026-03-04)



### 🐛　Bug Fixes

* **require-resolve:** 正規化 pkgRoot 路徑輸出 ([5e9a4fd](https://github.com/bluelovers/ws-yarn-workspaces/commit/5e9a4fd394eacd11c52e5493e79b6af070b5f8d2))



## [4.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@3.0.2...@yarn-tool/require-resolve@4.0.1) (2026-03-02)


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

* **require-resolve:** 使用空值合併運算子簡化路徑初始化 ([f13e694](https://github.com/bluelovers/ws-yarn-workspaces/commit/f13e69432f4258a4c3f4204909776cd3332769f5))


### ✨　Features

* **yarn-tool:** 新增 package.json 排序欄位與測試 ([c9318d7](https://github.com/bluelovers/ws-yarn-workspaces/commit/c9318d70eba03f053147fadb61e440077785c155))


### 📦　Code Refactoring

* **require-resolve:** split into modular lib/ structure with enhanced resolution options ([c327a9a](https://github.com/bluelovers/ws-yarn-workspaces/commit/c327a9a9916f072a9121d9ec197e4fa754d99e6e))
* **require-resolve:** 重新命名介面以提高命名清晰度 ([3b8fbcc](https://github.com/bluelovers/ws-yarn-workspaces/commit/3b8fbccb58259f0a300750e91acc7c6d07cd7688))
* **resolve:** merge require-resolve resolve-package ([c96f4aa](https://github.com/bluelovers/ws-yarn-workspaces/commit/c96f4aa21c44aa3c931c6123c925c2fd551571bc))


### 📚　Documentation

* add bilingual documentation and JSDoc comments to multiple packages ([bb47d30](https://github.com/bluelovers/ws-yarn-workspaces/commit/bb47d309c3258006d5261e4d62c2f82c690d452a))


### 🚨　Tests

* **require-resolve:** use @bluelovers/tsdx with includeGlobal ([08736cf](https://github.com/bluelovers/ws-yarn-workspaces/commit/08736cfc75cad3c8aa116bd69153e32a58770e73))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* 更新 Jest 快照連結並增強類型定義與文件 ([b663b97](https://github.com/bluelovers/ws-yarn-workspaces/commit/b663b97d78d223dc8b3927ea2433938350144de7))
* add __root.ts test utility to workspace packages ([a771727](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7717278883c86d9ed8ab89f42070d3385c173a7))
* **deps:** 升級路徑與檔案系統相關依賴版本 ([78d395b](https://github.com/bluelovers/ws-yarn-workspaces/commit/78d395b5469feecc85f250ca2d8b4977161e7618))
* **deps:** 更新依賴版本並將腳本執行從 yarn 遷移至 node --run ([389e581](https://github.com/bluelovers/ws-yarn-workspaces/commit/389e581a07cf803dc34c8402b4d3f69af0016b8c))
* **deps:** 升級多項依賴套件版本 ([1382602](https://github.com/bluelovers/ws-yarn-workspaces/commit/1382602ca94ff236b251fd1481b6332468de4621))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))


### 🔖　Miscellaneous

* . ([d0a2adc](https://github.com/bluelovers/ws-yarn-workspaces/commit/d0a2adca7732fe14da2977d24e148f42b10bdd1c))



## [3.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@3.0.1...@yarn-tool/require-resolve@3.0.2) (2025-09-07)



### 🛠　Build System

* update build ([29d39a7](https://github.com/bluelovers/ws-yarn-workspaces/commit/29d39a7b06544a59a7624dfd4d2d33ed08c1b379))



## [3.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@3.0.0...@yarn-tool/require-resolve@3.0.1) (2024-05-03)



### 🛠　Build System

* update typescript ([ffa656a](https://github.com/bluelovers/ws-yarn-workspaces/commit/ffa656aefe53966db445d52234eb0efe4651e3dd))



# [3.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.11...@yarn-tool/require-resolve@3.0.0) (2023-10-10)



### 📌　Dependencies

* update deps ([8db6bc0](https://github.com/bluelovers/ws-yarn-workspaces/commit/8db6bc0189457346924022f9c38f4ae8162c5a5e))



## [2.0.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.10...@yarn-tool/require-resolve@2.0.11) (2022-12-09)



### 📌　Dependencies

* update deps ([fe41874](https://github.com/bluelovers/ws-yarn-workspaces/commit/fe41874d6fd01f5f2b773aa085b80ee2d0683edc))



## [2.0.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.9...@yarn-tool/require-resolve@2.0.10) (2022-11-14)



### 📌　Dependencies

* update deps ([faff44f](https://github.com/bluelovers/ws-yarn-workspaces/commit/faff44f1f5ad5066c747ea8d5d66fa10049c17fe))



## [2.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.8...@yarn-tool/require-resolve@2.0.9) (2022-10-28)



### 📌　Dependencies

* update deps ([dcd795b](https://github.com/bluelovers/ws-yarn-workspaces/commit/dcd795b251e73ffdbade2a4086f360241cb4cb03))



## [2.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.7...@yarn-tool/require-resolve@2.0.8) (2022-10-01)



### 🔖　Miscellaneous

* . ([777d61a](https://github.com/bluelovers/ws-yarn-workspaces/commit/777d61af255146b2b1b1f364587c36a0f5bfc00c))



## [2.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.6...@yarn-tool/require-resolve@2.0.7) (2022-09-29)



### 🔖　Miscellaneous

* . ([6035e23](https://github.com/bluelovers/ws-yarn-workspaces/commit/6035e2399f4f5a5f5e5ac56309b6dc37ffe91389))



## [2.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.5...@yarn-tool/require-resolve@2.0.6) (2022-09-27)



### 🔖　Miscellaneous

* . ([5a4bc19](https://github.com/bluelovers/ws-yarn-workspaces/commit/5a4bc19a0a279a49e752d776279165e14c402427))



## [2.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.4...@yarn-tool/require-resolve@2.0.5) (2022-09-27)



### 🐛　Bug Fixes

* resolve exports ([39a8f85](https://github.com/bluelovers/ws-yarn-workspaces/commit/39a8f85ad96679173723eaeb88c432e665fd83ea))



## [2.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.3...@yarn-tool/require-resolve@2.0.4) (2022-09-06)



### 📚　Documentation

* add directory ([442a552](https://github.com/bluelovers/ws-yarn-workspaces/commit/442a55232619f7fe2b9bad6f8eccfffc4f8f47d2))


### 🔖　Miscellaneous

* . ([3a7fdc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/3a7fdc924ada93b1d0ac0160f8d77e46ff060588))



## [2.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.2...@yarn-tool/require-resolve@2.0.3) (2022-08-26)



### 🚨　Tests

* **snapshot:** snapshots updated ([50bff7c](https://github.com/bluelovers/ws-yarn-workspaces/commit/50bff7c13e1b01eb551c9b2252cfe3d971da8db8))


### 🔖　Miscellaneous

* . ([157d5dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/157d5dc8959261d9326f6e633987182898ae9670))



## [2.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.1...@yarn-tool/require-resolve@2.0.2) (2022-08-13)


### 🚨　Tests

* update jest.config.js and deps ([d1d501b](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1d501ba059130bd8f90e6eaa266084110698011))


### 🛠　Build System

* update typescript ([b69b593](https://github.com/bluelovers/ws-yarn-workspaces/commit/b69b593d511d9d4e246513dc1d69721150b9cfe8))





## [2.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@2.0.0...@yarn-tool/require-resolve@2.0.1) (2022-07-31)


### 🚨　Tests

* **preset:** use `@bluelovers/jest-config` ([e239ecf](https://github.com/bluelovers/ws-yarn-workspaces/commit/e239ecf606d82930c6036ec1241bf3b4a1095423))





# [2.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.8...@yarn-tool/require-resolve@2.0.0) (2022-07-07)

**Note:** Version bump only for package @yarn-tool/require-resolve





## [1.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.7...@yarn-tool/require-resolve@1.0.8) (2022-05-11)


### ♻️　Chores

* update deps ([6f226ac](https://github.com/bluelovers/ws-yarn-workspaces/commit/6f226acfd22f0b213eaa8a84886f8391284b1fcf))





## [1.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.6...@yarn-tool/require-resolve@1.0.7) (2021-12-16)


### 🔖　Miscellaneous

* . ([104475f](https://github.com/bluelovers/ws-yarn-workspaces/commit/104475f2baa62e53dcc4cd6f3fb3a425cba1c88d))





## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.5...@yarn-tool/require-resolve@1.0.6) (2021-11-28)


### 📦　Code Refactoring

* update import remove `/index` ([8324cd8](https://github.com/bluelovers/ws-yarn-workspaces/commit/8324cd8cbbc9b63bf8659058659da9cff44e87be))





## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.4...@yarn-tool/require-resolve@1.0.5) (2021-10-13)


### 📦　Code Refactoring

* `@yarn-tool/get-paths-by-type` ([9596dbe](https://github.com/bluelovers/ws-yarn-workspaces/commit/9596dbe324ec66e2d7959a43e861e4b886a61e18))





## [1.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.3...@yarn-tool/require-resolve@1.0.4) (2021-08-13)


### ♻️　Chores

* **deps:** update deps ([cc53689](https://github.com/bluelovers/ws-yarn-workspaces/commit/cc53689dadd1334672807d4737c0e6400b15aba0))





## [1.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.1...@yarn-tool/require-resolve@1.0.3) (2021-07-11)


### 🛠　Build System

* use tslib ([a172f5b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a172f5b85b6b74256ebc8707435e0756adfd533a))


### 🔖　Miscellaneous

* . ([992892b](https://github.com/bluelovers/ws-yarn-workspaces/commit/992892bbf110cad2a8ee559521fc64506700e228))





## [1.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/require-resolve@1.0.1...@yarn-tool/require-resolve@1.0.2) (2021-07-11)


### 🛠　Build System

* use tslib ([a172f5b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a172f5b85b6b74256ebc8707435e0756adfd533a))





## 1.0.1 (2021-06-05)


### ✨　Features

* @yarn-tool/require-resolve ([232d8c8](https://github.com/bluelovers/ws-yarn-workspaces/commit/232d8c8f417812eaeb1fe72ad386544761294177))
