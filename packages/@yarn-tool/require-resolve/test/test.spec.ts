import {
	requireResolveExtra,
	isErrorModuleNotFound,
} from '../index';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('整合測試', () =>
{
	const tsdx_path = requireResolveExtra('@bluelovers/tsdx', {
		includeGlobal: true,
		includeCurrentDirectory: true,
	}).result;

	test('ts-jest', (t) =>
	{
		let actual = requireResolveExtra('ts-jest', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		t.assert.snapshot(actual);
	});

	test('typescript', (t) =>
	{
		let actual = requireResolveExtra('typescript', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		t.assert.snapshot(actual);
	});

	test('MODULE_NOT_FOUND', () =>
	{
		let actual = requireResolveExtra('@typescript', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		assert.strictEqual(actual.error?.code, 'MODULE_NOT_FOUND');
		assert.ok(isErrorModuleNotFound(actual.error!));
		assert.strictEqual(actual.result, undefined);
	});
});
