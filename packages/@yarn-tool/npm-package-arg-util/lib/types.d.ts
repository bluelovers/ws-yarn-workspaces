/**
 * @fileoverview Type definitions for npm-package-arg utility
 * @description npm-package-arg 工具的類型定義
 *
 * This module defines the core types and interfaces used throughout
 * the npm-package-arg utility library.
 *
 * 本模組定義了 npm-package-arg 工具函式庫中使用的核心類型和介面。
 */
/**
 * Import npm-package-arg types and result types
 * 導入 npm-package-arg 類型和結果類型
 *
 * These types represent different kinds of package references that npm-package-arg can parse:
 * - AliasResult: For aliased packages like "my-lodash@npm:lodash@4.17.21"
 * - FileResult: For local file references like "file:./local-package.tgz"
 * - RegistryResult: For npm registry packages with version/range/tag
 * - HostedGitResult: For hosted git services (GitHub, GitLab, Bitbucket, etc.)
 * - URLResult: For direct git URLs and remote tarball URLs
 *
 * 這些類型代表 npm-package-arg 可以解析的不同套件引用類型：
 * - AliasResult: 別名套件，例如 "my-lodash@npm:lodash@4.17.21"
 * - FileResult: 本地檔案引用，例如 "file:./local-package.tgz"
 * - RegistryResult: npm registry 套件，含版本/範圍/標籤
 * - HostedGitResult: 託管 git 服務（GitHub、GitLab、Bitbucket 等）
 * - URLResult: 直接 git URL 和遠端 tarball URL
 */
import _npa, { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult, Result } from 'npm-package-arg';
/**
 * Import npa2 function from parent module
 * 從父模組導入 npa2 函數
 *
 * npa2 is an enhanced version of npm-package-arg with additional features.
 * npa2 是 npm-package-arg 的增強版本，具有額外功能。
 */
import { npa2 } from '..';
/**
 * Import TypeScript type utilities
 * 導入 TypeScript 類型工具
 *
 * ITSTypeAndStringLiteral is used to create type-safe string literal unions.
 * ITSTypeAndStringLiteral 用於創建類型安全的字串字面量聯合類型。
 */
import { ITSTypeAndStringLiteral } from 'ts-type';
/**
 * Interface for parsed package name information
 * 解析套件名稱資訊的介面
 *
 * Represents the result of parsing a package argument string,
 * containing all relevant information about the package.
 *
 * 表示解析套件參數字串的結果，
 * 包含有關套件的所有相關資訊。
 */
