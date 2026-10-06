/**
 * 依賴欄位排序 (Sort dependency fields)
 *
 * 寫入依賴後排序鍵名，可讓 git diff 保持乾淨、避免同一份 `package.json`
 * 在不同機器上產生不同順序。
 *
 * Sorting keys after a write keeps git diffs clean and stops the same
 * package.json from having different orders on different machines.
 */
import { IPackageJson } from '@ts-type/package-dts';
/**
 * 對四個依賴欄位依鍵名排序 (Sort the four dependency fields by key)
 *
 * Sort the four dependency fields of a package.json by key.
 *
 * @param pkg 要排序的 package.json 物件 (The package.json object to sort)
 *
 * @returns 回傳同一個 `pkg` 物件（就地修改），方便鏈式呼叫
 *
 * Returns the same `pkg` object (mutated in place) for convenient chaining.
 */
export declare function sortDependencies(pkg: IPackageJson): IPackageJson<unknown>;
