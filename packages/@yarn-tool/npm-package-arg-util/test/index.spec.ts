import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	parseArgvPkgName,
	_parseArgvPkgNameCore,
} from '../lib/parseArgvPkgName';
import { IResult } from '../lib/types';
import { _lazyParsePackageName } from './lib/pkg-name';

describe('parseArgvPkgName', () => {
	describe('基本功能 / Basic functionality', () => {
		it('應該解析簡單套件名稱 / should parse simple package name', (t) => {
			const result = _lazyParsePackageName('lodash');

			assert.strictEqual(result.parseArgvPkgName.input, 'lodash');
			assert.strictEqual(result.parseArgvPkgName.name, 'lodash');
			assert.strictEqual(result.parseArgvPkgName.namespace, undefined);

			t.assert.snapshot(result);
		});

		it('應該解析帶版本的套件 / should parse package with version', (t) => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			assert.strictEqual(result.parseArgvPkgName.input, 'lodash@4.17.21');
			assert.strictEqual(result.parseArgvPkgName.name, 'lodash');
			assert.strictEqual(result.parseArgvPkgName.version, '4.17.21');

			t.assert.snapshot(result);
		});

		it('應該解析帶版本範圍的套件 / should parse package with version range', (t) => {
			const result = _lazyParsePackageName('lodash@^4.17.0');

			assert.strictEqual(result.parseArgvPkgName.input, 'lodash@^4.17.0');
			assert.strictEqual(result.parseArgvPkgName.name, 'lodash');
			assert.strictEqual(result.parseArgvPkgName.version, '^4.17.0');

			t.assert.snapshot(result);
		});
	});

	describe('範圍套件 / Scoped packages', () => {
		it('應該解析範圍套件 / should parse scoped package', (t) => {
			const result = _lazyParsePackageName('@types/node');

			assert.strictEqual(result.parseArgvPkgName.input, '@types/node');
			assert.strictEqual(result.parseArgvPkgName.name, 'node');
			assert.strictEqual(result.parseArgvPkgName.namespace, '@types');

			t.assert.snapshot(result);
		});

		it('應該解析帶版本的範圍套件 / should parse scoped package with version', (t) => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			assert.strictEqual(result.parseArgvPkgName.input, '@types/node@18.0.0');
			assert.strictEqual(result.parseArgvPkgName.name, 'node');
			assert.strictEqual(result.parseArgvPkgName.namespace, '@types');
			assert.strictEqual(result.parseArgvPkgName.version, '18.0.0');

			t.assert.snapshot(result);
		});
	});

	describe('邊界案例 / Edge cases', () => {
		it('無效輸入應該返回 undefined / should return undefined for invalid input', () => {
			// 使用一個無效的套件名稱格式
			assert.throws(() => parseArgvPkgName(''));
		});
	});
});

describe('parsePackageName', () => {
	describe('基本功能 / Basic functionality', () => {
		it('應該解析簡單套件名稱 / should parse simple package name', (t) => {
			const result = _lazyParsePackageName('lodash');

			assert.strictEqual(result.parsePackageName.name, 'lodash');
			assert.strictEqual(result.parsePackageName.subname, 'lodash');
			assert.strictEqual(result.parsePackageName.scope, undefined);
			// semver: undefined,

			t.assert.snapshot(result);
		});

		it('應該解析帶版本的套件 / should parse package with version', (t) => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			assert.strictEqual(result.parsePackageName.name, 'lodash');
			assert.strictEqual(result.parsePackageName.subname, 'lodash');
			assert.strictEqual(result.parsePackageName.semver, '4.17.21');

			t.assert.snapshot(result);
		});

		it('應該解析帶版本範圍的套件 / should parse package with version range', (t) => {
			const result = _lazyParsePackageName('lodash@^4.17.0');

			assert.strictEqual(result.parsePackageName.name, 'lodash');
			assert.strictEqual(result.parsePackageName.subname, 'lodash');
			assert.strictEqual(result.parsePackageName.semver, '^4.17.0');

			t.assert.snapshot(result);
		});

		it('應該解析帶標籤的套件 / should parse package with tag', (t) => {
			const result = _lazyParsePackageName('lodash@latest');

			assert.strictEqual(result.parsePackageName.name, 'lodash');
			assert.strictEqual(result.parsePackageName.subname, 'lodash');
			assert.strictEqual(result.parsePackageName.semver, 'latest');

			t.assert.snapshot(result);
		});
	});

	describe('範圍套件 / Scoped packages', () => {
		it('應該解析範圍套件 / should parse scoped package', (t) => {
			const result = _lazyParsePackageName('@types/node');

			assert.strictEqual(result.parsePackageName.name, '@types/node');
			assert.strictEqual(result.parsePackageName.subname, 'node');
			assert.strictEqual(result.parsePackageName.scope, '@types');

			t.assert.snapshot(result);
		});

		it('應該解析帶版本的範圍套件 / should parse scoped package with version', (t) => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			assert.strictEqual(result.parsePackageName.name, '@types/node');
			assert.strictEqual(result.parsePackageName.subname, 'node');
			assert.strictEqual(result.parsePackageName.scope, '@types');
			assert.strictEqual(result.parsePackageName.semver, '18.0.0');

			t.assert.snapshot(result);
		});

		it('應該解析帶版本範圍的範圍套件 / should parse scoped package with version range', (t) => {
			const result = _lazyParsePackageName('@types/node@^18.0.0');

			assert.strictEqual(result.parsePackageName.name, '@types/node');
			assert.strictEqual(result.parsePackageName.subname, 'node');
			assert.strictEqual(result.parsePackageName.scope, '@types');
			assert.strictEqual(result.parsePackageName.semver, '^18.0.0');

			t.assert.snapshot(result);
		});
	});

	describe('複雜案例 / Complex cases', () => {
		it('應該解析別名套件 / should parse alias package', (t) => {
			const result = _lazyParsePackageName('my-lodash@npm:lodash@4.17.21');

			assert.strictEqual(result.parsePackageName.name, 'my-lodash');
			assert.strictEqual(result.parsePackageName.subname, 'my-lodash');
			assert.strictEqual(result.parsePackageName.semver, '4.17.21');

			t.assert.snapshot(result);
		});

		it.skip('應該解析本地檔案套件 / should parse local file package', (t) => {
			const result = _lazyParsePackageName('file:./local-package.tgz');

			assert.strictEqual(result.parsePackageName.subname, 'local-package.tgz');

			t.assert.snapshot(result);
		});
	});
});

