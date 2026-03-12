# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.8](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/detect-package-manager@1.0.6...@yarn-tool/detect-package-manager@1.0.8) (2026-03-12)


### BREAKING CHANGES

* **require-resolve:** 移入 Symbol 驗證邏輯至 get-paths-by-type 模組並簡化路徑處理



### 🐛　Bug Fixes

* **types:** typescript display different ordering ([8e132a4](https://github.com/bluelovers/ws-yarn-workspaces/commit/8e132a4f4807bb36bb7d0c2c405bd26ddefbe9cc))


### 📦　Code Refactoring

* **require-resolve:** 移入 Symbol 驗證邏輯至 get-paths-by-type 模組並簡化路徑處理 ([d966b27](https://github.com/bluelovers/ws-yarn-workspaces/commit/d966b27311b6470c84fecf1b1117296900b0583e))



## [1.0.7](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/detect-package-manager@1.0.6...@yarn-tool/detect-package-manager@1.0.7) (2026-03-12)



### 🐛　Bug Fixes

* **types:** typescript display different ordering ([8e132a4](https://github.com/bluelovers/ws-yarn-workspaces/commit/8e132a4f4807bb36bb7d0c2c405bd26ddefbe9cc))



## [1.0.6](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/detect-package-manager@1.0.5...@yarn-tool/detect-package-manager@1.0.6) (2026-03-10)


### BREAKING CHANGES

* **detect-package-manager:** 過濾 npmClients 陣列中的 null、undefined 和空值



### 🐛　Bug Fixes

* **detect-package-manager:** 過濾 npmClients 陣列中的 null、undefined 和空值 ([c19b988](https://github.com/bluelovers/ws-yarn-workspaces/commit/c19b988b4a1c06fd5e319d4655d9f64b77fd73df))



## [1.0.5](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/detect-package-manager@1.0.4...@yarn-tool/detect-package-manager@1.0.5) (2026-03-09)


### BREAKING CHANGES

* **detect-package-manager:** The second parameter now accepts boolean or IOptionsWhichPackageManager object instead of just boolean



### 📦　Code Refactoring

* **detect-package-manager:** add IOptionsWhichPackageManager interface and noUseDefaultClients option ([98a8ae4](https://github.com/bluelovers/ws-yarn-workspaces/commit/98a8ae4a4b9a6814064fc2cae8cf475f68b11469))


### ♻️　Chores

* **detect-package-manager:** 新增 `.nx` 到 .gitignore ([eddc452](https://github.com/bluelovers/ws-yarn-workspaces/commit/eddc452f1e047a79fa05baefeaede97c5df36741))



## [1.0.4](https://github.com/bluelovers/ws-yarn-workspaces/compare/@yarn-tool/detect-package-manager@1.0.3...@yarn-tool/detect-package-manager@1.0.4) (2026-03-09)

**Note:** Version bump only for package @yarn-tool/detect-package-manager





## 1.0.3 (2026-03-09)


### BREAKING CHANGES

* **detect-package-manager:** `whichPackageManagerAsync` 和 `whichPackageManagerSync` 回傳值格式改變，從字串改為元組 [名稱, 路徑?]



### 📦　Code Refactoring

* **detect-package-manager:** 新增生成器偵測函數與全面測試覆蓋 ([59a19e3](https://github.com/bluelovers/ws-yarn-workspaces/commit/59a19e352f4dea91886d9bb8df26ac36ef20f4a3))


### 🚨　Tests

* update test ([0bf7b3c](https://github.com/bluelovers/ws-yarn-workspaces/commit/0bf7b3ca5f565f33e5dfb7333921da916fe266a0))


### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))


### 🔖　Miscellaneous

* . ([385c013](https://github.com/bluelovers/ws-yarn-workspaces/commit/385c0135c0ed714ef3d1daf053a0072fc1433f47))
* . ([cae7515](https://github.com/bluelovers/ws-yarn-workspaces/commit/cae7515d4a8befe93ca0baee8f6aeb9ae7cbad79))
* **detect-package-manager:** 新增套件管理器偵測功能 ([9bbbe46](https://github.com/bluelovers/ws-yarn-workspaces/commit/9bbbe46709f8291e33aea60081546dfb549287f2))



## 1.0.2 (2026-03-09)


### BREAKING CHANGES

* **detect-package-manager:** `whichPackageManagerAsync` 和 `whichPackageManagerSync` 回傳值格式改變，從字串改為元組 [名稱, 路徑?]



### 📦　Code Refactoring

* **detect-package-manager:** 新增生成器偵測函數與全面測試覆蓋 ([59a19e3](https://github.com/bluelovers/ws-yarn-workspaces/commit/59a19e352f4dea91886d9bb8df26ac36ef20f4a3))


### 🚨　Tests

* update test ([0bf7b3c](https://github.com/bluelovers/ws-yarn-workspaces/commit/0bf7b3ca5f565f33e5dfb7333921da916fe266a0))


### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))


### 🔖　Miscellaneous

* . ([cae7515](https://github.com/bluelovers/ws-yarn-workspaces/commit/cae7515d4a8befe93ca0baee8f6aeb9ae7cbad79))
* **detect-package-manager:** 新增套件管理器偵測功能 ([9bbbe46](https://github.com/bluelovers/ws-yarn-workspaces/commit/9bbbe46709f8291e33aea60081546dfb549287f2))



## 1.0.1 (2026-03-08)


### BREAKING CHANGES

* **detect-package-manager:** `whichPackageManagerAsync` 和 `whichPackageManagerSync` 回傳值格式改變，從字串改為元組 [名稱, 路徑?]



### 📦　Code Refactoring

* **detect-package-manager:** 新增生成器偵測函數與全面測試覆蓋 ([59a19e3](https://github.com/bluelovers/ws-yarn-workspaces/commit/59a19e352f4dea91886d9bb8df26ac36ef20f4a3))


### 🚨　Tests

* update test ([0bf7b3c](https://github.com/bluelovers/ws-yarn-workspaces/commit/0bf7b3ca5f565f33e5dfb7333921da916fe266a0))


### ♻️　Chores

* **deps:** 更新 ts-type 和 @ts-type/package-dts 依賴版本 ([eb3e3db](https://github.com/bluelovers/ws-yarn-workspaces/commit/eb3e3dbe330398235ea99e64f3561db73d95b7fc))


### 🔖　Miscellaneous

* **detect-package-manager:** 新增套件管理器偵測功能 ([9bbbe46](https://github.com/bluelovers/ws-yarn-workspaces/commit/9bbbe46709f8291e33aea60081546dfb549287f2))
