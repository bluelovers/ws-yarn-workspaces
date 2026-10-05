/**
 * 套件進入點 (Entrypoint)：彙整並重新導出 lockfile 更新與報告列印相關的 API。
 *
 * Package entry point: aggregates and re-exports the lockfile updating and
 * report printing APIs.
 */
import { updateYarnLockTag } from './lib/updateYarnLockTag';
import { printReport } from './lib/printReport';

/**
 * 具名匯出 (Named export) 核心更新函式，方便只需要單一功能的使用情境。
 *
 * Named export of the core update function for consumers that only need
 * this single feature.
 */
export { updateYarnLockTag }

/**
 * 具名匯出報告列印函式，與 updateYarnLockTag 搭配顯示更新結果。
 *
 * Named export of the report printer, meant to be used together with
 * updateYarnLockTag to display the update result.
 */
export { printReport }

/**
 * 預設導出 (Default export) 指向 updateYarnLockTag，
 * 讓 `import updateYarnLockTag from '@yarn-tool/yarnlock-ncu'` 成為最短的使用方式。
 *
 * The default export points to updateYarnLockTag so the shortest import form
 * remains the primary usage.
 */
export default updateYarnLockTag
