/// <reference types="jest" />
/// <reference types="node" />

/**
 * 測試 npmClients 陣列包含 null 和 undefined 的處理
 * Test handling of npmClients array containing null and undefined
 *
 * 測試模組：@yarn-tool/detect-package-manager
 * Test module: @yarn-tool/detect-package-manager
 */

import {
	EnumPackageManager,
	IPackageManager,
	handleOptionsWhichPackageManager,
	_handleClientsToCheck,
} from '../index';

/**
 * 測試資料：預設的套件管理器順序（pnpm, yarn, npm）
 * Test data: default package manager order (pnpm, yarn, npm)
 */
const DEFAULT_CLIENTS_EXPECTED = [
	EnumPackageManager.pnpm,
	EnumPackageManager.yarn,
	EnumPackageManager.npm,
] as const;

describe('_handleClientsToCheck - null and undefined handling', () => {
	/**
	 * 當陣列包含 null 時，應過濾掉 null 值
	 * Should filter out null values when array contains null
	 */
	it('should filter out null values in array', () => {
		const result = _handleClientsToCheck([
			EnumPackageManager.yarn,
			null as unknown as IPackageManager,
			EnumPackageManager.npm,
		]);

		// 結果不應包含 null
		// Result should not contain null
		expect(result).not.toContain(null);
		// 結果應只包含有效的套件管理器
		// Result should only contain valid package managers
		expect(result).toContain(EnumPackageManager.yarn);
		expect(result).toContain(EnumPackageManager.npm);
	});

	/**
	 * 當陣列包含 undefined 時，應過濾掉 undefined 值
	 * Should filter out undefined values when array contains undefined
	 */
	it('should filter out undefined values in array', () => {
		const result = _handleClientsToCheck([
			EnumPackageManager.pnpm,
			undefined as unknown as IPackageManager,
			EnumPackageManager.yarn,
		]);

		// 結果不應包含 undefined
		// Result should not contain undefined
		expect(result).not.toContain(undefined);
		// 結果應只包含有效的套件管理器
		// Result should only contain valid package managers
		expect(result).toContain(EnumPackageManager.pnpm);
		expect(result).toContain(EnumPackageManager.yarn);
	});

	/**
	 * 當陣列同時包含 null 和 undefined 時，應過濾掉兩者
	 * Should filter out both null and undefined when array contains both
	 */
	it('should filter out both null and undefined when array contains both', () => {
		const result = _handleClientsToCheck([
			null as unknown as IPackageManager,
			EnumPackageManager.npm,
			undefined as unknown as IPackageManager,
			EnumPackageManager.pnpm,
			null as unknown as IPackageManager,
		] as unknown as IPackageManager[]);

		// 結果不應包含 null 或 undefined
		// Result should not contain null or undefined
		expect(result).not.toContain(null);
		expect(result).not.toContain(undefined);
		// 結果應只包含有效的套件管理器
		// Result should only contain valid package managers
		expect(result).toContain(EnumPackageManager.npm);
		expect(result).toContain(EnumPackageManager.pnpm);
	});

	/**
	 * 當陣列只有 null 和 undefined 時，應返回預設客戶端
	 * Should return default clients when array only contains null and undefined
	 */
	it('should return default clients when array only contains null and undefined', () => {
		const result = _handleClientsToCheck([
			null as unknown as IPackageManager,
			undefined as unknown as IPackageManager,
		] as unknown as IPackageManager[]);

		// 應返回預設客戶端
		// Should return default clients
		expect(result).toEqual(DEFAULT_CLIENTS_EXPECTED);
	});

	/**
	 * 當陣列包含空字串時，應過濾掉空字串
	 * Should filter out empty strings when array contains empty strings
	 */
	it('should filter out empty strings', () => {
		const result = _handleClientsToCheck([
			EnumPackageManager.yarn,
			'' as unknown as IPackageManager,
			EnumPackageManager.pnpm,
		]);

		// 結果不應包含空字串
		// Result should not contain empty strings
		expect(result).not.toContain('');
		// 結果應只包含有效的套件管理器
		// Result should only contain valid package managers
		expect(result).toContain(EnumPackageManager.yarn);
		expect(result).toContain(EnumPackageManager.pnpm);
	});

	/**
	 * 當 noUseDefaultClients 為 true 時，應只返回有效的自訂客戶端
	 * Should only return valid custom clients when noUseDefaultClients is true
	 */
	it('should only return valid custom clients when noUseDefaultClients is true', () => {
		const result = _handleClientsToCheck(
			[
				EnumPackageManager.npm,
				null as unknown as IPackageManager,
				undefined as unknown as IPackageManager,
				EnumPackageManager.yarn,
			],
			{
				noUseDefaultClients: true,
			}
		);

		// 不應包含 null 或 undefined
		// Should not contain null or undefined
		expect(result).not.toContain(null);
		expect(result).not.toContain(undefined);
		// 應只包含有效的自訂客戶端
		// Should only contain valid custom clients
		expect(result).toContain(EnumPackageManager.npm);
		expect(result).toContain(EnumPackageManager.yarn);
		// 不應包含預設客戶端（因為 noUseDefaultClients 為 true）
		// Should not contain default clients (because noUseDefaultClients is true)
		expect(result).not.toContain(EnumPackageManager.pnpm);
	});
});

