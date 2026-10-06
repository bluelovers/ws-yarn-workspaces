import { IBufferOrString } from './types';
/**
 * 判斷 Buffer / 字串是否具有內容（長度大於 0）。
 * 以可選鏈 (Optional Chain) 讓 undefined / null 也安全回傳 falsy，
 * 讓空白檢查可直接套用在可能讀取失敗的結果上。
 *
 * Checks whether a Buffer / string has content (length > 0). Optional chaining keeps
 * undefined / null safe and falsy so the check can be applied directly to results that
 * may have failed to read.
 *
 * @param buf 待檢查的內容 / content to check
 */
export declare function notEmpty(buf: IBufferOrString): boolean;
