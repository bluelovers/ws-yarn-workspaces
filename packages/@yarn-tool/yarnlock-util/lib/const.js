"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_REGEX = void 0;
/**
 * 當 `npa` 解析失敗時，用來從列鍵（Row Key）取出 `packageName` 等欄位的正規表示式。
 * Regular expression used to extract `packageName` and friends from a row key when `npa` fails.
 *
 * v1 的列鍵可能不是標準的 `name@range`（例如 `@scope/pkg@^1.0.0`、
 * 同名稱多範圍以逗號串接），npa 對這類輸入會回傳 `undefined`；
 * 此正則作為後備（Fallback）可避免整批解析因單一奇怪列而中斷。
 * A v1 row key is not always a plain `name@range` (scoped names, or several ranges for one
 * name joined by commas), and `npa` returns `undefined` for such input; this regex acts as a
 * fallback so one odd row does not abort the whole batch.
 *
 * 具名群組（Named Group）是刻意的：讀取時以 `groups` 取欄位，
 * 比依賴群組索引更不容易在調整正則時悄悄錯位。
 * The named groups are intentional: reading fields from `groups` is far less likely to shift
 * silently than relying on numeric group indexes when the pattern is edited.
 *
 * @see ../v1/parseYarnLockRowV1.ts 的使用方式 / see how it is used in ../v1/parseYarnLockRowV1.ts
 */
exports.PACKAGE_REGEX = /(?<packageName>.*)@(?:(?<semverPin>[\^|\~\$])?(?<major>\d)(?:\.(?<minor>\d))?(?:\.(?<patch>\d))?(?:-(?<prerelease>[0-9a-zA-Z-]+)(?:.(?<prereleaseVersion>[0-9a-zA-Z]+))?)?(?:\+(?<metadata>[0-9a-zA-Z-]+)(?:.(?<metadataVersion>[0-9a-zA-Z]+))?)?|\*)/;
//# sourceMappingURL=const.js.map