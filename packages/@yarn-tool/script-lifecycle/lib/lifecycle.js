"use strict";
/**
 * Lifecycle map - contains predefined configurations for known npm/yarn lifecycle events.
 * 生命週期映射 - 包含已知 npm/yarn 生命週期事件的預定義配置。
 *
 * This module exports a map of known lifecycle events and their configurations.
 * Each configuration defines the before/after scripts that should be executed.
 *
 * 此模組匯出已知生命週期事件及其配置的映射。
 * 每個配置定義了應執行的前置/後置腳本。
 *
 * @module @yarn-tool/script-lifecycle/lib/lifecycle
 *
 * @example
 * ```typescript
 * import { lifecycleMap } from '@yarn-tool/script-lifecycle/lib/lifecycle';
 *
 * console.log(lifecycleMap.install);
 * // { name: 'install', ignoreSelf: false, before: ['preinstall'], after: ['postinstall', ...] }
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.lifecycleMap = void 0;
const tslib_1 = require("tslib");
const install_1 = tslib_1.__importDefault(require("./lifecycle/install"));
const pack_1 = tslib_1.__importDefault(require("./lifecycle/pack"));
const publish_1 = tslib_1.__importDefault(require("./lifecycle/publish"));
/**
 * Map of known lifecycle events to their configurations.
 * 已知生命週期事件到其配置的映射。
 *
 * Supported lifecycle events:
 * - `install`: npm install lifecycle scripts
 * - `pack`: npm pack lifecycle scripts
 * - `publish`: npm publish lifecycle scripts
 *
 * 支援的生命週期事件：
 * - `install`: npm install 生命週期腳本
 * - `pack`: npm pack 生命週期腳本
 * - `publish`: npm publish 生命週期腳本
 */
exports.lifecycleMap = {
    install: install_1.default,
    pack: pack_1.default,
    publish: publish_1.default
};
exports.default = exports.lifecycleMap;
//# sourceMappingURL=lifecycle.js.map