/**
 * npm 套件名稱驗證套件入口
 * npm package name validation package entry
 *
 * 同時提供預設匯出與具名匯出，
 * 讓 `require()`、`import validate from` 與 `import { validateNpmPackageName }`
 * 三種寫法都能使用。
 * Exports both the default and the named function so `require()`,
 * `import validate from`, and `import { validateNpmPackageName }` all work.
 *
 * @packageDocumentation
 */
import { validateNpmPackageName } from './lib/validateNpmPackageName';
/** 匯出共用型別（IResult、IOptions 等）/ Export shared types (IResult, IOptions, ...) */
export * from './lib/types';
export { validateNpmPackageName };
export default validateNpmPackageName;
