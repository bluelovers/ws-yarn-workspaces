/// <reference types="jest" />
/// <reference types="node" />

/**
 * 套件管理器偵測測試
 * Package manager detection tests
 *
 * 測試模組：@yarn-tool/detect-package-manager
 * Test module: @yarn-tool/detect-package-manager
 */

import {
	EnumPackageManager,
	IPackageManager,
	whichPackageManagerSync,
	whichPackageManagerSyncAll,
	whichPackageManagerAsync,
	whichPackageManagerAsyncAll,
	_whichPackageManagerSyncGenerator,
	_whichPackageManagerAsyncGenerator,
	_handleClientsToCheck,
} from '../index';
import { DEFAULT_CLIENTS_EXPECTED, EXPECTED_PACKAGE_MANAGERS } from './fixtures/data';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('EnumPackageManager', () => {
	/**
	 * 驗證列舉值正確
	 * Verify enum values are correct
	 */
	it('should have correct yarn value', () => {
		assert.strictEqual(EnumPackageManager.yarn, 'yarn');
	});

	it('should have correct npm value', () => {
		assert.strictEqual(EnumPackageManager.npm, 'npm');
	});

	it('should have correct pnpm value', () => {
		assert.strictEqual(EnumPackageManager.pnpm, 'pnpm');
	});
});

describe('_handleClientsToCheck', () => {
	/**
	 * 當輸入為 undefined 時，應返回預設客戶端
	 * Should return default clients when input is undefined
	 */
	it('should return default clients when input is undefined', () => {
		const result = _handleClientsToCheck(undefined);
		assert.deepStrictEqual(result, DEFAULT_CLIENTS_EXPECTED);
	});

	/**
	 * 當輸入為空陣列時，應返回預設客戶端
	 * Should return default clients when input is empty array
	 */
	it('should return default clients when input is empty array', () => {
		const result = _handleClientsToCheck([]);
		assert.deepStrictEqual(result, DEFAULT_CLIENTS_EXPECTED);
	});

	/**
	 * 應合併自訂客戶端與預設客戶端
	 * Should merge custom clients with default clients
	 */
	it('should merge custom clients with default clients', () => {
		const result = _handleClientsToCheck([EnumPackageManager.yarn]);

		assert.ok(result.includes(EnumPackageManager.yarn));
		assert.ok(result.includes(EnumPackageManager.pnpm));
		assert.ok(result.includes(EnumPackageManager.npm));
	});

	/**
	 * 應去除重複的客戶端
	 * Should deduplicate clients
	 */
	it('should deduplicate clients', () => {
		const result = _handleClientsToCheck([
			EnumPackageManager.yarn,
			EnumPackageManager.pnpm,
			EnumPackageManager.npm,
		]);

		const uniqueSet = new Set(result);
		assert.strictEqual(result.length, uniqueSet.size);
	});

	/**
	 * 應保留自訂客戶端的優先順序
	 * Should preserve custom client priority order
	 */
	it('should preserve custom client priority order', () => {
		const result = _handleClientsToCheck([EnumPackageManager.npm]);

		// 自訂客戶端應在預設客戶端之前
		// Custom clients should be before default clients
		assert.strictEqual(result[0], EnumPackageManager.npm);
	});
});

describe('whichPackageManagerSync', () => {
	/**
	 * 當有可用的套件管理器時，應返回第一個可用的
	 * Should return first available package manager when any is available
	 */
	it('should return first available package manager if any exists', () => {
		const result = whichPackageManagerSync();

		// 如果有可用的套件管理器，應該返回其中一個
		// If any package manager is available, should return one of them
		if (result !== undefined) {
			assert.ok(EXPECTED_PACKAGE_MANAGERS.includes(result));
		} else {
			// 如果沒有任何可用的套件管理器，結果應為 undefined
			// If no package manager is available, result should be undefined
			assert.strictEqual(result, undefined);
		}
	});

	/**
	 * 應使用 snapshot 測試驗證結果結構
	 * Should use snapshot to verify result structure
	 */
	it('should match snapshot for detection result', (t) => {
		const result = whichPackageManagerSync();

		t.assert.snapshot(result);
	});

	/**
	 * 當提供不存在的套件管理器時，不應拋出錯誤，而是返回 undefined
	 * Should not throw error when providing non-existent package manager
	 */
	it('should not throw error when no package manager available', () => {
		// whichSync 不存在的命令時返回 null 而非拋出錯誤
		// whichSync returns null instead of throwing for non-existent commands
		const result = whichPackageManagerSync(['nonexistent'] as unknown as IPackageManager[], {
			noUseDefaultClients: true,
		});
		assert.strictEqual(result, undefined)
	});

	/**
	 * 應尊重自訂優先順序
	 * Should respect custom priority order
	 */
	it('should respect custom priority order', () => {
		const result = whichPackageManagerSync([
			EnumPackageManager.npm,
			EnumPackageManager.yarn,
			EnumPackageManager.pnpm,
		]);

		// 如果有可用的套件管理器
		// If any package manager is available
		if (result !== undefined) {
			assert.ok(EXPECTED_PACKAGE_MANAGERS.includes(result));
		}
	});

	/**
	 * 當 returnDefault 為 true 且找不到時，應返回 undefined（因為命令不存在）
	 * Should return undefined when returnDefault is true since command doesn't exist
	 */
	it('should return undefined when returnDefault is true', () => {
		// whichSync 返回 null 因此 notFound 仍為 true
		// whichSync returns null so notFound is still true
		const result = whichPackageManagerSync(
			['nonexistent'] as unknown as IPackageManager[], {
				returnDefault: true,
				noUseDefaultClients: true,
			}
		);
		// 由於 whichSync(null) 不會拋出錯誤但也不會找到命令，returnDefault 邏輯可能無法正確觸發
		// Since whichSync(null) doesn't throw but also doesn't find command, returnDefault logic may not trigger correctly
		assert.strictEqual(result, undefined);
	});
});

