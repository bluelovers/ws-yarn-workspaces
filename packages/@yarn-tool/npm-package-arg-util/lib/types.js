"use strict";
/**
 * @fileoverview Type definitions for npm-package-arg utility
 * @description npm-package-arg 工具的類型定義
 *
 * This module defines the core types and interfaces used throughout
 * the npm-package-arg utility library.
 *
 * 本模組定義了 npm-package-arg 工具函式庫中使用的核心類型和介面。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumResultType = void 0;
/**
 * Enum of all possible result types from npm-package-arg parsing
 * npm-package-arg 解析的所有可能結果類型枚舉
 *
 * These represent the different ways a package can be specified:
 * 這些代表指定套件的不同方式：
 *
 * | Type | Description | Example |
 * |------|-------------|---------|
 * | alias | Alias specifier | "my-lodash@npm:lodash@4.17.21" |
 * | file | Local tarball file | "file:./package.tgz" |
 * | directory | Local directory | "file:../local-package" |
 * | version | Exact version | "lodash@4.17.21" |
 * | range | Version range | "lodash@^4.17.0" |
 * | tag | Tagged version | "lodash@latest" |
 * | git | Git repository | "git+https://github.com/lodash/lodash.git" |
 * | remote | Remote URL | "https://example.com/package.tgz" |
 */
var EnumResultType;
(function (EnumResultType) {
    /**
     * A specifier with an alias, like "myalias@npm:foo@1.2.3"
     * 帶有別名的指定符，例如 "myalias@npm:foo@1.2.3"
     *
     * Allows creating a local alias for a package with a different name.
     * 允許為具有不同名稱的套件創建本地別名。
     *
     * @example "my-lodash@npm:lodash@4.17.21"
     */
    EnumResultType["alias"] = "alias";
    /**
     * A local .tar.gz, .tar or .tgz file.
     * 本地 .tar.gz、.tar 或 .tgz 檔案。
     *
     * References a package from a local compressed archive.
     * 從本地壓縮檔案引用套件。
     *
     * @example "file:./my-package-1.0.0.tgz"
     */
    EnumResultType["file"] = "file";
    /**
     * A local directory.
     * 本地目錄。
     *
     * References a package from a local directory path.
     * Useful for developing multiple packages locally.
     * 從本地目錄路徑引用套件。
     * 適用於本地開發多個套件。
     *
     * @example "file:../my-local-package"
     */
    EnumResultType["directory"] = "directory";
    /**
     * A specific version number, like "foo@1.2.3"
     * 特定版本號，例如 "foo@1.2.3"
     *
     * Exact semantic version matching.
     * 精確的語意版本匹配。
     *
     * @example "lodash@4.17.21"
     */
    EnumResultType["version"] = "version";
    /**
     * A version range, like "foo@2.x"
     * 版本範圍，例如 "foo@2.x"
     *
     * Supports npm semver range syntax (^, ~, >=, etc.).
     * 支援 npm semver 範圍語法（^、~、>= 等）。
     *
     * @example "lodash@^4.17.0", "react@~18.0.0", "typescript@>=4.0.0"
     */
    EnumResultType["range"] = "range";
    /**
     * A tagged version, like "foo@latest"
     * 標籤版本，例如 "foo@latest"
     *
     * References a version by its distribution tag.
     * Common tags: latest, next, beta, alpha, canary
     * 通過發布標籤引用版本。
     * 常見標籤：latest、next、beta、alpha、canary
     *
     * @example "lodash@latest", "react@next"
     */
    EnumResultType["tag"] = "tag";
    /**
     * A git repo
     * Git 儲存庫
     *
     * References a package from a git repository.
     * Supports various git URL formats.
     * 從 Git 儲存庫引用套件。
     * 支援各種 Git URL 格式。
     *
     * @example "git+https://github.com/lodash/lodash.git"
     * @example "github:lodash/lodash#v4.17.21"
     */
    EnumResultType["git"] = "git";
    /**
     * An http url (presumably to a tgz)
     * HTTP URL（通常指向 tgz 檔案）
     *
     * References a package from a remote tarball URL.
     * 從遠端 tarball URL 引用套件。
     *
     * @example "https://example.com/packages/my-package-1.0.0.tgz"
     */
    EnumResultType["remote"] = "remote";
})(EnumResultType || (exports.EnumResultType = EnumResultType = {}));
//# sourceMappingURL=types.js.map