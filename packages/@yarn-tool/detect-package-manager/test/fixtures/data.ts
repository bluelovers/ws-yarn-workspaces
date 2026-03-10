import { _handleClientsToCheck, EnumPackageManager } from "../..";

/**
 * 測試資料：預設的套件管理器順序（pnpm, yarn, npm）
 * Test data: default package manager order (pnpm, yarn, npm)
 */
export const DEFAULT_CLIENTS_EXPECTED = _handleClientsToCheck();

/**
 * 測試資料：預期的套件管理器列表
 * Test data: expected package manager list
 */
export const EXPECTED_PACKAGE_MANAGERS = _handleClientsToCheck();
