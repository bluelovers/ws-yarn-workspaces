import {
	requireResolveExtra,
	isErrorModuleNotFound,
} from '../index';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { _normalizePathForSnapshot } from './lib/test-helper';

describe('整合測試', () =>
{
	const tsdx_path = requireResolveExtra('@bluelovers/tsdx', {
		includeGlobal: true,
		includeCurrentDirectory: true,
	}).result;

	test('ts-jest', (t) =>
	{
		const name = 'ts-jest';
		let actual = requireResolveExtra(name, {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		actual.result = _normalizePathForSnapshot(actual.result, name);

		t.assert.snapshot(actual);
	});

	test('typescript', (t) =>
	{
		const name = 'typescript';
		let actual = requireResolveExtra(name, {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		actual.result = _normalizePathForSnapshot(actual.result, name);

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
