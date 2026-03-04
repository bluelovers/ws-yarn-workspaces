import { EnumScriptsEntry, scriptsEntryIsNoTestSpecified } from '../../lib/field/scripts';

describe('EnumScriptsEntry', () => {
	describe('應該包含正確的腳本值 / Should contain correct script values', () => {
		it('JEST_TEST 應該是正確的 jest 指令 / JEST_TEST should be correct jest command', () => {
			expect(EnumScriptsEntry.JEST_TEST).toBe('jest --passWithNoTests');
		});

		it('NO_TEST_SPECIFIED 應該是錯誤訊息 / NO_TEST_SPECIFIED should be error message', () => {
			expect(EnumScriptsEntry.NO_TEST_SPECIFIED).toBe('echo "Error: no test specified"');
		});

		it('NO_TEST_SPECIFIED_EXIT 應該是錯誤訊息並退出 / NO_TEST_SPECIFIED_EXIT should be error message and exit', () => {
			expect(EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT).toBe('echo "Error: no test specified" && exit 1');
		});

		it('BUILD_DTS_BUNDLE 應該是正確的 dts-bundle 指令 / BUILD_DTS_BUNDLE should be correct dts-bundle command', () => {
			expect(EnumScriptsEntry.BUILD_DTS_BUNDLE).toBe('ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle');
		});

		it('preversion 應該是測試指令 / preversion should be test command', () => {
			expect(EnumScriptsEntry.preversion).toBe('yarn run test');
		});
	});
});

describe('scriptsEntryIsNoTestSpecified', () => {
	describe('當值為 NO_TEST_SPECIFIED 時 / When value is NO_TEST_SPECIFIED', () => {
		it('應該回傳 true / should return true', () => {
			expect(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.NO_TEST_SPECIFIED)).toBe(true);
		});
	});

	describe('當值為 NO_TEST_SPECIFIED_EXIT 時 / When value is NO_TEST_SPECIFIED_EXIT', () => {
		it('應該回傳 true / should return true', () => {
			expect(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT)).toBe(true);
		});
	});

	describe('當值為其他腳本時 / When value is other scripts', () => {
		it('JEST_TEST 應該回傳 false / JEST_TEST should return false', () => {
			expect(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.JEST_TEST)).toBe(false);
		});

		it('BUILD_DTS_BUNDLE 應該回傳 false / BUILD_DTS_BUNDLE should return false', () => {
			expect(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.BUILD_DTS_BUNDLE)).toBe(false);
		});

		it('preversion 應該回傳 false / preversion should return false', () => {
			expect(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.preversion)).toBe(false);
		});

		it('任意字串應該回傳 false / arbitrary string should return false', () => {
			expect(scriptsEntryIsNoTestSpecified('some random script')).toBe(false);
		});

		it('空字串應該回傳 false / empty string should return false', () => {
			expect(scriptsEntryIsNoTestSpecified('')).toBe(false);
		});
	});

	describe('型別守護功能 / Type guard functionality', () => {
		it('應該正確縮小型別範圍 / should narrow type correctly', () => {
			const value: string = EnumScriptsEntry.NO_TEST_SPECIFIED;

			if (scriptsEntryIsNoTestSpecified(value))
			{
				// 這裡的 value 型別應該被縮小為 EnumScriptsEntry.NO_TEST_SPECIFIED | EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT
				// Type of value here should be narrowed to EnumScriptsEntry.NO_TEST_SPECIFIED | EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT
				expect(value).toBe(EnumScriptsEntry.NO_TEST_SPECIFIED);
			}
		});
	});
});