describe('handleOptionsWhichPackageManager - null and undefined handling', () => {
	/**
	 * 當 npmClients 包含 null 時，應正確處理
	 * Should handle correctly when npmClients contains null
	 */
	it('should handle correctly when npmClients contains null', () => {
		const result = handleOptionsWhichPackageManager(
			[EnumPackageManager.yarn, null as unknown as IPackageManager],
			{
				returnDefault: true,
			}
		);

		// clientsToCheck 不應包含 null
		// clientsToCheck should not contain null
		expect(result.clientsToCheck).not.toContain(null);
		// 選項應正確傳遞
		// Options should be passed correctly
		expect(result.options.returnDefault).toBe(true);
	});

	/**
	 * 當 npmClients 包含 undefined 時，應正確處理
	 * Should handle correctly when npmClients contains undefined
	 */
	it('should handle correctly when npmClients contains undefined', () => {
		const result = handleOptionsWhichPackageManager(
			[undefined as unknown as IPackageManager, EnumPackageManager.pnpm],
			{
				noUseDefaultClients: true,
			}
		);

		// clientsToCheck 不應包含 undefined
		// clientsToCheck should not contain undefined
		expect(result.clientsToCheck).not.toContain(undefined);
		// 選項應正確傳遞
		// Options should be passed correctly
		expect(result.options.noUseDefaultClients).toBe(true);
	});

	/**
	 * 當 npmClients 為 null 時，應返回預設客戶端
	 * Should return default clients when npmClients is null
	 */
	it('should return default clients when npmClients is null', () => {
		const result = handleOptionsWhichPackageManager(
			null as unknown as IPackageManager[],
			{}
		);

		// 應返回預設客戶端
		// Should return default clients
		expect(result.clientsToCheck).toEqual(DEFAULT_CLIENTS_EXPECTED);
	});

	/**
	 * 混合 null, undefined 和有效值的測試
	 * Mixed test with null, undefined and valid values
	 */
	it('should handle mixed null, undefined and valid values', () => {
		const result = handleOptionsWhichPackageManager(
			[
				EnumPackageManager.pnpm,
				null as unknown as IPackageManager,
				EnumPackageManager.npm,
				undefined as unknown as IPackageManager,
				'' as unknown as IPackageManager,
				EnumPackageManager.yarn,
			],
			{}
		);

		// 過濾後的結果應只包含有效值
		// Result after filtering should only contain valid values
		expect(result.clientsToCheck).not.toContain(null);
		expect(result.clientsToCheck).not.toContain(undefined);
		expect(result.clientsToCheck).not.toContain('');
		// 應包含所有有效的套件管理器
		// Should contain all valid package managers
		expect(result.clientsToCheck).toContain(EnumPackageManager.pnpm);
		expect(result.clientsToCheck).toContain(EnumPackageManager.npm);
		expect(result.clientsToCheck).toContain(EnumPackageManager.yarn);
	});
});