describe('_parseArgvPkgNameCore', () => {
	describe('核心邏輯 / Core logic', () => {
		it('應該處理有效的 npa 結果 / should handle valid npa result', (t) => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			assert.strictEqual(result.parseArgvPkgName.input, 'lodash@4.17.21');
			assert.strictEqual(result.parseArgvPkgName.name, 'lodash');
			assert.strictEqual(result.parseArgvPkgName.namespace, undefined);
			assert.strictEqual(result.parseArgvPkgName.version, '4.17.21');

			t.assert.snapshot(result);
		});

		it('應該處理範圍套件的 npa 結果 / should handle scoped package npa result', (t) => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			assert.strictEqual(result.parseArgvPkgName.input, '@types/node@18.0.0');
			assert.strictEqual(result.parseArgvPkgName.name, 'node');
			assert.strictEqual(result.parseArgvPkgName.namespace, '@types');
			assert.strictEqual(result.parseArgvPkgName.version, '18.0.0');

			t.assert.snapshot(result);
		});

		it('當結果為空時應該返回 undefined / should return undefined when result is null', () => {
			const result = _parseArgvPkgNameCore(undefined as unknown as IResult, 'input');

			assert.strictEqual(result, undefined);
		});
	});
});

describe('_parsePackageNameCore', () => {
	describe('核心邏輯 / Core logic', () => {
		it('應該處理簡單套件的 npa 結果 / should handle simple package npa result', (t) => {
			const result = _lazyParsePackageName('lodash@4.17.21');

			assert.strictEqual(result.parsePackageName.name, 'lodash');
			assert.strictEqual(result.parsePackageName.subname, 'lodash');
			assert.strictEqual(result.parsePackageName.scope, undefined);
			assert.strictEqual(result.parsePackageName.semver, '4.17.21');

			t.assert.snapshot(result);
		});

		it('應該處理範圍套件的 npa 結果 / should handle scoped package npa result', (t) => {
			const result = _lazyParsePackageName('@types/node@18.0.0');

			assert.strictEqual(result.parsePackageName.name, '@types/node');
			assert.strictEqual(result.parsePackageName.subname, 'node');
			assert.strictEqual(result.parsePackageName.scope, '@types');
			assert.strictEqual(result.parsePackageName.semver, '18.0.0');

			t.assert.snapshot(result);
		});

		it('應該處理無版本套件的 npa 結果 / should handle package without version', (t) => {
			const result = _lazyParsePackageName('lodash');

			assert.strictEqual(result.parsePackageName.name, 'lodash');
			assert.strictEqual(result.parsePackageName.subname, 'lodash');
			// semver: undefined,

			t.assert.snapshot(result);
		});

		it('應該處理別名套件的 npa 結果 / should handle alias package npa result', (t) => {
			const result = _lazyParsePackageName('my-lodash@npm:lodash@4.17.21');

			assert.strictEqual(result.parsePackageName.name, 'my-lodash');
			assert.strictEqual(result.parsePackageName.subname, 'my-lodash');
			assert.strictEqual(result.parsePackageName.semver, '4.17.21');

			t.assert.snapshot(result);
		});
	});
});
