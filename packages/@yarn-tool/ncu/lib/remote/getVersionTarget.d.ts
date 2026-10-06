/**
 * 版本解析策略判斷 (Version strategy detection)
 * 說明：同一個「想要哪種新版本」的需求在 CLI 上有三種表達方式
 * （`--semverLevel`、`--newest`、`--greatest`），此模組把它們統一解析成單一
 * `versionTarget`，供後續查詢流程使用。
 * Why: the same intent ("which new version do I want") can be expressed three ways
 * on the CLI (`--semverLevel`, `--newest`, `--greatest`); this module collapses
 * them into a single `versionTarget` for the query flow.
 *
 * @module remote/getVersionTarget
 */
import { IOptionsNpmCheckUpdates } from '../types';
/**
 * 由 CLI 選項推導版本策略 (Derive the strategy from CLI options)
 * 優先序：`semverLevel` > `newest` > `greatest` > `latest`。
 * `semverLevel` 最優先，因為它是使用者最明確的限制（指定 major / minor 範圍）。
 * Priority: `semverLevel` > `newest` > `greatest` > `latest`. `semverLevel` wins
 * because it is the most explicit constraint (an explicit major/minor range).
 *
 * @param options - ncu 選項 / ncu options
 */
export declare function _getVersionTarget(options: Partial<IOptionsNpmCheckUpdates>): IOptionsNpmCheckUpdates['versionTarget'];
/**
 * 解析版本策略，同時接受三種輸入 (Accepts three input shapes)
 * - 字串：已解析過的策略，直接回傳（避免重複解析）
 * - 帶 `versionTarget` 的選項：尊重呼叫端的明確指定
 * - 其他選項：退回 {@link _getVersionTarget} 由旗標推導
 * - string: an already resolved strategy, returned as-is (no re-derivation)
 * - options carrying `versionTarget`: the caller's explicit choice is respected
 * - other options: fall back to {@link _getVersionTarget}
 *
 * 邊界情況：`versionTarget` 為空字串時會被視為「未指定」而繼續往下推導，
 * 因為空字串不是合法的查詢方法名稱。
 * Edge case: an empty-string `versionTarget` is treated as "not set" and falls
 * through to derivation, since `''` is not a valid query method name.
 *
 * @param options - 選項物件、策略字串 / Options object or a strategy string
 */
export declare function getVersionTarget(options: Partial<IOptionsNpmCheckUpdates> | string | IOptionsNpmCheckUpdates['versionTarget']): IOptionsNpmCheckUpdates['versionTarget'];
