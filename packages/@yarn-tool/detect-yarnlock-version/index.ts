
/**
 * 套件進入點 (Entrypoint)：重新導出各類 yarn.lock 格式偵測函式。
 *
 * Package entry point: re-exports the various yarn.lock format detection
 * helpers.
 */
export * from './lib/detectYarnLockVersion';
export * from './lib/detectYarnLockVersionByFile';
export { detectYarnLockVersionByObject } from './lib/detectYarnLockVersionByObject';
export { detectYarnLockVersionByParsed } from './lib/detectYarnLockVersionByParsed';

import { detectYarnLockVersion } from './lib/detectYarnLockVersion';

/**
 * 預設匯出 (Default export) 指向最常用的內容偵測函式，
 * 讓 `import detectYarnLockVersion from ...` 成為最短的使用方式。
 *
 * The default export points to the most commonly used content-based detector,
 * so the shortest import form remains the primary usage.
 */
export default detectYarnLockVersion
