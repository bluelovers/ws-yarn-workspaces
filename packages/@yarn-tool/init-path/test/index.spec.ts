import { getTargetDir } from '../index';
import { resolve } from 'path';
import { _createTestWorkspacesConfig, _createTestOptions } from './lib/helpers/test-factory';

describe('getTargetDir', () => {
	describe('基本功能 / Basic functionality', () => {
		it('應該正確處理一般套件名稱 / should handle regular package name correctly', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'my-package',
			}));

			expect(result).toMatchSnapshot({
				targetDir: expect.any(String),
				targetName: 'my-package',
				cwd: '/current/dir',
				scopedPackagePattern: true,
			});
		});

		it('當無輸入名稱時應該使用 cwd / should use cwd when no input name', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: '',
			}));

			expect(result).toMatchSnapshot({
				targetDir: '/current/dir',
				targetName: null,
				cwd: '/current/dir',
			});
		});
	});

	describe('作用域套件 / Scoped packages', () => {
		it('應該正確處理作用域套件名稱 / should handle scoped package name correctly', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: '@scope/package-name',
			}));

			// 當子目錄不存在時，使用 subname 作為目錄名
			// When subdirectory doesn't exist, use subname as directory name
			expect(result).toMatchSnapshot({
				targetDir: expect.any(String),
				targetName: '@scope/package-name',
				scopedPackagePattern: true,
			});
		});

		it('應該將作用域套件轉換為子套件名稱 / should convert scoped package to subname', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: '@org/my-package',
			}));

			expect(result).toMatchSnapshot({
				targetDir: expect.stringContaining('my-package'),
				targetName: '@org/my-package',
				scopedPackagePattern: true,
			});
		});
	});

	describe('工作區環境 / Workspace environment', () => {
		it('應該在工作區中解析正確路徑 / should resolve correct path in workspace', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'my-package',
				hasWorkspace: '/workspace',
				workspacesConfig: _createTestWorkspacesConfig(),
			}));

			expect(result).toMatchSnapshot({
				targetDir: expect.stringContaining('my-package'),
				targetName: 'my-package',
			});
		});

		it('應該在工作區中處理作用域套件 / should handle scoped package in workspace', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: '@scope/mypackage',
				hasWorkspace: '/workspace',
				workspacesConfig: _createTestWorkspacesConfig(),
			}));

			expect(result).toMatchSnapshot({
				targetDir: expect.stringContaining('mypackage'),
				scopedPackagePattern: true,
			});
		});
	});

	describe('錯誤處理 / Error handling', () => {
		it('當找不到工作區前綴時應該拋出錯誤 / should throw error when workspace prefix not found', () => {
			expect(() => {
				getTargetDir(_createTestOptions({
					inputName: 'my-package',
					hasWorkspace: '/workspace',
					workspacesConfig: _createTestWorkspacesConfig({ prefix: [] }),
				}));
			}).toThrowErrorMatchingSnapshot();
		});
	});

	describe('targetName 選項 / targetName option', () => {
		it('應該使用 targetName 作為目標名稱 / should use targetName as target name', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'input-name',
				targetName: 'target-name',
			}));

			expect(result).toHaveProperty('targetName', 'target-name');
		});

		it('當無 targetName 時應該使用 inputName / should use inputName when no targetName', () => {
			const result = getTargetDir(_createTestOptions({
				inputName: 'my-package',
			}));

			expect(result).toHaveProperty('targetName', 'my-package');
		});
	});
});
