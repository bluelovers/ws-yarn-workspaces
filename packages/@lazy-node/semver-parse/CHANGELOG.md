# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@4.0.7...@lazy-node/semver-simple-parse@4.0.8) (2026-09-06)



### 🚨　Tests

* **tests:** 新增與更新多個套件的單元測試快照 ([11628a4](https://github.com/bluelovers/ws-yarn-workspaces/commit/11628a47aa48be30829cf615a52d7b2b1b273d43))


### 🛠　Build System

* update Static Files ([b2f5d72](https://github.com/bluelovers/ws-yarn-workspaces/commit/b2f5d7216773c53eb35f267ba34f8788543d46a1))


### ♻️　Chores

* **workspace:** 將所有套件的指令從 yarn 改為 pnpm 並更新依賴版本 ([0505892](https://github.com/bluelovers/ws-yarn-workspaces/commit/0505892e5e7c356f8cf59495fefda1aa681499c6))


### 🔖　Miscellaneous

* . ([b545589](https://github.com/bluelovers/ws-yarn-workspaces/commit/b54558925d67304019e2b4f9bb3c4671c429a96e))



## [4.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@4.0.6...@lazy-node/semver-simple-parse@4.0.7) (2026-04-26)



### 📚　Documentation

* update deps ([fd5a55c](https://github.com/bluelovers/ws-yarn-workspaces/commit/fd5a55cfd5668cbc6275d44f360b0aeb9bfbf42d))



## [4.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@4.0.5...@lazy-node/semver-simple-parse@4.0.6) (2026-04-26)



### ♻️　Chores

* 大範圍更新依賴版本並優化腳本執行與路徑解析 ([221eb35](https://github.com/bluelovers/ws-yarn-workspaces/commit/221eb352b31a00d5ffea5e2c8323b50863508f2c))



## [4.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@4.0.4...@lazy-node/semver-simple-parse@4.0.5) (2026-03-09)

**Note:** Version bump only for package @lazy-node/semver-simple-parse





## [4.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@4.0.1...@lazy-node/semver-simple-parse@4.0.4) (2026-03-09)



### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))


### 🔖　Miscellaneous

* . ([385c013](https://github.com/bluelovers/ws-yarn-workspaces/commit/385c0135c0ed714ef3d1daf053a0072fc1433f47))
* . ([cae7515](https://github.com/bluelovers/ws-yarn-workspaces/commit/cae7515d4a8befe93ca0baee8f6aeb9ae7cbad79))



## [4.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@4.0.1...@lazy-node/semver-simple-parse@4.0.3) (2026-03-09)



### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))


### 🔖　Miscellaneous

* . ([cae7515](https://github.com/bluelovers/ws-yarn-workspaces/commit/cae7515d4a8befe93ca0baee8f6aeb9ae7cbad79))



## [4.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@4.0.1...@lazy-node/semver-simple-parse@4.0.2) (2026-03-08)



### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))
* **deps:** 更新 monorepo 依賴版本 ([e44dff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/e44dff29d5d6b7eb7c77acb8414e73f70feff649))



## [4.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@3.0.1...@lazy-node/semver-simple-parse@4.0.1) (2026-03-02)


### BREAKING CHANGES

* **release:** 核心工具鏈套件升級
- @lazy-node/semver-simple-parse v4.0.0
- @yarn-tool/require-resolve v4.0.0
- @yarn-tool/resolve-package v3.0.0
- @yarn-tool/get-pkg-bin v3.0.0
- @yarn-tool/check-pkg-bin v4.0.0

更新所有工作區套件以使用相容的主要版本，並重構
npm-package-arg-util 以抽離 _parsePackageNameCore 核心函式。
* **semver-parse:** 新增萬用字元版本解析支援
* **semver-parse:** 重構類型系統並新增完整測試案例



### 🐛　Bug Fixes

* **semver:** 修正 mergeSimpleSemVer 行為限制與檢查函數錯誤 ([3e99a1d](https://github.com/bluelovers/ws-yarn-workspaces/commit/3e99a1dcf3fcd54943067b58eb0c711217d3b168))


### ✨　Features

* **npm-package-arg-util:** 新增空值與特殊輸入檢測功能 ([c5e9acc](https://github.com/bluelovers/ws-yarn-workspaces/commit/c5e9acccc49e1c544f8e5aefa1532a35f5e99a9d))
* **semver:** 新增 stringifySimpleSemVer 選項控制輸出內容 ([1cbf9f5](https://github.com/bluelovers/ws-yarn-workspaces/commit/1cbf9f5cdcda51817539a0d71800a4ac5c170ff1))
* **semver-parse:** 新增萬用字元類型檢測功能 ([6cead8d](https://github.com/bluelovers/ws-yarn-workspaces/commit/6cead8dd31e2bee7eec4f107086c2892af9c9c30))


### 📦　Code Refactoring

* **semver-parse:** 新增萬用字元版本解析支援 ([0d324d7](https://github.com/bluelovers/ws-yarn-workspaces/commit/0d324d79d9ba344d14e8bb5a410f72ad47c9f89d))
* **semver-parse:** 重構類型系統並新增完整測試案例 ([099bcee](https://github.com/bluelovers/ws-yarn-workspaces/commit/099bceeb66971c07ddeb6fd15648170eb926095d))


### 📚　Documentation

* **semver:** 新增 semver-* 套件完整文件與測試案例 ([a89a944](https://github.com/bluelovers/ws-yarn-workspaces/commit/a89a944880ce53ac0678351df4b6744a5feb0b08))


### 🚨　Tests

* 修正測試斷言並完善測試工具文檔 ([8abcb1f](https://github.com/bluelovers/ws-yarn-workspaces/commit/8abcb1f23b0e4fa99ae957bad13a09136ef3bad0))
* **semver-parse:** 新增多種版本格式測試案例與型別斷言 ([158c518](https://github.com/bluelovers/ws-yarn-workspaces/commit/158c518cff1b78bddee6637cf32eb55682a09578))
* **semver-parse:** 新增測試快照檔案 ([6991e85](https://github.com/bluelovers/ws-yarn-workspaces/commit/6991e8545b9e3c3b880d29d13c3496b97c64365e))
* **semver-parse:** 新增 OR 運算符萬用字元測試並重構測試輔助函數 ([73b30d0](https://github.com/bluelovers/ws-yarn-workspaces/commit/73b30d0c389f182ffd25a8cc71e1745af1f97f89))
* **semver-parse:** 新增無效版本與萬用字元測試案例 ([1432052](https://github.com/bluelovers/ws-yarn-workspaces/commit/1432052013ebc8ec60559696742106568e1fba77))


### 🛠　Build System

* Introduce new utility packages for semantic versioning and Yarn tooling, and add CI/CD workflows. ([905a979](https://github.com/bluelovers/ws-yarn-workspaces/commit/905a9795333addd0fe802cad8068d5c5b414a992))
* **semver-parse,npm-package-arg-util:** 支援部分版本並新增輸入檢測功能 ([e824769](https://github.com/bluelovers/ws-yarn-workspaces/commit/e8247696151c6ffcd146eacdb46be0ee721ebefd))


### ♻️　Chores

* Add test config and global types for tsdx ([88a8df6](https://github.com/bluelovers/ws-yarn-workspaces/commit/88a8df6eef5dc59d9e0d9268b21706dceb5ab2a1))
* 更新 Jest 快照連結並增強類型定義與文件 ([b663b97](https://github.com/bluelovers/ws-yarn-workspaces/commit/b663b97d78d223dc8b3927ea2433938350144de7))
* add __root.ts test utility to workspace packages ([a771727](https://github.com/bluelovers/ws-yarn-workspaces/commit/a7717278883c86d9ed8ab89f42070d3385c173a7))


### 📌　Dependencies

* **release:** 主要版本升級與跨套件相依更新 ([2a24889](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a248893f3667704d1ba0de12544091abf5d341e))



## [3.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@3.0.0...@lazy-node/semver-simple-parse@3.0.1) (2024-05-03)



### 🛠　Build System

* update typescript ([ffa656a](https://github.com/bluelovers/ws-yarn-workspaces/commit/ffa656aefe53966db445d52234eb0efe4651e3dd))



# [3.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.9...@lazy-node/semver-simple-parse@3.0.0) (2023-10-10)



### 📌　Dependencies

* update deps ([8db6bc0](https://github.com/bluelovers/ws-yarn-workspaces/commit/8db6bc0189457346924022f9c38f4ae8162c5a5e))



## [2.0.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.8...@lazy-node/semver-simple-parse@2.0.9) (2022-11-14)



### 📌　Dependencies

* update deps ([faff44f](https://github.com/bluelovers/ws-yarn-workspaces/commit/faff44f1f5ad5066c747ea8d5d66fa10049c17fe))



## [2.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.7...@lazy-node/semver-simple-parse@2.0.8) (2022-10-28)



### 📌　Dependencies

* update deps ([00de9bf](https://github.com/bluelovers/ws-yarn-workspaces/commit/00de9bf62a49f5de21e60c6a120fc4d3e6e058e3))



## [2.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.6...@lazy-node/semver-simple-parse@2.0.7) (2022-10-01)



### 🔖　Miscellaneous

* . ([777d61a](https://github.com/bluelovers/ws-yarn-workspaces/commit/777d61af255146b2b1b1f364587c36a0f5bfc00c))



## [2.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.5...@lazy-node/semver-simple-parse@2.0.6) (2022-09-29)



### 🔖　Miscellaneous

* . ([6035e23](https://github.com/bluelovers/ws-yarn-workspaces/commit/6035e2399f4f5a5f5e5ac56309b6dc37ffe91389))



## [2.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.4...@lazy-node/semver-simple-parse@2.0.5) (2022-09-27)



### 🔖　Miscellaneous

* . ([5a4bc19](https://github.com/bluelovers/ws-yarn-workspaces/commit/5a4bc19a0a279a49e752d776279165e14c402427))



## [2.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.3...@lazy-node/semver-simple-parse@2.0.4) (2022-09-06)



### 📚　Documentation

* add directory ([442a552](https://github.com/bluelovers/ws-yarn-workspaces/commit/442a55232619f7fe2b9bad6f8eccfffc4f8f47d2))


### 🔖　Miscellaneous

* . ([3a7fdc9](https://github.com/bluelovers/ws-yarn-workspaces/commit/3a7fdc924ada93b1d0ac0160f8d77e46ff060588))



## [2.0.3](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.2...@lazy-node/semver-simple-parse@2.0.3) (2022-08-26)



### 🚨　Tests

* **snapshot:** snapshots updated ([50bff7c](https://github.com/bluelovers/ws-yarn-workspaces/commit/50bff7c13e1b01eb551c9b2252cfe3d971da8db8))


### 🔖　Miscellaneous

* . ([157d5dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/157d5dc8959261d9326f6e633987182898ae9670))



## [2.0.2](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.1...@lazy-node/semver-simple-parse@2.0.2) (2022-08-13)


### 🚨　Tests

* update jest.config.js and deps ([d1d501b](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1d501ba059130bd8f90e6eaa266084110698011))


### 🛠　Build System

* update typescript ([b69b593](https://github.com/bluelovers/ws-yarn-workspaces/commit/b69b593d511d9d4e246513dc1d69721150b9cfe8))


### 📌　Dependencies

* update deps ([58501f9](https://github.com/bluelovers/ws-yarn-workspaces/commit/58501f97494eb624779dffea7ac9d68e45e5e978))
* update deps ([a0b8755](https://github.com/bluelovers/ws-yarn-workspaces/commit/a0b875582efdc9829b0cdb6c9c819cace8b76e90))





## [2.0.1](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@2.0.0...@lazy-node/semver-simple-parse@2.0.1) (2022-07-31)


### 🚨　Tests

* **preset:** use `@bluelovers/jest-config` ([e239ecf](https://github.com/bluelovers/ws-yarn-workspaces/commit/e239ecf606d82930c6036ec1241bf3b4a1095423))





# [2.0.0](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.33...@lazy-node/semver-simple-parse@2.0.0) (2022-07-07)


### ✨　Features

* add `replaceSimpleSemVerVersion` ([4a143dc](https://github.com/bluelovers/ws-yarn-workspaces/commit/4a143dc5fa13658e424989362cfa197ea520f4d9))





## [1.1.33](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.32...@lazy-node/semver-simple-parse@1.1.33) (2022-05-11)


### ♻️　Chores

* update deps ([6f226ac](https://github.com/bluelovers/ws-yarn-workspaces/commit/6f226acfd22f0b213eaa8a84886f8391284b1fcf))





## [1.1.32](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.31...@lazy-node/semver-simple-parse@1.1.32) (2022-03-14)


### 🔖　Miscellaneous

* . ([7e31733](https://github.com/bluelovers/ws-yarn-workspaces/commit/7e31733febde1a879ded2feba01ff679874c4b4b))





## [1.1.31](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.29...@lazy-node/semver-simple-parse@1.1.31) (2022-02-27)


### ♻️　Chores

* **deps:** update deps ([109c9d1](https://github.com/bluelovers/ws-yarn-workspaces/commit/109c9d1b437063d069a9aaf5f5b9b15da4d5c76f))





## [1.1.30](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.29...@lazy-node/semver-simple-parse@1.1.30) (2022-02-27)


### ♻️　Chores

* **deps:** update deps ([109c9d1](https://github.com/bluelovers/ws-yarn-workspaces/commit/109c9d1b437063d069a9aaf5f5b9b15da4d5c76f))





## [1.1.29](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.28...@lazy-node/semver-simple-parse@1.1.29) (2022-02-05)


### 💎　Styles

* **typescript:** 固定 type 順序 來防止 typescript 隨機排序 ([abacff2](https://github.com/bluelovers/ws-yarn-workspaces/commit/abacff2c40456b9306c2e00680544a32a83e94a1))





## [1.1.28](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.27...@lazy-node/semver-simple-parse@1.1.28) (2022-02-01)


### 🔖　Miscellaneous

* . ([c3a1167](https://github.com/bluelovers/ws-yarn-workspaces/commit/c3a116723a031e4b8ed68e659d7643e418f4ba37))





## [1.1.27](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.26...@lazy-node/semver-simple-parse@1.1.27) (2022-01-25)

**Note:** Version bump only for package @lazy-node/semver-simple-parse





## [1.1.26](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.25...@lazy-node/semver-simple-parse@1.1.26) (2022-01-13)

**Note:** Version bump only for package @lazy-node/semver-simple-parse





## [1.1.25](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.24...@lazy-node/semver-simple-parse@1.1.25) (2021-12-16)


### 🔖　Miscellaneous

* . ([104475f](https://github.com/bluelovers/ws-yarn-workspaces/commit/104475f2baa62e53dcc4cd6f3fb3a425cba1c88d))





## [1.1.24](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.23...@lazy-node/semver-simple-parse@1.1.24) (2021-12-06)


### 🔖　Miscellaneous

* . ([d1aaa65](https://github.com/bluelovers/ws-yarn-workspaces/commit/d1aaa651f6bfc65be3a9d92dc31dc91178df11ab))





## [1.1.23](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.22...@lazy-node/semver-simple-parse@1.1.23) (2021-12-06)


### ♻️　Chores

* **deps:** update deps ([02351cf](https://github.com/bluelovers/ws-yarn-workspaces/commit/02351cf589d90f6b32a7e2a1c33c75ddecf4c1ca))





## [1.1.22](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.21...@lazy-node/semver-simple-parse@1.1.22) (2021-12-06)


### ♻️　Chores

* **deps:** update deps ([0377f3d](https://github.com/bluelovers/ws-yarn-workspaces/commit/0377f3da359fd07fb6cfaa86accaefaef993036c))





## [1.1.21](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.20...@lazy-node/semver-simple-parse@1.1.21) (2021-11-30)


### 🔖　Miscellaneous

* . ([2a7ded9](https://github.com/bluelovers/ws-yarn-workspaces/commit/2a7ded9396cd8619f03c21e0e00f458575978913))





## [1.1.20](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.19...@lazy-node/semver-simple-parse@1.1.20) (2021-11-28)


### ♻️　Chores

* **deps:** update deps ([35d2bc5](https://github.com/bluelovers/ws-yarn-workspaces/commit/35d2bc557a8f73fd8638b073dedc189e5423c52e))





## [1.1.19](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.17...@lazy-node/semver-simple-parse@1.1.19) (2021-11-23)


### ♻️　Chores

* **deps:** update deps ([8d1f2fb](https://github.com/bluelovers/ws-yarn-workspaces/commit/8d1f2fbb2782cdcdcf72e56131ea047bc0c30298))


### 🔖　Miscellaneous

* . ([8a56e2f](https://github.com/bluelovers/ws-yarn-workspaces/commit/8a56e2fcef7e287e56f0a9de997a1dc473dbe188))





## [1.1.18](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.17...@lazy-node/semver-simple-parse@1.1.18) (2021-11-23)


### ♻️　Chores

* **deps:** update deps ([8d1f2fb](https://github.com/bluelovers/ws-yarn-workspaces/commit/8d1f2fbb2782cdcdcf72e56131ea047bc0c30298))





## [1.1.17](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.16...@lazy-node/semver-simple-parse@1.1.17) (2021-09-15)


### ♻️　Chores

* **deps:** update deps ([21fdb59](https://github.com/bluelovers/ws-yarn-workspaces/commit/21fdb59f6c45c6beee68cd77259664b308fc7a38))





## [1.1.16](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.15...@lazy-node/semver-simple-parse@1.1.16) (2021-08-13)


### ♻️　Chores

* **deps:** update deps ([cc53689](https://github.com/bluelovers/ws-yarn-workspaces/commit/cc53689dadd1334672807d4737c0e6400b15aba0))





## [1.1.15](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.14...@lazy-node/semver-simple-parse@1.1.15) (2021-07-23)


### ♻️　Chores

* update deps ([e4d3819](https://github.com/bluelovers/ws-yarn-workspaces/commit/e4d3819baeacc944ddb39e3218f247edb17f0eb0))





## [1.1.14](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.12...@lazy-node/semver-simple-parse@1.1.14) (2021-07-16)


### ✨　Features

* sort and update deps ([68b8088](https://github.com/bluelovers/ws-yarn-workspaces/commit/68b80888dade4eb368927afdd50066488014ecbd))


### 🔖　Miscellaneous

* . ([1ca3e67](https://github.com/bluelovers/ws-yarn-workspaces/commit/1ca3e671f12b47170bfdd2f38e9e515f3d63d961))





## [1.1.13](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.12...@lazy-node/semver-simple-parse@1.1.13) (2021-07-16)


### ✨　Features

* sort and update deps ([68b8088](https://github.com/bluelovers/ws-yarn-workspaces/commit/68b80888dade4eb368927afdd50066488014ecbd))





## [1.1.12](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.11...@lazy-node/semver-simple-parse@1.1.12) (2021-07-13)

**Note:** Version bump only for package @lazy-node/semver-simple-parse





## [1.1.11](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.10...@lazy-node/semver-simple-parse@1.1.11) (2021-07-11)


### ♻️　Chores

* **deps:** package-json <7 >=6.5 ([95d11aa](https://github.com/bluelovers/ws-yarn-workspaces/commit/95d11aa0c9ee3a87bfe6933fab0cc5816a4f117d))





## [1.1.10](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.8...@lazy-node/semver-simple-parse@1.1.10) (2021-07-11)


### 🛠　Build System

* use tslib ([a172f5b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a172f5b85b6b74256ebc8707435e0756adfd533a))


### 🔖　Miscellaneous

* . ([992892b](https://github.com/bluelovers/ws-yarn-workspaces/commit/992892bbf110cad2a8ee559521fc64506700e228))





## [1.1.9](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.8...@lazy-node/semver-simple-parse@1.1.9) (2021-07-11)


### 🛠　Build System

* use tslib ([a172f5b](https://github.com/bluelovers/ws-yarn-workspaces/commit/a172f5b85b6b74256ebc8707435e0756adfd533a))





## [1.1.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.7...@lazy-node/semver-simple-parse@1.1.8) (2021-06-21)


### ♻️　Chores

* **deps:** update deps ([32a3cff](https://github.com/bluelovers/ws-yarn-workspaces/commit/32a3cff85a28c9c7e26ab9e13860c025f9c32b1c))





## [1.1.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.6...@lazy-node/semver-simple-parse@1.1.7) (2020-09-04)


### ♻️　Chores

* **deps:** update deps ([34bfa51](https://github.com/bluelovers/ws-yarn-workspaces/commit/34bfa51ebe13e7d6b9289001c16cf3cfb33d477d))





## [1.1.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@lazy-node/semver-simple-parse@1.1.5...@lazy-node/semver-simple-parse@1.1.6) (2020-08-11)


### 🔖　Miscellaneous

* . ([79c241f](https://github.com/bluelovers/ws-yarn-workspaces/commit/79c241f5187e5012821aed31c8a726803af1334a))





## 1.1.5 (2020-08-11)


### 🐛　Bug Fixes

* update deps version wit follow current pattern ([d7e5115](https://github.com/bluelovers/ws-yarn-workspaces/commit/d7e51157238dd8f9602f8d66529ed9b5dfeb7fab))
* deps ([09880e3](https://github.com/bluelovers/ws-yarn-workspaces/commit/09880e3fd4b17262f072cb3c3b00a45154ee181c))
* stringify style ([5501de3](https://github.com/bluelovers/ws-yarn-workspaces/commit/5501de37279ea38632bc9bdd8783a29c9d45240b))


### ✨　Features

* add mergeSimpleSemVer ([a021922](https://github.com/bluelovers/ws-yarn-workspaces/commit/a021922a33731169ce370eb6d261239619397238))
* export * from './lib/checker'; ([1dcbad5](https://github.com/bluelovers/ws-yarn-workspaces/commit/1dcbad52eed20474c81789e8dc5eef0d6b2c118c))
* add asserts function ([0ac962f](https://github.com/bluelovers/ws-yarn-workspaces/commit/0ac962fa700e58a415f11c9dfee181a2644923d0))
* add stringifySemverFull ([229b381](https://github.com/bluelovers/ws-yarn-workspaces/commit/229b38173dd85cbcd696df14c270f5070eef5597))


### 📦　Code Refactoring

* update type ([521c2eb](https://github.com/bluelovers/ws-yarn-workspaces/commit/521c2eb57692cb3e7e6c7b1e1d35a12ce354c906))
* rename ([e52f300](https://github.com/bluelovers/ws-yarn-workspaces/commit/e52f300821b1862089bc536336ba70251a01ea68))
* code splitting ([5df72a8](https://github.com/bluelovers/ws-yarn-workspaces/commit/5df72a85cb849063529ca73aec593bdebe0945e9))
* part 3 ([3e1ad69](https://github.com/bluelovers/ws-yarn-workspaces/commit/3e1ad69d340499b272141fb7afc5be81f65f9b1d))
* part 2 ([4adc798](https://github.com/bluelovers/ws-yarn-workspaces/commit/4adc7985f7745e5df7983aedc3aead953115ba57))
* part 1 ([eb27cf7](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb27cf7ae031d6e08112f73fd895109b10b139f7))


### ♻️　Chores

* update pkg name ([11dfc2b](https://github.com/bluelovers/ws-yarn-workspaces/commit/11dfc2b972e51599a3f31900930bf4dbb9161990))


### 🔖　Miscellaneous

* . ([6ee19c3](https://github.com/bluelovers/ws-yarn-workspaces/commit/6ee19c305bd622ec08b7e32ae79b76d8551fe9e3))
* Add 'packages/@lazy-node/semver-parse/' from commit '2344adc3b2d6b5683e7823105aab6a9fd936a33c' ([f9a35d5](https://github.com/bluelovers/ws-yarn-workspaces/commit/f9a35d55b2537a6d41a50818b8631c24551c8b52))





## 1.1.4 (2020-08-11)


### 🐛　Bug Fixes

* update deps version wit follow current pattern ([d7e5115](https://github.com/bluelovers/ws-yarn-workspaces/commit/d7e51157238dd8f9602f8d66529ed9b5dfeb7fab))
* deps ([09880e3](https://github.com/bluelovers/ws-yarn-workspaces/commit/09880e3fd4b17262f072cb3c3b00a45154ee181c))
* stringify style ([5501de3](https://github.com/bluelovers/ws-yarn-workspaces/commit/5501de37279ea38632bc9bdd8783a29c9d45240b))


### ✨　Features

* add mergeSimpleSemVer ([a021922](https://github.com/bluelovers/ws-yarn-workspaces/commit/a021922a33731169ce370eb6d261239619397238))
* export * from './lib/checker'; ([1dcbad5](https://github.com/bluelovers/ws-yarn-workspaces/commit/1dcbad52eed20474c81789e8dc5eef0d6b2c118c))
* add asserts function ([0ac962f](https://github.com/bluelovers/ws-yarn-workspaces/commit/0ac962fa700e58a415f11c9dfee181a2644923d0))
* add stringifySemverFull ([229b381](https://github.com/bluelovers/ws-yarn-workspaces/commit/229b38173dd85cbcd696df14c270f5070eef5597))


### 📦　Code Refactoring

* update type ([521c2eb](https://github.com/bluelovers/ws-yarn-workspaces/commit/521c2eb57692cb3e7e6c7b1e1d35a12ce354c906))
* rename ([e52f300](https://github.com/bluelovers/ws-yarn-workspaces/commit/e52f300821b1862089bc536336ba70251a01ea68))
* code splitting ([5df72a8](https://github.com/bluelovers/ws-yarn-workspaces/commit/5df72a85cb849063529ca73aec593bdebe0945e9))
* part 3 ([3e1ad69](https://github.com/bluelovers/ws-yarn-workspaces/commit/3e1ad69d340499b272141fb7afc5be81f65f9b1d))
* part 2 ([4adc798](https://github.com/bluelovers/ws-yarn-workspaces/commit/4adc7985f7745e5df7983aedc3aead953115ba57))
* part 1 ([eb27cf7](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb27cf7ae031d6e08112f73fd895109b10b139f7))


### ♻️　Chores

* update pkg name ([11dfc2b](https://github.com/bluelovers/ws-yarn-workspaces/commit/11dfc2b972e51599a3f31900930bf4dbb9161990))


### 🔖　Miscellaneous

* Add 'packages/@lazy-node/semver-parse/' from commit '2344adc3b2d6b5683e7823105aab6a9fd936a33c' ([f9a35d5](https://github.com/bluelovers/ws-yarn-workspaces/commit/f9a35d55b2537a6d41a50818b8631c24551c8b52))
