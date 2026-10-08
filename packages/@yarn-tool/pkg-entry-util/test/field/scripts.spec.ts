import { EnumScriptsEntry, scriptsEntryIsNoTestSpecified } from '../../lib/field/scripts';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('scriptsEntryIsNoTestSpecified', () => {
	describe('當值為 NO_TEST_SPECIFIED 時 / When value is NO_TEST_SPECIFIED', () => {
		it('應該回傳 true / should return true', () => {
			assert.strictEqual(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.NO_TEST_SPECIFIED), true);
		});
	});

	describe('當值為 NO_TEST_SPECIFIED_EXIT 時 / When value is NO_TEST_SPECIFIED_EXIT', () => {
		it('應該回傳 true / should return true', () => {
			assert.strictEqual(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT), true);
		});
	});

	describe('當值為其他腳本時 / When value is other scripts', () => {
		it('JEST_TEST 應該回傳 false / JEST_TEST should return false', () => {
			assert.strictEqual(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.JEST_TEST), false);
		});

		it('BUILD_DTS_BUNDLE 應該回傳 false / BUILD_DTS_BUNDLE should return false', () => {
			assert.strictEqual(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.BUILD_DTS_BUNDLE), false);
		});

		it('preversion 應該回傳 false / preversion should return false', () => {
			assert.strictEqual(scriptsEntryIsNoTestSpecified(EnumScriptsEntry.preversion), false);
		});

		it('任意字串應該回傳 false / arbitrary string should return false', () => {
			assert.strictEqual(scriptsEntryIsNoTestSpecified('some random script'), false);
		});

		it('空字串應該回傳 false / empty string should return false', () => {
			assert.strictEqual(scriptsEntryIsNoTestSpecified(''), false);
		});
	});

	describe('型別守護功能 / Type guard functionality', () => {
		it('應該正確縮小型別範圍 / should narrow type correctly', () => {
			const value: string = EnumScriptsEntry.NO_TEST_SPECIFIED;

			if (scriptsEntryIsNoTestSpecified(value))
			{
				// 這裡的 value 型別應該被縮小為 EnumScriptsEntry.NO_TEST_SPECIFIED | EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT
				// Type of value here should be narrowed to EnumScriptsEntry.NO_TEST_SPECIFIED | EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT
				assert.strictEqual(value, EnumScriptsEntry.NO_TEST_SPECIFIED);
			}
		});
	});
});