export interface IParsePackageName {
    /**
     * The type of the package result
     * 套件結果的類型
     *
     * Possible values: 'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
     * 可能的值：'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
     */
    type: IResultType;
    /**
     * The full package name (including scope if present)
     * 完整的套件名稱（如果存在範圍則包含範圍）
     *
     * May be undefined for git URLs without a package name.
     * 對於沒有套件名稱的 git URL 可能為 undefined。
     *
     * @example "lodash", "@types/node"
     */
    name: string;
    /**
     * The scope of the package (with @ prefix)
     * 套件的範圍（含 @ 前綴）
     *
     * Only present for scoped packages. The scope includes the @ prefix.
     * 僅對範圍套件存在。範圍包含 @ 前綴。
     *
     * @example "@types" for @types/node
     */
    scope: string;
    /**
     * The package name without scope
     * 不含範圍的套件名稱
     *
     * @example "node" for @types/node
     */
    subname: string;
    /**
     * The semantic version or range specifier
     * 語意版本或範圍指定符
     *
     * May be undefined for packages without version specification.
     * 對於沒有版本指定的套件可能為 undefined。
     *
     * @example "4.17.21", "^18.0.0", "latest", "*"
     */
    semver: string;
    /**
     * The raw result from npm-package-arg
     * 來自 npm-package-arg 的原始結果
     *
     * Contains the complete parsed result object from the underlying npm-package-arg library.
     * This includes all original properties and metadata that were parsed from the input string.
     *
     * 包含來自底層 npm-package-arg 函式庫的完整解析結果物件。
     * 這包括從輸入字串解析的所有原始屬性和元數據。
     *
     * Use this when you need access to low-level parsing details not exposed in the simplified interface.
     * 當你需要存取簡化介面未公開的低層解析詳細資訊時使用此屬性。
     *
     * @see {@link IResult} for the possible result type variations
     * @see {@link IResultAll} if you need to handle results without names
     */
    result: IResult;
}
/**
 * Union type for all possible npm-package-arg result types with names
 * 所有可能的帶有名稱的 npm-package-arg 結果類型的聯合類型
 *
 * Combines all possible result types from npm-package-arg parsing.
 * Each result type has a `name` property, making this suitable for
 * scenarios where a package name is required.
 *
 * 結合 npm-package-arg 解析的所有可能結果類型。
 * 每個結果類型都有一個 `name` 屬性，使其適用於需要套件名稱的場景。
 *
 * ### Result Type Details / 結果類型詳細資訊：
 *
 * | Type | Description | Use Case |
 * |------|-------------|----------|
 * | AliasResult | Aliased packages | "my-lodash@npm:lodash@4.17.21" |
 * | FileResult | Local file/directory packages | "file:./local-package.tgz" |
 * | RegistryResult | npm registry packages | "lodash@4.17.21", "react@^18.0.0" |
 * | HostedGitResult | Hosted git repositories | "github:lodash/lodash" |
 * | URLResult | Git URLs and remote tarballs | "git+https://...", "https://...tgz" |
 *
 * ### When to Use / 使用時機：
 *
 * Use this type when you're confident that the parsed result will always
 * have a package name. For git URLs without explicit names, use {@link IResultAll} instead.
 *
 * 當你確信解析結果總是會有套件名稱時使用此類型。
 * 對於沒有明確名稱的 git URL，請改用 {@link IResultAll}。
 *
 * @example
 * ```typescript
 * function processPackage(result: IResult): string {
 *   // Safe to access result.name here
 *   // 在這裡安全地存取 result.name
 *   return result.name;
 * }
 * ```
 *
 * @see {@link IResultAll} for results that may not have names
 * @see {@link IResultType} for the type discriminator
 * @see {@link EnumResultType} for the complete list of result types
 */
export type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;
/**
 * Union type for all possible npm-package-arg result types (including those without names)
 * 所有可能的 npm-package-arg 結果類型的聯合類型（包含沒有名稱的）
 *
 * This type extends {@link IResult} to include the base `Result` type from npm-package-arg
 * which may not have a `name` property. This is essential for handling edge cases where
 * package specifications don't include an explicit package name.
 *
 * 此類型擴展 {@link IResult} 以包含可能沒有 `name` 屬性的基礎 `Result` 類型。
 * 這對於處理套件規格未包含明確套件名稱的邊緣情況至關重要。
 *
 * ### When to Use / 使用時機：
 *
 * Use this type instead of {@link IResult} when:
 * - Parsing raw git URLs without package names
 * - Handling user input that might be incomplete
 * - Building generic parsing utilities that need to handle all cases
 *
 * 在以下情況使用此類型而非 {@link IResult}：
 * - 解析沒有套件名稱的原始 git URL
 * - 處理可能不完整的使用者輸入
 * - 構建需要處理所有情況的通用解析工具
 *
 * ### Type Guard Example / 類型守衛範例：
 *
 * ```typescript
 * function processResult(result: IResultAll): string {
 *   if ('name' in result && result.name) {
 *     // result is narrowed to IResult here
 *     // 這裡 result 被縮窄為 IResult
 *     return result.name;
 *   }
 *   // Handle nameless results
 *   // 處理沒有名稱的結果
 *   return 'unnamed-package';
 * }
 * ```
 *
 * @see {@link IResult} for the subset that always has names
 * @see {@link IOptionsNpaUtil.shouldHasName} to control name validation
 */
