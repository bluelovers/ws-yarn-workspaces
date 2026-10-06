/**
 * 重新匯出 (re-export) resolution 的解析與寫回函式。
 * Re-export the resolution parse and stringify helpers.
 *
 * @remarks
 * 直接沿用 @yarnpkg/parsers 的實作，確保 resolution 格式與 Yarn 官方一致、
 * 避免重複實作造成格式漂移。
 * Reusing @yarnpkg/parsers keeps the resolution format identical to the
 * official Yarn behaviour and avoids format drift from a reimplementation.
 */
export { parseResolution, stringifyResolution } from '@yarnpkg/parsers';
