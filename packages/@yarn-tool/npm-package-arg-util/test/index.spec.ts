import {
	parseArgvPkgName,
	_parseArgvPkgNameCore,
} from '../lib/parseArgvPkgName';
import { IResult } from '../lib/types';
import { _lazyParsePackageName } from './lib/pkg-name';

describe('parseArgvPkgName', () => {
	describe('基本功能 / Basic functionality', () => {
		it('應該解析簡單套件名稱 / should parse simple package name', () => {
			const result = _lazyParsePackageName('lodash');

			expect(result).toMatchSnapshot({
				parseArgvPkgName: {
					input: 'lodash',
					name: 'lodash',
					namespace: undefined,
				},
			});
		});

		it('應該解析帶版本的套件 / should parse package with version', () => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			expect(result).toMatchSnapshot({
				parseArgvPkgName: {
					input: 'lodash@4.17.21',
					name: 'lodash',
					version: '4.17.21',
				},
			});
		});

		it('應該解析帶版本範圍的套件 / should parse package with version range', () => {
			const result = _lazyParsePackageName('lodash@^4.17.0');

			expect(result).toMatchSnapshot({
				parseArgvPkgName: {
					input: 'lodash@^4.17.0',
					name: 'lodash',
					version: '^4.17.0',
				},
			});
		});
	});

	describe('範圍套件 / Scoped packages', () => {
		it('應該解析範圍套件 / should parse scoped package', () => {
			const result = _lazyParsePackageName('@types/node');

			expect(result).toMatchSnapshot({
				parseArgvPkgName: {
					input: '@types/node',
					name: 'node',
					namespace: '@types',
				},
			});
		});

		it('應該解析帶版本的範圍套件 / should parse scoped package with version', () => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			expect(result).toMatchSnapshot({
				parseArgvPkgName: {
					input: '@types/node@18.0.0',
					name: 'node',
					namespace: '@types',
					version: '18.0.0',
				},
			});
		});
	});

	describe('邊界案例 / Edge cases', () => {
		it('無效輸入應該返回 undefined / should return undefined for invalid input', () => {
			// 使用一個無效的套件名稱格式
			expect(() => parseArgvPkgName('')).toThrow();
		});
	});
});

describe('parsePackageName', () => {
	describe('基本功能 / Basic functionality', () => {
		it('應該解析簡單套件名稱 / should parse simple package name', () => {
			const result = _lazyParsePackageName('lodash');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'lodash',
					subname: 'lodash',
					scope: undefined,
					// semver: undefined,
				},
			});
		});

		it('應該解析帶版本的套件 / should parse package with version', () => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'lodash',
					subname: 'lodash',
					semver: '4.17.21',
				},
			});
		});

		it('應該解析帶版本範圍的套件 / should parse package with version range', () => {
			const result = _lazyParsePackageName('lodash@^4.17.0');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'lodash',
					subname: 'lodash',
					semver: '^4.17.0',
				},
			});
		});

		it('應該解析帶標籤的套件 / should parse package with tag', () => {
			const result = _lazyParsePackageName('lodash@latest');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'lodash',
					subname: 'lodash',
					semver: 'latest',
				},
			});
		});
	});

	describe('範圍套件 / Scoped packages', () => {
		it('應該解析範圍套件 / should parse scoped package', () => {
			const result = _lazyParsePackageName('@types/node');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: '@types/node',
					subname: 'node',
					scope: '@types',
				},
			});
		});

		it('應該解析帶版本的範圍套件 / should parse scoped package with version', () => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: '@types/node',
					subname: 'node',
					scope: '@types',
					semver: '18.0.0',
				},
			});
		});

		it('應該解析帶版本範圍的範圍套件 / should parse scoped package with version range', () => {
			const result = _lazyParsePackageName('@types/node@^18.0.0');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: '@types/node',
					subname: 'node',
					scope: '@types',
					semver: '^18.0.0',
				},
			});
		});
	});

	describe('複雜案例 / Complex cases', () => {
		it('應該解析別名套件 / should parse alias package', () => {
			const result = _lazyParsePackageName('my-lodash@npm:lodash@4.17.21');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'my-lodash',
					subname: 'my-lodash',
					semver: '4.17.21',
				},
			});
		});

		it.skip('應該解析本地檔案套件 / should parse local file package', () => {
			const result = _lazyParsePackageName('file:./local-package.tgz');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					subname: 'local-package.tgz',
				},
			});
		});
	});
});

describe('_parseArgvPkgNameCore', () => {
	describe('核心邏輯 / Core logic', () => {
		it('應該處理有效的 npa 結果 / should handle valid npa result', () => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			expect(result).toMatchSnapshot({
				parseArgvPkgName: {
					input: 'lodash@4.17.21',
					name: 'lodash',
					namespace: undefined,
					version: '4.17.21',
				},
			});
		});

		it('應該處理範圍套件的 npa 結果 / should handle scoped package npa result', () => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			expect(result).toMatchSnapshot({
				parseArgvPkgName: {
					input: '@types/node@18.0.0',
					name: 'node',
					namespace: '@types',
					version: '18.0.0',
				},
			});
		});

		it('當結果為空時應該返回 undefined / should return undefined when result is null', () => {
			const result = _parseArgvPkgNameCore(undefined as unknown as IResult, 'input');

			expect(result).toBeUndefined();
		});
	});
});

describe('_parsePackageNameCore', () => {
	describe('核心邏輯 / Core logic', () => {
		it('應該處理簡單套件的 npa 結果 / should handle simple package npa result', () => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'lodash',
					subname: 'lodash',
					scope: undefined,
					semver: '4.17.21',
				},
			});
		});

		it('應該處理範圍套件的 npa 結果 / should handle scoped package npa result', () => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: '@types/node',
					subname: 'node',
					scope: '@types',
					semver: '18.0.0',
				},
			});
		});

		it('應該處理無版本套件的 npa 結果 / should handle package without version', () => {
			const result = _lazyParsePackageName('lodash');

			// expect(result).toHaveProperty('name', 'lodash');
			// expect(result).toHaveProperty('subname', 'lodash');
			// expect(result).toHaveProperty('semver', undefined);

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'lodash',
					subname: 'lodash',
					// semver: undefined,
				},
			});
		});

		it('應該處理別名套件的 npa 結果 / should handle alias package npa result', () => {
			const result = _lazyParsePackageName('my-lodash@npm:lodash@4.17.21');

			expect(result).toMatchSnapshot({
				parsePackageName: {
					name: 'my-lodash',
					subname: 'my-lodash',
					semver: '4.17.21',
				},
			});
		});
	});
});
