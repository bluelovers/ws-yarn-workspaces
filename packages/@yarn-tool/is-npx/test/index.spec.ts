/**
 * @yarn-tool/is-npx 測試檔案
 * Test file for @yarn-tool/is-npx
 */
import {
	isNpx,
	_isNpx,
	_inNpxPath,
	handleOptionsDetectNpx,
	IOptionsDetectNpx,
} from '../index';

describe('@yarn-tool/is-npx', () => {
	/**
	 * 建立標準測試選項
	 * Create standard test options
	 */
	function _createTestOptions(overrides?: Partial<IOptionsDetectNpx>): IOptionsDetectNpx {
		return {
			__dirname: '/test/path',
			env: {},
			argv: [],
			...overrides,
		};
	}

	describe('isNpx', () => {
		describe('正常案例 / Normal Cases', () => {
			it('應該在 ypx_ 路徑中檢測為 true / should detect true in ypx_ path', () => {
				const opts = _createTestOptions({
					__dirname: '/home/user/.cache/ypx_abc123',
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該在 _npx 路徑中檢測為 true / should detect true in _npx path', () => {
				const opts = _createTestOptions({
					__dirname: '/home/user/.npm/_npx/12345',
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該在 dlx 路徑中檢測為 true / should detect true in dlx path', () => {
				const opts = _createTestOptions({
					__dirname: '/home/user/.pnpm-cache/dlx/abc123',
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該在 argv[0] 包含 NPX 路徑時檢測為 true / should detect true when argv[0] contains NPX path', () => {
				const opts = _createTestOptions({
					__dirname: '/normal/path',
					argv: ['/home/user/.cache/ypx_abc123/node_modules/.bin/ts-node'],
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該在 PNPM_PACKAGE_NAME 為 npx 時檢測為 true / should detect true when PNPM_PACKAGE_NAME is npx', () => {
				const opts = _createTestOptions({
					__dirname: '/normal/path',
					env: { PNPM_PACKAGE_NAME: 'npx' },
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該在 PNPM_PACKAGE_NAME 為 ypx 時檢測為 true / should detect true when PNPM_PACKAGE_NAME is ypx', () => {
				const opts = _createTestOptions({
					__dirname: '/normal/path',
					env: { PNPM_PACKAGE_NAME: 'ypx' },
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該在 PNPM_PACKAGE_NAME 為 ynpx 時檢測為 true / should detect true when PNPM_PACKAGE_NAME is ynpx', () => {
				const opts = _createTestOptions({
					__dirname: '/normal/path',
					env: { PNPM_PACKAGE_NAME: 'ynpx' },
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該在 env._ 以 /npx 結尾時檢測為 true / should detect true when env._ ends with /npx', () => {
				const opts = _createTestOptions({
					__dirname: '/normal/path',
					env: { _: '/usr/local/bin/npx' },
				});
				expect({
					opts,
					isNpx: isNpx(opts),
					_isNpx: _isNpx(opts),
				}).toMatchSnapshot({
					isNpx: true,
					_isNpx: true,
				});
			});
		});

		describe('錯誤案例 / Error Cases', () => {
			it('應該在普通路徑中檢測為 false / should detect false in normal path', () => {
				const opts = _createTestOptions({
					__dirname: '/home/user/project',
				});
				expect(isNpx(opts)).toBe(false);
			});

			it('應該在空環境中檢測為 false / should detect false in empty environment', () => {
				const opts = _createTestOptions({
					__dirname: '/home/user/project',
					env: {},
				});
				expect(isNpx(opts)).toBe(false);
			});

			it('應該在非 NPX 相關的 PNPM_PACKAGE_NAME 中檢測為 false / should detect false with non-NPX related PNPM_PACKAGE_NAME', () => {
				const opts = _createTestOptions({
					__dirname: '/home/user/project',
					env: { PNPM_PACKAGE_NAME: 'some-package' },
				});
				expect(isNpx(opts)).toBe(false);
			});
		});

		describe('邊界案例 / Edge Cases', () => {
			it('應該處理 Windows 路徑格式 / should handle Windows path format', () => {
				const opts = _createTestOptions({
					__dirname: 'C:\\Users\\User\\AppData\\Local\\pnpm-cache\\dlx\\abc123',
				});
				expect(isNpx(opts)).toBe(true);
			});

			it('應該處理大小寫不敏感的路徑 / should handle case-insensitive paths', () => {
				const opts = _createTestOptions({
					__dirname: '/home/user/.cache/YPX_ABC',
				});
				expect(isNpx(opts)).toBe(true);
			});
		});
	});

	describe('_isNpx (deprecated)', () => {
		it('應該在 env._ 以 /npx 結尾時回傳 true / should return true when env._ ends with /npx', () => {
			const opts = _createTestOptions({
				env: { _: '/usr/local/bin/npx' },
			});
			expect(_isNpx(opts)).toBe(true);
		});

		it('應該在 env._ 不以 /npx 結尾時回傳 false / should return false when env._ does not end with /npx', () => {
			const opts = _createTestOptions({
				env: { _: '/usr/local/bin/node' },
			});
			expect(_isNpx(opts)).toBe(false);
		});

		it('應該在 env._ 不存在時回傳 false / should return false when env._ does not exist', () => {
			const opts = _createTestOptions({
				env: {},
			});
			expect(_isNpx(opts)).toBe(false);
		});
	});

	describe('_inNpxPath', () => {
		describe('應該檢測為 true / Should detect as true', () => {
			it('包含 ypx_ 路徑 / contains ypx_ path', () => {
				expect(_inNpxPath('/home/user/.cache/ypx_abc123')).toBe(true);
			});

			it('包含 _npx 路徑 / contains _npx path', () => {
				expect(_inNpxPath('/home/user/.npm/_npx/12345')).toBe(true);
			});

			it('包含 dlx 路徑 / contains dlx path', () => {
				expect(_inNpxPath('/home/user/.pnpm-cache/dlx/abc123')).toBe(true);
			});

			it('包含 Windows 格式的 dlx 路徑 / contains Windows format dlx path', () => {
				expect(_inNpxPath('C:\\Users\\User\\pnpm-cache\\dlx\\abc123')).toBe(true);
			});
		});

		describe('應該檢測為 false / Should detect as false', () => {
			it('普通路徑 / normal path', () => {
				expect(_inNpxPath('/home/user/project')).toBe(false);
			});

			it('空的 ypx（沒有底線）/ ypx without underscore', () => {
				expect(_inNpxPath('/home/user/.cache/ypx')).toBe(false);
			});

			it('包含 npx 但不是路徑標記 / contains npx but not as path marker', () => {
				expect(_inNpxPath('/home/user/myproject')).toBe(false);
			});
		});
	});

	describe('handleOptionsDetectNpx', () => {
		it('應該正確處理並標準化選項 / should process and normalize options', () => {
			const opts = {
				__dirname: '/test',
				env: { TEST: 'value' },
			};
			const result = handleOptionsDetectNpx(opts);

			expect(result).toHaveProperty('__dirname', '/test');
			expect(result).toHaveProperty('env');
			expect(result).toHaveProperty('argv');
		});

		it('應該為缺失的選項提供預設值 / should provide defaults for missing options', () => {
			const opts = {
				__dirname: '/test',
				env: { TEST: 'value' },
			};
			const result = handleOptionsDetectNpx(opts);

			expect(result).toMatchSnapshot({
				argv: expect.any(Array),
			})
		});

		it('應該拋出 RangeError / should throw RangeError', () => {
			const opts = {
				__dirname: '',
				env: null,
			};
			expect(() => handleOptionsDetectNpx(opts as any)).toThrow(RangeError);
		});

	});
});
