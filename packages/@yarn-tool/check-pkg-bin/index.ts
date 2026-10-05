import { checkPkgDir } from './lib/pkg';

export * from './lib/core';
export * from './lib/ws';
export * from './lib/pkg';

/**
 * 預設匯出單一套件檢查入口，
 * 讓使用者可直接以 `import checkPkgDir from '@yarn-tool/check-pkg-bin'` 使用，
 * 與 CLI 的單套件模式行為一致（Why：降低只做單套件檢查時的匯入成本）。
 *
 * Default export of the single-package check entry, so consumers can use
 * `import checkPkgDir from '@yarn-tool/check-pkg-bin'` directly, matching the
 * CLI's single-package mode (Why: lower the import cost for the common case).
 */
export default checkPkgDir
