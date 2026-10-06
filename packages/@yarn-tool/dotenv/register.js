"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
/**
 * 副作用入口：載入本模組即執行一次 wsEnvConfig()，
 * 供 `node -r @yarn-tool/dotenv/register` 或測試設定中直接註冊環境變數。
 *
 * Side-effect entry: importing this module runs wsEnvConfig() once,
 * for registering env vars via `node -r @yarn-tool/dotenv/register` or in test setup.
 */
exports.default = (0, index_1.wsEnvConfig)();
//# sourceMappingURL=register.js.map