export type IResultAll = IResult | Result;
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
export declare enum EnumResultType {
    /**
     * A specifier with an alias, like "myalias@npm:foo@1.2.3"
     * 帶有別名的指定符，例如 "myalias@npm:foo@1.2.3"
     *
     * Allows creating a local alias for a package with a different name.
     * 允許為具有不同名稱的套件創建本地別名。
     *
     * @example "my-lodash@npm:lodash@4.17.21"
     */
    'alias' = "alias",
    /**
     * A local .tar.gz, .tar or .tgz file.
     * 本地 .tar.gz、.tar 或 .tgz 檔案。
     *
     * References a package from a local compressed archive.
     * 從本地壓縮檔案引用套件。
     *
     * @example "file:./my-package-1.0.0.tgz"
     */
    'file' = "file",
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
    'directory' = "directory",
    /**
     * A specific version number, like "foo@1.2.3"
     * 特定版本號，例如 "foo@1.2.3"
     *
     * Exact semantic version matching.
     * 精確的語意版本匹配。
     *
     * @example "lodash@4.17.21"
     */
    'version' = "version",
    /**
     * A version range, like "foo@2.x"
     * 版本範圍，例如 "foo@2.x"
     *
     * Supports npm semver range syntax (^, ~, >=, etc.).
     * 支援 npm semver 範圍語法（^、~、>= 等）。
     *
     * @example "lodash@^4.17.0", "react@~18.0.0", "typescript@>=4.0.0"
     */
    'range' = "range",
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
    'tag' = "tag",
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
    'git' = "git",
    /**
     * An http url (presumably to a tgz)
     * HTTP URL（通常指向 tgz 檔案）
     *
     * References a package from a remote tarball URL.
     * 從遠端 tarball URL 引用套件。
     *
     * @example "https://example.com/packages/my-package-1.0.0.tgz"
     */
    'remote' = "remote"
}
/**
 * Type alias for the result type string
 * 結果類型字串的類型別名
 *
 * This type is a union of:
 * 1. The 'type' property extracted from IResult (from npm-package-arg)
 * 2. String literals from EnumResultType (via ITSTypeAndStringLiteral)
 *
 * 這個類型是以下兩者的聯合：
 * 1. 從 IResult 提取的 'type' 屬性（來自 npm-package-arg）
 * 2. 來自 EnumResultType 的字串字面量（通過 ITSTypeAndStringLiteral）
 *
 * This design provides both type safety and flexibility:
 * - Allows autocomplete for known types
 * - Accepts any string for extensibility
 *
 * 這種設計同時提供類型安全和靈活性：
 * - 允許已知類型的自動完成
 * - 接受任何字串以提供擴展性
 *
 * Possible values: 'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
 * 可能的值：'alias', 'file', 'directory', 'version', 'range', 'tag', 'git', 'remote'
 *
 * @see {@link EnumResultType} for the complete list of supported types
 * @see {@link IResult} for the source result type
 */
export type IResultType = IResult["type"] | ITSTypeAndStringLiteral<EnumResultType>;
/**
 * Base options for npm-package-arg parsing
 * npm-package-arg 解析的基礎選項
 *
 * These options control the fundamental behavior of the npm-package-arg parser.
 * They define how package specifiers are interpreted and how file paths are resolved.
 *
 * 這些選項控制 npm-package-arg 解析器的基本行為。
 * 它們定義了如何解釋套件指定符以及如何解析檔案路徑。
 *
 * ### Usage Scenarios / 使用場景：
 *
 * - **Version/Range Parsing**: Specify a version or range in `spec`
 * - **File Path Resolution**: Use `where` to control relative path resolution
 * - **Git URL Parsing**: Pass git URLs in `spec` for hosted repository parsing
 *
 * - **版本/範圍解析**：在 `spec` 中指定版本或範圍
 * - **檔案路徑解析**：使用 `where` 控制相對路徑解析
 * - **Git URL 解析**：在 `spec` 中傳遞 git URL 進行託管儲存庫解析
 *
 * @see https://github.com/npm/npm-package-arg?tab=readme-ov-file#using
 * @see {@link IOptionsNpaUtil} for extended options with validation
 */