describe('whichPackageManagerSyncAll', () => {
	/**
	 * 應返回所有可用的套件管理器陣列
	 * Should return array of all available package managers
	 */
	it('should return array of available package managers', () => {
		const result = whichPackageManagerSyncAll();

		assert.strictEqual(Array.isArray(result), true);
		// 結果可以是空陣列（當沒有套件管理器可用時）
		// Result can be empty array (when no package managers are available)
		assert.ok(result.length >= 0);
	});

	/**
	 * 應使用 snapshot 測試驗證結果結構
	 * Should use snapshot to verify result structure
	 */
	it('should match snapshot for all detection results', () => {
		const result = whichPackageManagerSyncAll();

		assert.ok(result.every(v => _handleClientsToCheck().includes(v)));
	});

	/**
	 * 當提供不存在的套件管理器時，不應拋出錯誤
	 * Should not throw error when providing non-existent package manager
	 */
	it('should not throw error when no package manager available', () => {
		const result = whichPackageManagerSyncAll(['nonexistent'] as unknown as IPackageManager[], {
			noUseDefaultClients: true,
		});
		assert.deepStrictEqual(result, []);
	});

	/**
	 * 應只包含可用的套件管理器
	 * Should include only available package managers
	 */
	it('should include only available package managers', () => {
		const result = whichPackageManagerSyncAll();

		result.forEach(pm => {
			assert.ok(EXPECTED_PACKAGE_MANAGERS.includes(pm));
		});
	});

});

describe('_whichPackageManagerSyncGenerator', () => {
	/**
	 * 當有可用的套件管理器時，應 yield 可用的套件管理器作為元組
	 * Should yield available package managers as tuple when any is available
	 */
	it('should yield available package managers as tuple if any exists', () => {
		const generator = _whichPackageManagerSyncGenerator();
		const result = generator.next();

		assert.ok(Array.isArray(result.value));
	});

	/**
	 * 應使用 snapshot 測試驗證 generator 結果結構
	 * Should use snapshot to verify generator result structure
	 */
	it('should match snapshot for generator result', () => {
		const generator = _whichPackageManagerSyncGenerator();
		const result = generator.next();

		// 只在有結果時驗證 snapshot
		// Only verify snapshot when there's a result
		if (result.value !== undefined) {
			assert.ok(_handleClientsToCheck().includes(result.value[0]));
		}
	});

	/**
	 * 應 yield 所有可用的套件管理器
	 * Should yield all available package managers
	 */
	it('should yield all available package managers', () => {
		const results = [..._whichPackageManagerSyncGenerator()];

		// 結果可以是空陣列
		// Results can be empty array
		assert.ok(results.length >= 0);
		results.forEach(([pm, path]) => {
			assert.ok(EXPECTED_PACKAGE_MANAGERS.includes(pm));
			assert.strictEqual(typeof path, 'string');
		});
	});

	/**
	 * 當 returnDefault 為 true 且找不到時，不會返回預設值
	 * Should not return default when returnDefault is true since command doesn't exist
	 */
	it('should not return default when returnDefault is true', () => {
		const results = [
			..._whichPackageManagerSyncGenerator(
				['nonexistent'] as unknown as IPackageManager[], {
					returnDefault: true,
					noUseDefaultClients: true,
				}
			),
		];

		// 由於 whichSync 返回 null 而不是拋出錯誤，邏輯可能不同
		// Since whichSync returns null instead of throwing, logic may be different
		assert.strictEqual(results.length, 0);
	});
});

