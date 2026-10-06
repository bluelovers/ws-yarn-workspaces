"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_REGEX = void 0;
/**
 * 用來拆解 Yarn v1 lockfile 列鍵（Row Key）的正規表示式。
 * Regular expression used to split a Yarn v1 lockfile row key.
 *
 * v1 的列鍵把名稱與版本範圍寫在同一行（例如 `lodash@^4.17.0, lodash@^4.17.21`），
 * 沒有結構化欄位可依賴，只能用正則拆出名稱、固定範圍符號與 semver 元件。
 * A v1 row key keeps the name and the version range together (for example
 * `lodash@^4.17.0, lodash@^4.17.21`), so there is no structured field to rely on and the
 * name, the pin symbol and the semver parts must be extracted with a regex.
 *
 * 本套件目前未直接使用此常數（實際解析已改走 `@yarn-tool/yarnlock-util`），
 * 保留它作為 v1 列鍵格式的規格參考與對外取用點。
 * This package no longer uses the constant directly (parsing now goes through
 * `@yarn-tool/yarnlock-util`); it is kept as a specification reference for the v1 row-key
 * format and as a public access point for other consumers.
 *
 * 具名群組（Named Group）是刻意的：讀取時以 `groups` 取欄位，
 * 比依賴群組索引更不容易在調整正則時悄悄錯位。
 * The named groups are intentional: reading fields from `groups` is far less likely to shift
 * silently than relying on numeric group indexes when the pattern is edited.
 */
exports.PACKAGE_REGEX = /(?<packageName>.*)@(?:(?<semverPin>[\^\$])?(?<major>\d)(?:\.(?<minor>\d))?(?:\.(?<patch>\d))?(?:-(?<prerelease>[0-9a-zA-Z-]+)(?:.(?<prereleaseVersion>[0-9a-zA-Z]+))?)?(?:\+(?<metadata>[0-9a-zA-Z-]+)(?:.(?<metadataVersion>[0-9a-zA-Z]+))?)?|\*)/;
//# sourceMappingURL=const.js.map