export interface IOptionsNpaBase {
    /**
     * The specifier indicating where and how you can get this module.
     * 指定可以獲取此模組的位置和方式。
     *
     * The specifier can take various forms depending on the package source:
     * - Version: "1.2.3" or "lodash@1.2.3"
     * - Range: "^1.7.17" or "~2.0.0"
     * - Tag: "latest" or "next"
     * - Git URL: "git+https://github.com/user/foo"
     * - Hosted git: "bitbucket:user/foo", "github:user/foo"
     * - Tarball URL: "http://example.com/foo.tgz"
     * - Local file: "file:foo.tar.gz"
     * - Local directory: "file:../foo/bar/"
     *
     * 指定符可以根據套件來源採取各種形式：
     * - 版本："1.2.3" 或 "lodash@1.2.3"
     * - 範圍："^1.7.17" 或 "~2.0.0"
     * - 標籤："latest" 或 "next"
     * - Git URL："git+https://github.com/user/foo"
     * - 託管 git："bitbucket:user/foo"、"github:user/foo"
     * - Tarball URL："http://example.com/foo.tgz"
     * - 本地檔案："file:foo.tar.gz"
     * - 本地目錄："file:../foo/bar/"
     *
     * If not included, the default is "latest".
     * 如果未包含，則預設為 "latest"。
     *
     * @default 'latest'
     *
     * @example
     * ```typescript
     * // Exact version
     * { spec: 'lodash@4.17.21' }
     *
     * // Version range
     * { spec: 'react@^18.0.0' }
     *
     * // Git repository
     * { spec: 'git+https://github.com/facebook/react.git' }
     *
     * // Local file
     * { spec: 'file:./my-package.tgz' }
     * ```
     */
    spec?: string;
    /**
     * Optionally the path to resolve file paths relative to.
     * 可選的基礎目錄，用於解析相對路徑。
     *
     * When parsing file or directory specifiers that use relative paths
     * (e.g., "file:../foo/bar" or "file:./local-package.tgz"), this option
     * determines the base directory from which the relative path is resolved.
     *
     * 當解析使用相對路徑的檔案或目錄指定符時（例如 "file:../foo/bar" 或
     * "file:./local-package.tgz"），此選項決定相對路徑解析的基礎目錄。
     *
     * This is particularly important when:
     * - Working in monorepos with packages in subdirectories
     * - Writing CLI tools that resolve paths from a specific directory
     * - Testing with fixtures located in different directories
     *
     * 這在以下情況特別重要：
     * - 在子目錄中包含套件的 monorepo 中工作
     * - 編寫從特定目錄解析路徑的 CLI 工具
     * - 使用位於不同目錄的測試固件進行測試
     *
     * @default process.cwd() - Current working directory of the process
     *          process.cwd() - 程序的當前工作目錄
     *
     * @example
     * ```typescript
     * // Resolve relative to a specific package directory
     * // 相對於特定套件目錄解析
     * parsePackageName('file:../shared-utils', {
     *   where: '/path/to/my-project/packages/app',
     * });
     *
     * // In a monorepo, resolve from the workspace root
     * // 在 monorepo 中，從工作區根目錄解析
     * parsePackageName('file:./local-pkg.tgz', {
     *   where: path.resolve(__dirname, '../..'),
     * });
     * ```
     */
    where?: string;
}
/**
 * Extended options for npm-package-arg utility
 * npm-package-arg 工具的擴展選項
 *
 * This interface extends {@link IOptionsNpaBase} with additional validation
 * and customization options specifically designed for the utility functions
 * in this library. These options provide fine-grained control over parsing
 * behavior and result validation.
 *
 * 此介面擴展 {@link IOptionsNpaBase}，增加了專為此函式庫中的工具函數
 * 設計的額外驗證和自定義選項。這些選項提供對解析行為和結果驗證的
 * 精細控制。
 *
 * ### Extended Features / 擴展功能：
 *
 * - **Custom Parser**: Override the default npm-package-arg implementation
 * - **Name Validation**: Enforce or relax package name requirements
 * - **Type Filtering**: Restrict parsing to specific package types
 *
 * - **自定義解析器**：覆蓋預設的 npm-package-arg 實現
 * - **名稱驗證**：強制或放寬套件名稱要求
 * - **類型過濾**：將解析限制為特定的套件類型
 *
 * ### Example / 範例：
 *
 * ```typescript
 * import { parsePackageName } from '@yarn-tool/npm-package-arg-util';
 *
 * // Parse with strict validation
 * const result = parsePackageName('lodash@4.17.21', {
 *   shouldHasName: true,
 *   allowedType: ['version', 'range', 'tag'],
 * });
 *
 * // Parse with custom parser
 * const result2 = parsePackageName('my-pkg', {
 *   npa: customNpaFunction,
 *   where: '/path/to/project',
 * });
 * ```
 *
 * @extends IOptionsNpaBase
 * @see {@link IOptionsNpaBase} for base parsing options
 */