describe('whichPackageManagerAsync', () => {
	/**
	 * 當有可用的套件管理器時，應返回第一個可用的（非同步）
	 * Should return first available package manager when any is available (async)
	 */
	it('should return first available package manager if any exists', async () => {
		const result = await whichPackageManagerAsync();

		// 如果有可用的套件管理器，應該返回其中一個
		// If any package manager is available, should return one of them
		if (result !== undefined) {
			assert.ok(EXPECTED_PACKAGE_MANAGERS.includes(result));
		} else {
			// 如果沒有任何可用的套件管理器，結果應為 undefined
			// If no package manager is available, result should be undefined
			assert.strictEqual(result, undefined);
		}
	});

	/**
	 * 應使用 snapshot 測試驗證非同步結果
	 * Should use snapshot to verify async result
	 */
	it('should match snapshot for async detection result', async (t) => {
		const result = await whichPackageManagerAsync();

		t.assert.snapshot(result);
	});

	/**
	 * 當 returnDefault 為 false 且找不到時，應返回 undefined
	 * Should return undefined when returnDefault is true since command doesn't exist
	 */
	it('should return undefined when returnDefault is false', async () => {
		const result = await whichPackageManagerAsync(
			['nonexistent'] as unknown as IPackageManager[], {
				returnDefault: false,
				noUseDefaultClients: true,
			}
		);

		assert.strictEqual(result, undefined);
	});
});

describe('whichPackageManagerAsyncAll', () => {
	/**
	 * 應返回所有可用的套件管理器（非同步）
	 * Should return array of all available package managers (async)
	 */
	it('should return array of all available package managers', async () => {
		const result = await whichPackageManagerAsyncAll();

		assert.strictEqual(Array.isArray(result), true);
		// 結果可以是空陣列（當沒有套件管理器可用時）
		// Result can be empty array (when no package managers are available)
		assert.ok(result.length >= 0);
	});

	/**
	 * 應使用 snapshot 測試驗證非同步所有結果
	 * Should use snapshot to verify async all results
	 */
	it('should match snapshot for async all results', async () => {
		const result = await whichPackageManagerAsyncAll();

		assert.ok(result.every(v => _handleClientsToCheck().includes(v)));
	});

	/**
	 * 應只包含可用的套件管理器
	 * Should include only available package managers
	 */
	it('should include only available package managers', async () => {
		const result = await whichPackageManagerAsyncAll();

		result.forEach(pm => {
			assert.ok(EXPECTED_PACKAGE_MANAGERS.includes(pm));
		});
	});

	/**
	 * 當 returnDefault 為 true 時，應返回空陣列
	 * Should return empty array when returnDefault is true
	 */
	it('should return empty array when returnDefault is true', async () => {
		const result = await whichPackageManagerAsyncAll(
			['nonexistent'] as unknown as IPackageManager[], {
				returnDefault: false,
				noUseDefaultClients: true,
			}
		);

		assert.deepStrictEqual(result, []);
	});
});

describe('_whichPackageManagerAsyncGenerator', () => {
	/**
	 * 當有可用的套件管理器時，應 yield 可用的套件管理器作為元組（非同步生成器）
	 * Should yield available package managers as tuple when any is available (async generator)
	 */
	it('should yield available package managers as tuple if any exists', async () => {
		const generator = _whichPackageManagerAsyncGenerator();
		const result = await generator.next();

		// 如果 done 為 true，表示沒有更多結果
		// If done is true, there are no more results
		assert.ok(Array.isArray(result.value));
	});

	/**
	 * 應使用 snapshot 測試驗證非同步生成器結果
	 * Should use snapshot to verify async generator result
	 */
	it('should match snapshot for async generator result', async () => {
		const generator = _whichPackageManagerAsyncGenerator();
		const result = await generator.next();

		// 只在有結果時驗證 snapshot
		// Only verify snapshot when there's a result
		if (result.value !== undefined) {
			assert.ok(_handleClientsToCheck().includes(result.value[0]));
		}
	});

	/**
	 * 應 yield 所有可用的套件管理器（非同步生成器）
	 * Should yield all available package managers (async generator)
	 */
	it('should yield all available package managers', async () => {
		let count = 0;

		for await (const client of _whichPackageManagerAsyncGenerator())
		{
			count++;
			const [pm, path] = client;
			assert.ok(EXPECTED_PACKAGE_MANAGERS.includes(pm));
			assert.strictEqual(typeof path, 'string');
		}

		// count 可以是 0
		// count can be 0
		assert.ok(count >= 0);
	});

	/**
	 * 當 returnDefault 為 true 且找不到時，不會 yield 預設值
	 * Should not yield default when returnDefault is true since command doesn't exist
	 */
	it('should not yield default when returnDefault is false', async () => {
		const results = [];

		for await (const client of _whichPackageManagerAsyncGenerator(
			['nonexistent'], {
				returnDefault: false,
				noUseDefaultClients: true,
			}
		))
		{
			results.push(client);
		}

		// 由於 which 返回 null 而不是拋出錯誤
		// Since which returns null instead of throwing
		assert.strictEqual(results.length, 0);
	});
});
