import { getTargetDir } from '../index';
import { resolve } from 'path';
import { _createTestWorkspacesConfig, _createTestOptions } from './lib/helpers/test-factory';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('getTargetDir', () => {
	describe('基本功能 / Basic functionality', () => {
		it('應該正確處理一般套件名稱 / should handle regular package name correctly', (t) => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'my-package',
			}));

			assert.strictEqual(typeof result.targetDir, 'string');
			assert.strictEqual(result.targetName, 'my-package');
			assert.strictEqual(result.cwd, '/current/dir');
			assert.strictEqual(result.scopedPackagePattern, true);
			t.assert.snapshot(result);
		});

		it('當無輸入名稱時應該使用 cwd / should use cwd when no input name', (t) => {
			const result = getTargetDir(_createTestOptions({
				inputName: '',
			}));

			assert.strictEqual(result.targetDir, '/current/dir');
			assert.strictEqual(result.targetName, null);
			assert.strictEqual(result.cwd, '/current/dir');
			t.assert.snapshot(result);
		});
	});

	describe('作用域套件 / Scoped packages', () => {
		it('應該正確處理作用域套件名稱 / should handle scoped package name correctly', (t) => {
			const result = getTargetDir(_createTestOptions({
				inputName: '@scope/package-name',
			}));

			// 當子目錄不存在時，使用 subname 作為目錄名
			// When subdirectory doesn't exist, use subname as directory name
			assert.strictEqual(typeof result.targetDir, 'string');
			assert.strictEqual(result.targetName, '@scope/package-name');
			assert.strictEqual(result.scopedPackagePattern, true);
			t.assert.snapshot(result);
		});

		it('應該將作用域套件轉換為子套件名稱 / should convert scoped package to subname', (t) => {
			const result = getTargetDir(_createTestOptions({
				inputName: '@org/my-package',
			}));

			assert.ok(result.targetDir.includes('my-package'));
			assert.strictEqual(result.targetName, '@org/my-package');
			assert.strictEqual(result.scopedPackagePattern, true);
			t.assert.snapshot(result);
		});
	});

	describe('工作區環境 / Workspace environment', () => {
		it('應該在工作區中解析正確路徑 / should resolve correct path in workspace', (t) => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'my-package',
				hasWorkspace: '/workspace',
				workspacesConfig: _createTestWorkspacesConfig(),
			}));

			assert.ok(result.targetDir.includes('my-package'));
			assert.strictEqual(result.targetName, 'my-package');
			t.assert.snapshot(result);
		});

		it('應該在工作區中處理作用域套件 / should handle scoped package in workspace', (t) => {
			const result = getTargetDir(_createTestOptions({
				inputName: '@scope/mypackage',
				hasWorkspace: '/workspace',
				workspacesConfig: _createTestWorkspacesConfig(),
			}));

			assert.ok(result.targetDir.includes('mypackage'));
			assert.strictEqual(result.scopedPackagePattern, true);
			t.assert.snapshot(result);
		});
	});

	describe('錯誤處理 / Error handling', () => {
		it('當找不到工作區前綴時應該拋出錯誤 / should throw error when workspace prefix not found', (t) => {
			assert.throws(() => {
				getTargetDir(_createTestOptions({
					inputName: 'my-package',
					hasWorkspace: '/workspace',
					workspacesConfig: _createTestWorkspacesConfig({ prefix: [] }),
				}));
			}, (err: any) => {
				t.assert.snapshot(err.message);
				return true;
			});
		});
	});

	describe('targetName 選項 / targetName option', () => {
		it('應該使用 targetName 作為目標名稱 / should use targetName as target name', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'input-name',
				targetName: 'target-name',
			}));

			assert.strictEqual(result.targetName, 'target-name');
		});

		it('當無 targetName 時應該使用 inputName / should use inputName when no targetName', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'my-package',
			}));

			assert.strictEqual(result.targetName, 'my-package');
		});
	});
});