export interface IOptionsNpaUtil extends IOptionsNpaBase {
    /**
     * Custom npa function to use for parsing
     * 用於解析的自定義 npa 函數
     *
     * Allows overriding the default npm-package-arg implementation.
     * This is useful when you need custom parsing logic or want to use
     * an enhanced version like npa2.
     *
     * 允許覆蓋預設的 npm-package-arg 實現。
     * 當你需要自定義解析邏輯或想使用增強版本（如 npa2）時很有用。
     *
     * @default undefined - Uses the standard npm-package-arg when not specified
     *                      未指定時使用標準 npm-package-arg
     *
     * @example
     * ```typescript
     * import { npa2 } from '@yarn-tool/npm-package-arg-util';
     *
     * const result = parsePackageName('lodash', {
     *   npa: npa2, // Use enhanced parser
     * });
     * ```
     */
    npa?: typeof _npa | typeof npa2;
    /**
     * Whether to require that the result has a valid name
     * 是否要求結果具有有效的名稱
     *
     * When true, parsing will throw an error if the result doesn't have a package name.
     * This is useful when you need to ensure the parsed result can be used as a dependency
     * with a name.
     *
     * Note: Git URLs and some directory references may not have explicit package names.
     *
     * 當為 true 時，如果結果沒有套件名稱則解析會拋出錯誤。
     * 這在需要確保解析結果可以作為具有名稱的依賴項使用時很有用。
     *
     * 注意：Git URL 和某些目錄引用可能沒有明確的套件名稱。
     *
     * @default true for most types, false for git/directory types
     *          大多數類型為 true，git/目錄類型為 false
     *
     * @example
     * ```typescript
     * // Will throw if parsing a git URL without a name
     * // 如果解析沒有名稱的 git URL 會拋出錯誤
     * parsePackageName('git+https://github.com/user/repo.git', {
     *   shouldHasName: true,
     * });
     *
     * // Will succeed for git URLs without names
     * // 對於沒有名稱的 git URL 會成功
     * parsePackageName('git+https://github.com/user/repo.git', {
     *   shouldHasName: false,
     * });
     * ```
     */
    shouldHasName?: boolean;
    /**
     * Array of allowed result types
     * 允許的結果類型陣列
     *
     * When specified, parsing will throw an error if the result type is not in this array.
     * This is useful for restricting input to specific package specification types,
     * ensuring only certain kinds of dependencies are accepted.
     *
     * 當指定時，如果結果類型不在此陣列中則解析會拋出錯誤。
     * 這對於將輸入限制為特定的套件規格類型很有用，
     * 確保只接受特定類型的依賴項。
     *
     * @default undefined - All types are allowed
     *          未定義 - 允許所有類型
     *
     * @example
     * ```typescript
     * // Only allow registry packages (version, range, or tag)
     * // 只允許 registry 套件（version、range 或 tag）
     * parsePackageName('lodash@4.17.21', {
     *   allowedType: ['version', 'range', 'tag'],
     * });
     *
     * // Only allow git-based packages
     * // 只允許基於 git 的套件
     * parsePackageName('lodash/lodash', {
     *   allowedType: ['git'],
     * });
     *
     * // Reject local file/directory packages
     * // 拒絕本地檔案/目錄套件
     * parsePackageName('lodash', {
     *   allowedType: ['alias', 'version', 'range', 'tag', 'git', 'remote'],
     * });
     * ```
     *
     * @see {@link IResultType} for the list of available types
     * @see {@link EnumResultType} for the enum of supported types
     */
    allowedType?: IResultType[];
    /**
     * 忽略錯誤檢查/不拋出錯誤，可用來在除錯時取得原始 npm-package-arg 的結果
     */
    noThrowError?: boolean;
}
